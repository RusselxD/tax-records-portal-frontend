import { useState, useRef, type DragEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import FileRow from "./FileRow";
import FilePreviewOverlay from "./FilePreviewOverlay";
import { useToast } from "../../contexts/ToastContext";
import { getErrorMessage } from "../../lib/api-error";
import { validateDocumentFile } from "../../lib/file-validation";
import type { FileReference } from "../../types/client-info";

interface MultiFileDropZoneProps {
  label: string;
  value: FileReference[] | null | undefined;
  onChange: (value: FileReference[]) => void;
  uploadFile: (file: File) => Promise<FileReference>;
}

export default function MultiFileDropZone({
  label,
  value: rawValue,
  onChange,
  uploadFile,
}: MultiFileDropZoneProps) {
  const { toastError } = useToast();
  const value = rawValue ?? [];
  const valueRef = useRef(value);
  valueRef.current = value;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileReference | null>(null);

  const handleUploadMultiple = async (fileList: FileList) => {
    if (fileList.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      for (const file of Array.from(fileList)) {
        const result = validateDocumentFile(file);
        if (!result.valid) {
          toastError(result.error!);
          continue;
        }
        const ref = await uploadFile(file);
        const updated = [...valueRef.current, ref];
        valueRef.current = updated;
        onChange(updated);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Some files failed to upload"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUploadMultiple(e.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {value.length > 0 && (
        <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
          {value.map((file) => (
            <FileRow
              key={file.id}
              name={file.name}
              onClick={() => setPreviewFile(file)}
              onRemove={() => handleRemove(file.id)}
            />
          ))}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-5 cursor-pointer transition-colors ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-gray-400" />
        )}
        <p className="text-sm text-gray-500">
          {isUploading
            ? "Uploading..."
            : <>Drag & drop or <span className="text-accent font-medium">browse</span></>}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUploadMultiple(e.target.files);
            }
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-status-rejected">{error}</p>
      )}

      {previewFile && (
        <FilePreviewOverlay
          fileId={previewFile.id}
          fileName={previewFile.name}
          setModalOpen={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
