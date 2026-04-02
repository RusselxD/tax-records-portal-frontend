import { useState, useEffect, type ReactNode } from "react";
import { ChevronDown, Loader2, AlertTriangle } from "lucide-react";

interface SectionCardProps {
  title: string;
  defaultOpen?: boolean;
  status?: "idle" | "loading" | "loaded" | "error";
  onOpen?: () => void;
  onRetry?: () => void;
  headerAction?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({
  title,
  defaultOpen = true,
  status,
  onOpen,
  onRetry,
  headerAction,
  children,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Trigger fetch when opened (on mount if defaultOpen, or on toggle)
  useEffect(() => {
    if (isOpen && onOpen && (!status || status === "idle")) {
      onOpen();
    }
  }, [isOpen, onOpen, status]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const isLazy = status !== undefined;
  const isLoading = isLazy && status === "loading";
  const isError = isLazy && status === "error";
  const hasData = !isLazy || status === "loaded";

  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); } }}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <h2 className="font-bold text-primary">{title}</h2>
        <div className="flex items-center gap-3">
          {headerAction && (
            <div onClick={(e) => e.stopPropagation()}>
              {headerAction}
            </div>
          )}
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="px-3 sm:px-6 py-4 sm:py-5">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-5 w-5 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Failed to load section</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  Try again
                </button>
              )}
            </div>
          )}
          {hasData && children}
        </div>
      )}
    </div>
  );
}
