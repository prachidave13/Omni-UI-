// Constants for file operations

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = {
  image: [".jpg", ".jpeg", ".png", ".gif"],
  document: [".pdf", ".doc", ".docx"],
  video: [".mp4", ".mov", ".avi"],
  audio: [".mp3", ".wav", ".ogg"],
  model: [".gltf", ".glb"],
};

export const UPLOAD_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;
