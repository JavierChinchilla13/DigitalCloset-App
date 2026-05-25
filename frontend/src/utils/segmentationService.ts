import { pipeline, env, type ImageSegmentationPipeline, type ImageSegmentationOutput } from '@huggingface/transformers';

// Configuration for Transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

class SegmentationService {
  private segmenter: ImageSegmentationPipeline | null = null;
  private modelName = 'Xenova/segformer_b2_clothes';

  async init() {
    if (this.segmenter) return;
    
    try {
      this.segmenter = await pipeline('image-segmentation', this.modelName, {
        device: 'webgpu',
      }) as ImageSegmentationPipeline;
    } catch (err) {
      console.warn("WebGPU not available, falling back to WASM/CPU", err);
      this.segmenter = await pipeline('image-segmentation', this.modelName) as ImageSegmentationPipeline;
    }
  }

  async segmentJacket(imageSource: string | HTMLImageElement | File): Promise<Map<string, Blob>> {
    await this.init();
    if (!this.segmenter) throw new Error("Segmenter not initialized");

    let source: string;
    if (imageSource instanceof File) {
      source = await this.fileToDataURL(imageSource);
    } else if (imageSource instanceof HTMLImageElement) {
      source = imageSource.src;
    } else {
      source = imageSource;
    }

    const output = await this.segmenter(source);
    return this.processOutput(output, source);
  }

  private async processOutput(output: ImageSegmentationOutput, originalSource: string | HTMLImageElement): Promise<Map<string, Blob>> {
    const labelMap: Record<string, string> = {
      'Upper-clothes': 'torso',
      'Coat': 'torso',
      'Jumpsuits': 'torso',
      'Dress': 'torso', 
      'Left-arm': 'leftSleeve',
      'Right-arm': 'rightSleeve',
      'Necklace': 'collar', 
      'Scarf': 'collar',
      'Gloves': 'leftSleeve',
    };

    console.log('AI Segmentation Output:', output.map(s => s.label));

    const originalImg = await this.loadImage(originalSource);
    const results = new Map<string, Blob>();

    // 1. Check if we have AI-detected sleeves
    const hasSleeves = output.some(s => labelMap[s.label]?.includes('Sleeve'));

    if (hasSleeves) {
      // Group segments by canonical label
      const groupedSegments = new Map<string, any[]>();
      for (const segment of output) {
        const canonicalLabel = labelMap[segment.label];
        if (canonicalLabel) {
          if (!groupedSegments.has(canonicalLabel)) groupedSegments.set(canonicalLabel, []);
          groupedSegments.get(canonicalLabel)!.push(segment);
        }
      }

      for (const [label, segments] of groupedSegments.entries()) {
        const blob = await this.createBlobFromSegments(segments, originalImg);
        results.set(label, blob);
      }
    } else {
      // 2. Fallback: Geometric Smart Split
      // If AI only found one big garment, we split it into 3 parts based on width
      console.warn('AI did not detect independent sleeves. Using Geometric Smart Split fallback.');
      
      const garmentSegments = output.filter(s => labelMap[s.label] === 'torso');
      if (garmentSegments.length > 0) {
        const fullGarmentBlob = await this.createBlobFromSegments(garmentSegments, originalImg);
        const fullGarmentImg = await this.loadImage(URL.createObjectURL(fullGarmentBlob));
        
        const w = fullGarmentImg.width;
        const h = fullGarmentImg.height;

        // Split definitions (Left 28%, Center 44%, Right 28%)
        const splits = [
          { name: 'leftSleeve', x: 0, width: w * 0.28 },
          { name: 'torso', x: w * 0.28, width: w * 0.44 },
          { name: 'rightSleeve', x: w * 0.72, width: w * 0.28 }
        ];

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        for (const split of splits) {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(fullGarmentImg, 0, 0);
          
          // Clip to the split region
          ctx.globalCompositeOperation = 'destination-in';
          ctx.fillStyle = 'white';
          ctx.fillRect(split.x, 0, split.width, h);
          ctx.globalCompositeOperation = 'source-over';

          const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
          results.set(split.name, blob);
        }
      }
    }

    return results;
  }

  private async createBlobFromSegments(segments: any[], originalImg: HTMLImageElement): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    for (const segment of segments) {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = segment.mask.width;
      maskCanvas.height = segment.mask.height;
      const maskCtx = maskCanvas.getContext('2d')!;
      
      const maskData = segment.mask.data;
      const rgbaData = new Uint8ClampedArray(maskData.length * 4);
      
      for (let i = 0; i < maskData.length; ++i) {
        rgbaData[i * 4] = 0;
        rgbaData[i * 4 + 1] = 0;
        rgbaData[i * 4 + 2] = 0;
        rgbaData[i * 4 + 3] = maskData[i] > 0 ? 255 : 0;
      }

      const imageData = new ImageData(rgbaData, segment.mask.width, segment.mask.height);
      maskCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
    }

    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(originalImg, 0, 0);

    return new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  private loadImage(source: string | HTMLImageElement): Promise<HTMLImageElement> {
    if (source instanceof HTMLImageElement) return Promise.resolve(source);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.src = source;
    });
  }
}

export const segmentationService = new SegmentationService();
