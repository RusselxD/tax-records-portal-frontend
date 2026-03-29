const DOCUMENT_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "csv",
  "jpg", "jpeg", "png", "gif", "webp",
  "dat",
]);

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp",
]);

const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDocumentFile(file: File): FileValidationResult {
  const ext = getExtension(file.name);
  if (!DOCUMENT_EXTENSIONS.has(ext)) {
    return { valid: false, error: `"${file.name}" — file type .${ext} is not supported.` };
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return { valid: false, error: `"${file.name}" exceeds the 25MB size limit (${formatSize(file.size)}).` };
  }
  return { valid: true };
}

export function validateImageFile(file: File): FileValidationResult {
  const ext = getExtension(file.name);
  if (!IMAGE_EXTENSIONS.has(ext)) {
    return { valid: false, error: `"${file.name}" — only image files are allowed.` };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `"${file.name}" exceeds the 10MB size limit (${formatSize(file.size)}).` };
  }
  return { valid: true };
}

export function validateDocumentFiles(files: FileList | File[]): FileValidationResult {
  for (const file of Array.from(files)) {
    const result = validateDocumentFile(file);
    if (!result.valid) return result;
  }
  return { valid: true };
}
