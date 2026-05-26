export type BgRemoverMode = 'browser' | 'api' | 'hybrid';

export interface BgRemoverOptions {
  onProgress?: (status: string) => void;
  mode?: BgRemoverMode;
}

export interface BgRemoverResult {
  url: string;
  method: 'browser' | 'api' | 'original';
}

export interface IBgRemover {
  removeBackground(file: File, options?: BgRemoverOptions): Promise<string>;
}
