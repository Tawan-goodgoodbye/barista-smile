export enum AppState {
  LANDING = 'LANDING',
  CAMERA = 'CAMERA',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface WhiteningResult {
  originalImage: string; // Base64
  processedImage: string; // Base64
}

export interface ProcessingError {
  message: string;
}
