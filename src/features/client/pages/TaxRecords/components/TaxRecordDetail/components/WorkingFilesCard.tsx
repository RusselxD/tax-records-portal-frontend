import { useState } from "react";
import { FileText, ExternalLink, FolderOpen } from "lucide-react";
import { FilePreviewOverlay } from "../../../../../../../components/common";
import type { TaxRecordEntryResponse } from "../../../../../../../types/tax-record";
import EmptyCardState from "./EmptyCardState";
import { CARD_SHELL, FILE_ICON_BADGE } from "../constants";

interface WorkingFilesCardProps {
  fileEntries: TaxRecordEntryResponse["workingFiles"];
  linkEntries: TaxRecordEntryResponse["workingFiles"];
  hasFiles: boolean;
}

export default function WorkingFilesCard({
  fileEntries,
  linkEntries,
  hasFiles,
}: WorkingFilesCardProps) {
  return (
    <div className={CARD_SHELL}>
      {!hasFiles ? (
        <EmptyCardState
          icon={<FolderOpen className="h-10 w-10" />}
          title="Working Files"
          message="No files available"
        />
      ) : (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="h-4 w-4 text-violet-500" />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Working Files
            </h3>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {fileEntries.map((f) => (
              <WorkingFileItem key={f.fileId} fileId={f.fileId} fileName={f.fileName} />
            ))}
            {linkEntries.map((l, i) => (
              <WorkingLinkItem key={i} url={l.url} label={l.label} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── File Item (clickable → preview) ── */

function WorkingFileItem({ fileId, fileName }: { fileId: string; fileName: string }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";
  const color = fileExtColor(ext);

  return (
    <>
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="w-full flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 hover:bg-gray-100 hover:border-gray-200 transition-colors cursor-pointer text-left"
      >
        <div className={`${FILE_ICON_BADGE} ${color.bg}`}>
          <FileText className={`h-4 w-4 ${color.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary truncate leading-relaxed">
            {fileName}
          </p>
          <p className="text-xs text-gray-400 uppercase">{ext || "file"}</p>
        </div>
      </button>
      {previewOpen && (
        <FilePreviewOverlay fileId={fileId} fileName={fileName} setModalOpen={setPreviewOpen} />
      )}
    </>
  );
}

/* ── Link Item ── */

function WorkingLinkItem({ url, label }: { url?: string | null; label?: string | null }) {
  return (
    <a
      href={url ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-2.5 hover:bg-blue-50 transition-colors group"
    >
      <div className={`${FILE_ICON_BADGE} bg-blue-100`}>
        <ExternalLink className="h-4 w-4 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary truncate leading-relaxed">
          {label || url}
        </p>
        <p className="text-xs text-gray-400">External link</p>
      </div>
      <span className="text-xs font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
        Open
      </span>
    </a>
  );
}

/* ── File extension → color map ── */

function fileExtColor(ext: string): { bg: string; text: string } {
  switch (ext) {
    case "pdf":
      return { bg: "bg-red-100", text: "text-red-600" };
    case "doc":
    case "docx":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "xls":
    case "xlsx":
    case "csv":
      return { bg: "bg-emerald-100", text: "text-emerald-600" };
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return { bg: "bg-violet-100", text: "text-violet-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
}
