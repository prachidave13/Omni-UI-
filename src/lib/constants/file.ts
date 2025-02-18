// Constants for file operations

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = {
  image: [".jpg", ".jpeg", ".png", ".gif"],
  document: [".pdf", ".doc", ".docx", ".txt"],
  requirements: [".pdf", ".doc", ".docx", ".txt"],
  inspiration: [".jpg", ".jpeg", ".png", ".gif"],
};

export const UPLOAD_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;
