import {
  useRef,
  useState,
  type DragEvent,
} from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
} from "lucide-react";

interface FileUploadZoneProps {
  file: File | null;
  isSubmitting: boolean;
  onFileSelect: (file: File | null) => void;
  onRemoveFile: () => void;
}

export default function FileUploadZone({
  file,
  isSubmitting,
  onFileSelect,
  onRemoveFile,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-primary">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        {!isSubmitting && (
          <button
            onClick={onRemoveFile}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors ${
        isDragging
          ? "border-accent bg-accent/5"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <Upload className="w-8 h-8 text-gray-400" />
      <p className="text-sm text-gray-500">
        Drag & drop your file here, or{" "}
        <span className="text-accent font-medium">browse</span>
      </p>
      <p className="text-xs text-gray-400">Supports .xlsx files</p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
