import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, Loader2 } from "lucide-react";
import { FilePreviewOverlay } from "../../../../../../../components/common";
import { fileAPI } from "../../../../../../../api/file";
import EmptyCardState from "./EmptyCardState";
import { CARD_SHELL } from "../constants";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface FileCardProps {
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  title: string;
  file: { id: string; name: string } | null;
  displayName?: string;
  emptyMessage: string;
}

export default function FileCard({
  icon,
  emptyIcon,
  title,
  file,
  displayName,
  emptyMessage,
}: FileCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { thumbUrl, mimeType, loading } = useFileThumbnail(file?.id);
  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";

  return (
    <>
      <div
        className={`${CARD_SHELL} flex flex-col ${
          file ? "cursor-pointer hover:shadow-md transition-shadow" : ""
        }`}
        onClick={file ? () => setPreviewOpen(true) : undefined}
      >
        {file ? (
          <>
            <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
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
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none scale-[0.45] origin-top">
                    <Document file={thumbUrl} loading={null} error={<FileText className="h-10 w-10 text-gray-300" />}>
                      <Page pageNumber={1} width={500} loading={null} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                  </div>
                </div>
              ) : (
                <FileText className="h-10 w-10 text-gray-300" />
              )}
            </div>

            <div className="px-4 py-3 flex items-center gap-2">
              {icon}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {title}
                </p>
                <p className="text-sm font-medium text-primary truncate mt-0.5" title={displayName ?? file.name}>
                  {displayName ?? file.name}
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

/* ── Hook: fetch file blob for thumbnail ── */

function useFileThumbnail(fileId: string | undefined) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;
    setLoading(true);
    fileAPI.getFilePreview(fileId).then((blob) => {
      if (cancelled) return;
      setMimeType(blob.type);
      setThumbUrl(URL.createObjectURL(blob));
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
      setThumbUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [fileId]);

  return { thumbUrl, mimeType, loading };
}
