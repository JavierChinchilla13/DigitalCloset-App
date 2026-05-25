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
      // Increased timeout for model loading
      this.segmenter = await pipeline('image-segmentation', this.modelName) as ImageSegmentationPipeline;
    }
  }

  async segmentJacket(imageSource: string | HTMLImageElement | File): Promise<Map<string, Blob>> {
    await this.init();
    if (!this.segmenter) throw new Error("Segmenter not initialized");

    let source: string | HTMLImageElement;
    if (imageSource instanceof File) {
      source = await this.fileToDataURL(imageSource);
    } else {
      source = imageSource;
    }

    // Ensure the image is fully loaded before segmentation
    const img = await this.loadImage(source);
    const output = await this.segmenter(img);
    return this.processOutput(output, img);
  }

  private async processOutput(output: ImageSegmentationOutput, originalSource: string | HTMLImageElement): Promise<Map<string, Blob>> {
    const results = new Map<string, Blob>();
    
    // Label Mapping for SegFormer Clothes
    // 4: Upper-clothes (Torso)
    // 14: Left-arm (Left Sleeve)
    // 15: Right-arm (Right Sleeve)
    // 1: Hat (Wait, we might want to group things)
    
    const labelMap: Record<string, string> = {
      'Upper-clothes': 'torso',
      'Coat': 'torso',
      'Jumpsuits': 'torso',
      'Dress': 'torso', // Long coats often labeled as dress
      'Left-arm': 'leftSleeve',
      'Right-arm': 'rightSleeve',
      'Necklace': 'collar', 
      'Scarf': 'collar',
      'Gloves': 'leftSleeve', // Sometimes sleeves or cuffs
    };

    const originalImg = await this.loadImage(originalSource);
    
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
      const canvas = document.createElement('canvas');
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false; // Prevent fuzzy mask edges

      // Draw all masks for this label group
      for (const segment of segments) {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = segment.mask.width;
        maskCanvas.height = segment.mask.height;
        const maskCtx = maskCanvas.getContext('2d')!;
        
        const maskData = segment.mask.data;
        const rgbaData = new Uint8ClampedArray(maskData.length * 4);
        
        for (let i = 0; i < maskData.length; ++i) {
          const value = maskData[i];
          rgbaData[i * 4] = 0;
          rgbaData[i * 4 + 1] = 0;
          rgbaData[i * 4 + 2] = 0;
          rgbaData[i * 4 + 3] = value > 0 ? 255 : 0;
        }

        const imageData = new ImageData(rgbaData, segment.mask.width, segment.mask.height);
        maskCtx.putImageData(imageData, 0, 0);

        // Scale mask to original image size and draw (additive)
        ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
      }

      // Apply masks as a global clip for the original image
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(originalImg, 0, 0);

      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
      results.set(label, blob);
    }

    return results;
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
