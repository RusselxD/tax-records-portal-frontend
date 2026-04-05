import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, Loader2, Download, Eye } from "lucide-react";
import { FilePreviewOverlay } from "..";
import { fileAPI } from "../../../api/file";
import EmptyCardState from "./EmptyCardState";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CARD_SHELL_SM =
  "bg-white rounded-md border-t-[4px] border-t-accent shadow-sm ring-1 ring-gray-200 overflow-hidden";

interface FileCardProps {
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  title: string;
  file: { id: string; name: string } | null;
  displayName?: string;
  emptyMessage: string;
  /** Optional action button (e.g. delete) rendered in the footer — sm size only */
  action?: React.ReactNode;
  /** Small variant — shorter thumbnail and tighter padding */
  size?: "default" | "sm";
  /** When true, file click/preview is disabled */
  disabled?: boolean;
}

export default function FileCard({
  icon,
  emptyIcon,
  title,
  file,
  displayName,
  emptyMessage,
  action,
  size = "default",
  disabled = false,
}: FileCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { thumbUrl, mimeType, loading } = useFileThumbnail(file?.id);
  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";

  const handleDownload = () => {
    if (!thumbUrl || !file) return;
    const a = document.createElement("a");
    a.href = thumbUrl;
    a.download = file.name;
    a.click();
  };

  /* ── Small variant (employee-facing upload slots) — unchanged ── */
  if (size === "sm") {
    return (
      <>
        <div
          className={`${CARD_SHELL_SM} flex flex-col relative ${
            file && !disabled ? "cursor-pointer hover:shadow-md transition-shadow" : ""
          } ${disabled ? "opacity-60" : ""}`}
          onClick={file && !disabled ? () => setPreviewOpen(true) : undefined}
        >
          {action && file && (
            <div className="absolute top-1 right-1 z-10" onClick={(e) => e.stopPropagation()}>
              {action}
            </div>
          )}

          {file ? (
            <>
              <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                {loading ? (
                  <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
                ) : thumbUrl && isImage ? (
                  <img src={thumbUrl} alt={file.name} className="h-full w-full object-contain" />
                ) : thumbUrl && isPdf ? (
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none scale-[0.35] origin-top">
                      <Document file={thumbUrl} loading={null} error={<FileText className="h-10 w-10 text-gray-300" />}>
                        <Page pageNumber={1} width={450} loading={null} renderTextLayer={false} renderAnnotationLayer={false} />
                      </Document>
                    </div>
                  </div>
                ) : (
                  <FileText className="h-10 w-10 text-gray-300" />
                )}
              </div>
              <div className="px-3 py-2 flex items-center gap-2">
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-xs font-medium text-primary truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <EmptyCardState icon={emptyIcon} title={title} message={emptyMessage} />
          )}
        </div>

        {previewOpen && file && (
          <FilePreviewOverlay
            fileId={file.id}
            fileName={file.name}
            setModalOpen={setPreviewOpen}
          />
        )}
      </>
    );
  }

  /* ── Default variant (client-facing tax record cards) ── */
  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col h-[20rem] ${disabled ? "opacity-60" : ""}`}>
        {/* Colored header bar */}
        <div className="bg-accent flex items-center gap-2.5 px-4 py-3">
          <span className="[&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-white shrink-0">
            {icon}
          </span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-tight">
            {title}
          </h3>
        </div>

        {file ? (
          <>
            {/* Document preview */}
            <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
              {loading ? (
                <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
              ) : thumbUrl && isImage ? (
                <img src={thumbUrl} alt={file.name} className="h-full w-full object-contain" />
              ) : thumbUrl && isPdf ? (
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none scale-[0.45] origin-top">
                    <Document file={thumbUrl} loading={null} error={<FileText className="h-10 w-10 text-gray-300" />}>
                      <Page pageNumber={1} width={500} loading={null} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                  </div>
                </div>
              ) : (
                <FileText className="h-12 w-12 text-gray-300" />
              )}
            </div>

            {/* File info + action buttons */}
            <div className="px-4 pt-3 pb-4 flex flex-col gap-3 flex-1">
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold text-primary leading-snug line-clamp-2"
                  title={displayName ?? file.name}
                >
                  {displayName ?? file.name}
                </p>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={handleDownload}
                  disabled={disabled || !thumbUrl}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  onClick={() => setPreviewOpen(true)}
                  disabled={disabled}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyCardState icon={emptyIcon} title={title} message={emptyMessage} />
        )}
      </div>

      {previewOpen && file && (
        <FilePreviewOverlay
          fileId={file.id}
          fileName={file.name}
          setModalOpen={setPreviewOpen}
        />
      )}
    </>
  );
}

/* ── Hook: fetch file blob for thumbnail ── */

function useFileThumbnail(fileId: string | undefined) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;
    setLoading(true);
    const fetchPreview = async () => {
      try {
        const blob = await fileAPI.getFilePreview(fileId);
        if (cancelled) return;
        setMimeType(blob.type);
        setThumbUrl(URL.createObjectURL(blob));
      } catch {
        // preview unavailable — silently ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPreview();
    return () => {
      cancelled = true;
      setThumbUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [fileId]);

  return { thumbUrl, mimeType, loading };
}
