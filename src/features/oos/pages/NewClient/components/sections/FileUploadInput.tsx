import { useState, useRef } from "react";
import { Upload, X, Loader2, Eye } from "lucide-react";
import FilePreviewOverlay from "../../../../../../components/common/FilePreviewOverlay";
import type { FileReference } from "../../../../../../types/client-info";
import { useNewClient } from "../../context/NewClientContext";

interface FileUploadInputProps {
  label: string;
  value: FileReference | null;
  onChange: (value: FileReference | null) => void;
}

export default function FileUploadInput({
  label,
  value,
  onChange,
}: FileUploadInputProps) {
  const { uploadFile } = useNewClient();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";

    setIsUploading(true);
    setError(null);

    try {
      const ref = await uploadFile(file);
      onChange(ref);
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="flex-1 truncate text-sm text-primary" title={value.name}>
            {value.name}
          </span>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="shrink-0 rounded p-1 text-gray-400 hover:text-accent transition-colors"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 rounded p-1 text-gray-400 hover:text-status-rejected transition-colors"
            title="Remove"
          >
            <X className="h-4 w-4" />
          </button>

          {previewOpen && (
            <FilePreviewOverlay
              fileId={value.id}
              fileName={value.name}
              setModalOpen={setPreviewOpen}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500 hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload file
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && (
        <p className="mt-1 text-xs text-status-rejected">{error}</p>
      )}
    </div>
  );
}
