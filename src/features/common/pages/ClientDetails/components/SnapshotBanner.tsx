import { Archive } from "lucide-react";
import { formatDateTime } from "../../../../../lib/formatters";

export default function SnapshotBanner({ snapshotDate }: { snapshotDate: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mt-4">
      <Archive className="h-5 w-5 text-amber-600 flex-shrink-0" />
      <p className="text-sm text-amber-800">
        You are viewing an archived snapshot taken on{" "}
        <span className="font-medium">{formatDateTime(snapshotDate)}</span>.
        This client has been handed off and the information shown is read-only.
      </p>
    </div>
  );
}
