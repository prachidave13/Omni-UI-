// Types related to file operations

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export type AllowedFileType = "image" | "document" | "video" | "audio";
