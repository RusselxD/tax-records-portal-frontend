import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import FileRow from "../../../../../../components/common/FileRow";
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {value ? (
        <FileRow
          name={value.name}
          onClick={() => setPreviewOpen(true)}
          onRemove={handleRemove}
        />
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

      {previewOpen && value && (
        <FilePreviewOverlay
          fileId={value.id}
          fileName={value.name}
          setModalOpen={setPreviewOpen}
        />
      )}
    </div>
  );
}
