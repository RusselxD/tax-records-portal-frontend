import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfPreviewProps {
  fileUrl: string;
}

// Standard PDF page aspect ratio (letter: 8.5 x 11)
const PAGE_RATIO = 8.5 / 11; // ~0.773
const MAX_WIDTH = 680;

export default function PdfPreview({ fileUrl }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(680);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const containerW = containerRef.current.clientWidth - 32; // px-4 padding
      const containerH = containerRef.current.clientHeight - 80; // pt + pb padding

      // Width that would fill container width
      const fitByWidth = Math.min(containerW, MAX_WIDTH);
      // Width that would make the page fill container height
      const fitByHeight = containerH * PAGE_RATIO;

      // Use whichever is smaller (fits in both dimensions), but don't exceed max
      setPageWidth(Math.min(fitByWidth, fitByHeight, MAX_WIDTH));
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const goToPrev = useCallback(
    () => setCurrentPage((p) => Math.max(1, p - 1)),
    [],
  );

  const goToNext = useCallback(
    () => setCurrentPage((p) => Math.min(numPages, p + 1)),
    [numPages],
  );

  return (
    <div ref={containerRef} className="relative flex flex-col items-center flex-1 overflow-auto pt-2 pb-16 px-4 scrollbar-dark">
      <div data-preview-content className="rounded-lg overflow-hidden bg-white shadow-lg">
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          loading={null}
          error={
            <p className="text-sm text-red-400 p-8">Failed to load PDF document.</p>
          }
        >
          <Page pageNumber={currentPage} width={pageWidth} loading={null} />
        </Document>
      </div>

      {numPages > 0 && (
        <div data-preview-content className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
          <button
            type="button"
            onClick={goToPrev}
            disabled={currentPage <= 1}
            className="p-2 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-300 tabular-nums">
            Page{" "}
            <span className="inline-block min-w-[1.5ch] text-center">
              {currentPage}
            </span>{" "}
            / {numPages}
          </span>
          <button
            type="button"
            onClick={goToNext}
            disabled={currentPage >= numPages}
            className="p-2 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
