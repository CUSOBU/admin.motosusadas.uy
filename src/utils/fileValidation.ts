export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ["image/"],
  } = options;

  // Validate file type
  const isValidType = allowedTypes.some((type) =>
    type.endsWith("/") ? file.type.startsWith(type) : file.type === type
  );

  if (!isValidType) {
    return {
      isValid: false,
      error: "invalid-file-type",
    };
  }

  // Validate file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "file-too-large",
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
