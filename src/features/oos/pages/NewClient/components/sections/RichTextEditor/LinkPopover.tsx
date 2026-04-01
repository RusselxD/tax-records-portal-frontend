import { useState, useRef, useEffect } from "react";
import { Unlink } from "lucide-react";

interface LinkPopoverProps {
  initialUrl: string;
  hasSelection: boolean;
  onSubmit: (url: string, text?: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function LinkPopover({
  initialUrl,
  hasSelection,
  onSubmit,
  onRemove,
  onClose,
}: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState("");
  const needsText = !hasSelection && !initialUrl;
  const firstInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => firstInputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = () => {
    let trimmed = url.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    onSubmit(trimmed, needsText ? text.trim() || trimmed : undefined);
  };

  const isValid = url.trim() && (!needsText || text.trim());

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-full mt-2 z-10 w-full sm:w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div className="p-3 space-y-3">
        {needsText && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Display text
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") onClose();
                e.stopPropagation();
              }}
              placeholder="Link text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-primary focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            URL
          </label>
          <input
            ref={needsText ? undefined : firstInputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onClose();
              e.stopPropagation();
            }}
            placeholder="https://example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-primary focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5">
        {initialUrl ? (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            <Unlink className="h-3.5 w-3.5" />
            Remove link
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-3 py-1.5 text-xs font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
