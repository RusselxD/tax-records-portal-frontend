import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { X, Download, Loader2 } from "lucide-react";
import Alert from "./Alert";
import { fileAPI } from "../../api/file";

const PdfPreview = lazy(() => import("./previews/PdfPreview"));
const DocPreview = lazy(() => import("./previews/DocPreview"));

export interface FilePreviewOverlayProps {
  fileId: string;
  fileName: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FileType = "pdf" | "word" | "excel" | "unsupported";

const EXTENSION_MAP: Record<string, FileType> = {
  pdf: "pdf",
  doc: "word",
  docx: "word",
  xls: "excel",
  xlsx: "excel",
};

function getFileType(fileName: string): FileType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MAP[ext] ?? "unsupported";
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

  const fileType = getFileType(fileName);

  useEffect(() => {
    let revoked = false;

    const fetchFile = async () => {
      try {
        const blob = await fileAPI.getFilePreview(fileId);
        if (revoked) return;
        setFileUrl(URL.createObjectURL(blob));
      } catch {
        if (!revoked) setError("Failed to load file preview.");
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
      // Only close if both mousedown and click landed outside content and header
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
      return (
        <div className="flex items-center justify-center flex-1 p-4">
          <Alert variant="warning">
            Preview is not supported for this file type.
          </Alert>
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

    return (
      <Suspense fallback={<LoadingFallback />}>
        <DocPreview fileUrl={fileUrl} fileType={fileType} />
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
