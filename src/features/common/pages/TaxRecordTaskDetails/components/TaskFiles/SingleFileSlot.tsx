import { useState, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { FileCard } from "../../../../../../components/common/file-cards";
import type { FileItem } from "../../../../../../types/tax-record-task";

interface SingleFileSlotProps {
  label: string;
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  file: FileItem | null;
  canEdit: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function SingleFileSlot({
  label,
  icon,
  emptyIcon,
  file,
  canEdit,
  onUpload,
  onDelete,
}: SingleFileSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (selected: File) => {
    setIsUploading(true);
    try {
      await onUpload(selected);
    } finally {
      setIsUploading(false);
    }
  };

  if (file) {
    return (
      <div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          {label}
        </h3>
        <div className="w-72">
          <FileCard
            size="sm"
            icon={icon}
            emptyIcon={emptyIcon}
            title={label}
            file={file}
            emptyMessage=""
            action={canEdit ? (
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : undefined}
          />
        </div>
      </div>
    );
  }

  if (canEdit) {
    return (
      <div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          {label}
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 hover:border-gray-400 px-4 py-3 w-full text-sm text-gray-500 transition-colors"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? "Uploading..." : "Upload file"}
        </button>
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

  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {label}
      </h3>
      <p className="text-sm text-gray-400">No file uploaded.</p>
    </div>
  );
}
