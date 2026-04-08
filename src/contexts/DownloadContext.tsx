import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Download, CheckCircle2, XCircle, X, FileArchive } from "lucide-react";

interface DownloadEntry {
  id: string;
  label: string;
  status: "downloading" | "done" | "error";
  error?: string;
}

interface DownloadContextType {
  startDownload: (
    label: string,
    fn: () => Promise<Blob>,
    filename?: string,
  ) => void;
}

const DownloadContext = createContext<DownloadContextType | null>(null);

let nextId = 0;

function DownloadToast({
  entry,
  onRemove,
}: {
  entry: DownloadEntry;
  onRemove: (id: string) => void;
}) {
  const isDone = entry.status === "done";
  const isError = entry.status === "error";
  const isLoading = entry.status === "downloading";

  return (
    <div className="w-80 rounded-xl bg-primary shadow-2xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center justify-center rounded-md w-7 h-7 shrink-0 ${
              isDone
                ? "bg-emerald-500/20"
                : isError
                  ? "bg-red-500/20"
                  : "bg-accent/20"
            }`}
          >
            {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {isError && <XCircle className="h-4 w-4 text-red-400" />}
            {isLoading && <Download className="h-4 w-4 text-accent" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/90 leading-tight">
              {isLoading && "Preparing download"}
              {isDone && "Download ready"}
              {isError && "Download failed"}
            </p>
            <p className="text-xs text-white/50 truncate leading-tight mt-0.5">
              {isError ? (entry.error ?? "Something went wrong") : entry.label}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(entry.id)}
          className="text-white/30 hover:text-white/60 transition-colors ml-2 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* File row */}
      <div className="mx-4 mb-3.5 flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
        <FileArchive className="h-4 w-4 text-accent shrink-0" />
        <span className="text-xs text-white/60 truncate flex-1">
          tax-records-export.zip
        </span>
        {isLoading && (
          <span className="text-[10px] font-medium text-accent/70 shrink-0 animate-pulse">
            Compressing...
          </span>
        )}
        {isDone && (
          <span className="text-[10px] font-medium text-emerald-400 shrink-0">
            Saved
          </span>
        )}
        {isError && (
          <span className="text-[10px] font-medium text-red-400 shrink-0">
            Error
          </span>
        )}
      </div>

      {/* Progress bar — only while downloading */}
      {isLoading && (
        <div className="h-0.5 bg-white/10">
          <div className="h-full bg-accent/70 animate-[progress_2s_ease-in-out_infinite]" />
        </div>
      )}
      {isDone && <div className="h-0.5 bg-emerald-500/60" />}
      {isError && <div className="h-0.5 bg-red-500/60" />}
    </div>
  );
}

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);

  const removeEntry = useCallback((id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const startDownload = useCallback(
    (
      label: string,
      fn: () => Promise<Blob>,
      filename = "tax-records-export.zip",
    ) => {
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
          const message =
            err instanceof Error ? err.message : "Download failed.";
          setDownloads((prev) =>
            prev.map((d) =>
              d.id === id ? { ...d, status: "error", error: message } : d,
            ),
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
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
          {downloads.map((entry) => (
            <DownloadToast key={entry.id} entry={entry} onRemove={removeEntry} />
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
