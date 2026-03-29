import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { FilePreviewOverlay } from "..";
import { fileExtColor } from "./file-ext-color";

const ICON_BADGE = "shrink-0 flex items-center justify-center h-9 w-9 rounded-lg";

interface WorkingFileItemProps {
  fileId: string;
  fileName: string;
  /** Optional action (e.g. delete button) rendered on the right */
  action?: React.ReactNode;
  /** When true, preview is disabled */
  disabled?: boolean;
}

export function WorkingFileItem({ fileId, fileName, action, disabled = false }: WorkingFileItemProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";
  const color = fileExtColor(ext);

  return (
    <>
      <div className={`flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 transition-colors ${disabled ? "opacity-60" : "hover:bg-gray-100 hover:border-gray-200"}`}>
        <button
          type="button"
          onClick={disabled ? undefined : () => setPreviewOpen(true)}
          disabled={disabled}
          className={`flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 text-left ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className={`${ICON_BADGE} ${color.bg}`}>
            <FileText className={`h-4 w-4 ${color.text}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary truncate leading-relaxed">
              {fileName}
            </p>
            <p className="text-xs text-gray-400 uppercase">{ext || "file"}</p>
          </div>
        </button>
        {action && (
          <div className="pr-3 shrink-0">
            {action}
          </div>
        )}
      </div>
      {previewOpen && (
        <FilePreviewOverlay fileId={fileId} fileName={fileName} setModalOpen={setPreviewOpen} />
      )}
    </>
  );
}

interface WorkingLinkItemProps {
  url: string | null;
  label: string | null;
  /** Optional action (e.g. delete button) rendered on the right */
  action?: React.ReactNode;
}

export function WorkingLinkItem({ url, label, action }: WorkingLinkItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-colors group">
      <a
        href={url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5"
      >
        <div className={`${ICON_BADGE} bg-blue-100`}>
          <ExternalLink className="h-4 w-4 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary truncate leading-relaxed">
            {label || url}
          </p>
          <p className="text-xs text-gray-400">External link</p>
        </div>
        <span className="text-xs font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          Open
        </span>
      </a>
      {action && (
        <div className="pr-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
