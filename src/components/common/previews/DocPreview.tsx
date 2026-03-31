import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

interface DocPreviewProps {
  fileUrl: string;
}

export default function DocPreview({ fileUrl }: DocPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;
      try {
        const res = await fetch(fileUrl);
        if (cancelled) return;
        const blob = await res.blob();
        if (cancelled) return;
        await renderAsync(blob, containerRef.current, undefined, {
          inWrapper: false,
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Failed to render document.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto flex items-center justify-center pb-6 px-4 scrollbar-dark">
      <div
        data-preview-content
        ref={containerRef}
        className="bg-white rounded-lg w-full max-w-5xl h-full overflow-auto p-8"
      />
    </div>
  );
}
