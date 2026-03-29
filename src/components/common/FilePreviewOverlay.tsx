import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { X, Download, Loader2 } from "lucide-react";
import Alert from "./Alert";
import { fileAPI } from "../../api/file";

const PdfPreview = lazy(() => import("./previews/PdfPreview"));
const DocPreview = lazy(() => import("./previews/DocPreview"));
const SpreadsheetPreview = lazy(() => import("./previews/SpreadsheetPreview"));
const ImagePreview = lazy(() => import("./previews/ImagePreview"));

export interface FilePreviewOverlayProps {
  fileId: string;
  fileName: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FileType = "pdf" | "word" | "excel" | "image" | "csv" | "unsupported";

const EXTENSION_MAP: Record<string, FileType> = {
  // Documents
  pdf: "pdf",
  doc: "word",
  docx: "word",
  // Spreadsheets
  xls: "excel",
  xlsx: "excel",
  csv: "csv",
  // Images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  svg: "image",
};

const MIME_MAP: Record<string, FileType> = {
  "application/pdf": "pdf",
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "text/csv": "csv",
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/bmp": "image",
  "image/svg+xml": "image",
};

function getFileTypeFromName(fileName: string): FileType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MAP[ext] ?? "unsupported";
}

function getFileTypeFromMime(mimeType: string): FileType {
  return MIME_MAP[mimeType] ?? "unsupported";
}

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p className="text-sm">Loading preview...</p>
  </div>
);

export default function FilePreviewOverlay({
  fileId,
  fileName,
  setModalOpen,
}: FilePreviewOverlayProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobMime, setBlobMime] = useState<string>("");

  const extType = getFileTypeFromName(fileName);
  const fileType = extType !== "unsupported" ? extType : getFileTypeFromMime(blobMime);

  useEffect(() => {
    let revoked = false;

    const fetchFile = async () => {
      try {
        const blob = await fileAPI.getFilePreview(fileId);
        if (revoked) return;
        setBlobMime(blob.type);
        setFileUrl(URL.createObjectURL(blob));
      } catch (err) {
        if (!revoked) {
          const is403 = err instanceof Error && "response" in err && (err as { response?: { status?: number } }).response?.status === 403;
          setError(is403 ? "This file is currently protected and unavailable for download." : "Failed to load file preview.");
        }
      } finally {
        if (!revoked) setLoading(false);
      }
    };

    fetchFile();

    return () => {
      revoked = true;
      setFileUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [fileId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setModalOpen]);

  const mouseDownTarget = useRef<EventTarget | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownTarget.current = e.target;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = mouseDownTarget.current as HTMLElement | null;
      if (!target) return;
      if (
        target === e.target &&
        !target.closest("[data-preview-content]") &&
        !target.closest("[data-preview-header]")
      ) {
        setModalOpen(false);
      }
    },
    [setModalOpen],
  );

  const handleDownload = useCallback(() => {
    if (!fileUrl) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  }, [fileUrl, fileName]);

  const renderContent = () => {
    if (loading) return <LoadingFallback />;

    if (error || !fileUrl) {
      return (
        <div className="flex items-center justify-center flex-1 p-4">
          <Alert variant="error">{error ?? "Unable to load file."}</Alert>
        </div>
      );
    }

    if (fileType === "unsupported") {
      const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
      return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-6">
          <div className="w-20 h-24 rounded-lg bg-white/10 border border-white/20 flex flex-col items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {ext && (
              <span className="text-[10px] font-bold uppercase text-gray-400 mt-0.5">.{ext}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">No preview available</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              This file type can't be previewed in the browser. Download it to view on your device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!fileUrl}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-gray-200 transition-colors disabled:opacity-30"
          >
            <Download className="w-4 h-4" />
            Download File
          </button>
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <PdfPreview fileUrl={fileUrl} />
        </Suspense>
      );
    }

    if (fileType === "image") {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <ImagePreview fileUrl={fileUrl} fileName={fileName} />
        </Suspense>
      );
    }

    if (fileType === "excel" || fileType === "csv") {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <SpreadsheetPreview fileUrl={fileUrl} />
        </Suspense>
      );
    }

    // Word docs
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DocPreview fileUrl={fileUrl} />
      </Suspense>
    );
  };

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/80"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* Floating controls */}
      <div data-preview-header className="flex-shrink-0 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-medium text-gray-200 truncate max-w-md">
            {fileName}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!fileUrl}
          className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Download"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      {/* Content — clipped to this container, won't scroll past header */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {renderContent()}
      </div>
    </div>,
    document.body,
  );
}
