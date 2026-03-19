import { AlertTriangle } from "lucide-react";

export default function InlineBanner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
      <div className="p-1.5 rounded-lg bg-red-100">
        <AlertTriangle className="w-4 h-4 text-status-rejected" />
      </div>
      <span className="text-sm font-medium text-status-rejected">
        {label}
      </span>
    </div>
  );
}
