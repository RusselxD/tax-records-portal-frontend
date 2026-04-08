import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Loader2, CheckCircle, XCircle, X } from "lucide-react";

interface DownloadEntry {
  id: string;
  label: string;
  status: "downloading" | "done" | "error";
  error?: string;
}

interface DownloadContextType {
  startDownload: (label: string, fn: () => Promise<Blob>, filename?: string) => void;
}

const DownloadContext = createContext<DownloadContextType | null>(null);

let nextId = 0;

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);

  const removeEntry = useCallback((id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const startDownload = useCallback(
    (label: string, fn: () => Promise<Blob>, filename = "tax-records-export.zip") => {
      const id = String(++nextId);
      setDownloads((prev) => [...prev, { id, label, status: "downloading" }]);

      fn()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
          setDownloads((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "done" } : d)),
          );
          setTimeout(() => removeEntry(id), 4000);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Download failed.";
          setDownloads((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "error", error: message } : d)),
          );
          setTimeout(() => removeEntry(id), 6000);
        });
    },
    [removeEntry],
  );

  const value = useMemo(() => ({ startDownload }), [startDownload]);

  return (
    <DownloadContext.Provider value={value}>
      {children}
      {downloads.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
          {downloads.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
            >
              {entry.status === "downloading" && (
                <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
              )}
              {entry.status === "done" && (
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              {entry.status === "error" && (
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {entry.status === "downloading" && `Preparing ${entry.label}...`}
                  {entry.status === "done" && `${entry.label} ready`}
                  {entry.status === "error" && `${entry.label} failed`}
                </p>
                {entry.status === "error" && entry.error && (
                  <p className="text-xs text-gray-500 truncate">{entry.error}</p>
                )}
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </DownloadContext.Provider>
  );
}

export function useDownload() {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownload must be used within a DownloadProvider");
  }
  return context;
}
