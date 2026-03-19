import { useState, useRef } from "react";
import { FileText, Upload, Trash2, Loader2 } from "lucide-react";
import { FilePreviewButton } from "../../../../../../components/common";
import type { FileItem } from "../../../../../../types/tax-record-task";

interface SingleFileSlotProps {
  label: string;
  file: FileItem | null;
  canEdit: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function SingleFileSlot({
  label,
  file,
  canEdit,
  onUpload,
  onDelete,
}: SingleFileSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = async (selected: File) => {
    setIsUploading(true);
    try {
      await onUpload(selected);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {label}
      </h3>

      {file ? (
        <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="flex-1 text-sm text-primary font-medium leading-relaxed min-w-0">
            {file.name}
          </span>
          <FilePreviewButton fileId={file.id} fileName={file.name} />
          {canEdit && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      ) : canEdit ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 hover:border-gray-400 px-4 py-3 w-full text-sm text-gray-500 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading ? "Uploading..." : "Upload file"}
        </button>
      ) : (
        <p className="text-sm text-gray-400">No file uploaded.</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
