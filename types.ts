export interface FileData {
  name: string;
  content: string; // Extracted text or HTML
  originalFile: File;
}

export enum AppStep {
  API_KEY = 'API_KEY',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
}

export interface ProcessingState {
  isLoading: boolean;
  message: string;
  error?: string;
}

// Declaration for global window libraries loaded via CDN
declare global {
  interface Window {
    mammoth: {
      convertToHtml: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
      extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
    };
  }
}