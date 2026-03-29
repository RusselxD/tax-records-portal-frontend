import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, Loader2 } from "lucide-react";
import { FilePreviewOverlay } from "..";
import { fileAPI } from "../../../api/file";
import EmptyCardState from "./EmptyCardState";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CARD_SHELL_DEFAULT =
  "bg-white rounded-lg border-t-[5px] border-t-accent shadow-sm ring-1 ring-gray-200 overflow-hidden";
const CARD_SHELL_SM =
  "bg-white rounded-md border-t-[4px] border-t-accent shadow-sm ring-1 ring-gray-200 overflow-hidden";

interface FileCardProps {
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  title: string;
  file: { id: string; name: string } | null;
  displayName?: string;
  emptyMessage: string;
  /** Optional action button (e.g. delete) rendered in the footer */
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

  const isSmall = size === "sm";
  const thumbHeight = isSmall ? "h-36" : "h-44";
  const pdfScale = isSmall ? "scale-[0.35]" : "scale-[0.45]";
  const pdfWidth = isSmall ? 450 : 500;
  const footerPadding = isSmall ? "px-3 py-2" : "px-4 py-3";
  const cardShell = isSmall ? CARD_SHELL_SM : CARD_SHELL_DEFAULT;
  const cardWidth = "";

  return (
    <>
      <div
        className={`${cardShell} flex flex-col ${cardWidth} relative ${
          file && !disabled ? "cursor-pointer hover:shadow-md transition-shadow" : ""
        } ${disabled ? "opacity-60" : ""}`}
        onClick={file && !disabled ? () => setPreviewOpen(true) : undefined}
      >
        {/* Action in top-right corner for sm size */}
        {isSmall && action && file && (
          <div className="absolute top-1 right-1 z-10" onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}

        {file ? (
          <>
            <div className={`${thumbHeight} bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100`}>
              {loading ? (
                <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
              ) : thumbUrl && isImage ? (
                <img
                  src={thumbUrl}
                  alt={file.name}
                  className="h-full w-full object-contain"
                />
              ) : thumbUrl && isPdf ? (
                <div className="relative w-full h-full">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none ${pdfScale} origin-top`}>
                    <Document file={thumbUrl} loading={null} error={<FileText className="h-10 w-10 text-gray-300" />}>
                      <Page pageNumber={1} width={pdfWidth} loading={null} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                  </div>
                </div>
              ) : (
                <FileText className="h-10 w-10 text-gray-300" />
              )}
            </div>

            <div className={`${footerPadding} flex items-center gap-2`}>
              {!isSmall && icon}
              <div className="min-w-0 flex-1 py-0.5">
                {!isSmall && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {title}
                  </p>
                )}
                <p className={`${isSmall ? "text-xs" : "text-sm"} font-medium text-primary truncate ${isSmall ? "" : "mt-0.5"}`} title={displayName ?? file.name}>
                  {displayName ?? file.name}
                </p>
              </div>
              {!isSmall && action && (
                <div onClick={(e) => e.stopPropagation()}>
                  {action}
                </div>
              )}
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
