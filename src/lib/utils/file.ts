// Utility functions for file operations
// Suggested implementations:
// 1. File type validation
// 2. File size validation
// 3. File name formatting
// 4. File extension checking

export const validateFileType = (
  file: File,
  allowedTypes: string[],
): boolean => {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(extension);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  // Implement file size validation
  return true;
};

export const formatFileName = (fileName: string): string => {
  // Implement file name formatting
  return fileName;
};
