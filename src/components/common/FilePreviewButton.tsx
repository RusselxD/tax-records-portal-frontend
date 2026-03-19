import { useState } from "react";
import { Eye } from "lucide-react";
import FilePreviewOverlay from "./FilePreviewOverlay";

export interface FilePreviewButtonProps {
  fileId: string;
  fileName: string;
}

export default function FilePreviewButton({ fileId, fileName }: FilePreviewButtonProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>

      {previewOpen && (
        <FilePreviewOverlay
          fileId={fileId}
          fileName={fileName}
          setModalOpen={setPreviewOpen}
        />
      )}
    </>
  );
}
