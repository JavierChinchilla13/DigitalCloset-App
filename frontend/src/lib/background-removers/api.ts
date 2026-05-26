import type { IBgRemover, BgRemoverOptions } from "./types";

const API_URL = import.meta.env.VITE_BG_REMOVER_API_URL || 'http://localhost:8000/remove-bg';

export class ApiBgRemover implements IBgRemover {
  async removeBackground(file: File, options?: BgRemoverOptions): Promise<string> {
    console.log('Using API Background Remover (FastAPI/rembg)');
    
    if (options?.onProgress) options.onProgress('Uploading to AI server...');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API background removal failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
