import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, Loader2, FolderOpen } from "lucide-react";
import { Dropdown } from "../../../../../components/common";
import { taxRecordAPI } from "../../../../../api/tax-record";
import { periodLabels } from "../../../../../constants/tax-record-task";
import { formatDate } from "../../../../../lib/formatters";
import { getErrorMessage } from "../../../../../lib/api-error";
import type {
  RecentTaxRecordRange,
  RecentTaxRecordEntryResponse,
  DrillSelection,
} from "../../../../../types/tax-record";

const rangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
];

export default function RecentTaxDocuments() {
  const navigate = useNavigate();
  const [range, setRange] = useState<RecentTaxRecordRange>("7d");
  const [entries, setEntries] = useState<RecentTaxRecordEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (r: RecentTaxRecordRange) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxRecordAPI.getRecentEntries(r);
      setEntries(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load recent documents"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(range);
  }, [range, fetchEntries]);

  const handleRangeChange = useCallback((value: string) => {
    setRange(value as RecentTaxRecordRange);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">
            Recently Added Documents
          </h2>
        </div>
        <Dropdown
          options={rangeOptions}
          value={range}
          onChange={handleRangeChange}
          ghost
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-10">
            <p className="text-sm text-status-rejected">{error}</p>
            <button
              onClick={() => fetchEntries(range)}
              className="text-sm text-accent hover:underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-5 text-center -mt-4">
            <FolderOpen className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              No recent documents
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              New tax documents will appear here
            </p>
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <div className="divide-y divide-gray-100 -my-1">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => navigate("/client/tax-records", {
                  state: {
                    selections: [
                      { id: String(entry.categoryId), label: entry.categoryName },
                      { id: String(entry.subCategoryId), label: entry.subCategoryName },
                      { id: String(entry.taskNameId), label: entry.taskName },
                      { id: String(entry.year), label: String(entry.year) },
                      { id: entry.period, label: periodLabels[entry.period] ?? entry.period },
                    ] as DrillSelection[],
                  },
                })}
                className="flex items-center justify-between w-full py-3 px-5 text-left group hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary leading-relaxed">
                    {entry.taskName}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {entry.categoryName} › {entry.subCategoryName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {entry.year} · {periodLabels[entry.period] ?? entry.period}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-accent transition-colors shrink-0 ml-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && !error && entries.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-3 shrink-0">
          <button
            onClick={() => navigate("/client/tax-records")}
            className="text-sm font-medium text-accent hover:underline"
          >
            View all tax records →
          </button>
        </div>
      )}
    </div>
  );
}
