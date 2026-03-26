import { FileText, X } from "lucide-react";

interface FileRowProps {
  name: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
}

export default function FileRow({ name, onClick, onRemove }: FileRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors"
    >
      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
      <span className="flex-1 truncate text-sm font-medium text-primary" title={name}>
        {name}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          className="shrink-0 rounded p-1 text-gray-400 hover:text-status-rejected transition-colors"
          title="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
