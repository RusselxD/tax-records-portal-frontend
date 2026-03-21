import { useState, useEffect, useCallback, useMemo } from "react";
import { CalendarClock, Loader2, CalendarX2 } from "lucide-react";
import { taxRecordAPI } from "../../../../../api/tax-record";
import { formatDate } from "../../../../../lib/formatters";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { ImportantDateResponse } from "../../../../../types/tax-record";

export default function ImportantDates() {
  const [dates, setDates] = useState<ImportantDateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxRecordAPI.getImportantDates();
      setDates(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load important dates"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const sorted = useMemo(
    () => [...dates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [dates]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <CalendarClock className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-primary">Important Dates</h2>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center px-5 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center px-5 py-10">
            <p className="text-sm text-status-rejected">{error}</p>
            <button
              onClick={fetchDates}
              className="text-sm text-accent hover:underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <CalendarX2 className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">No important dates</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Upcoming deadlines and expirations will appear here
            </p>
          </div>
        )}

        {!isLoading && !error && sorted.length > 0 && (
          <div className="divide-y divide-gray-100">
            {sorted.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-2.5">
                <p className="text-sm text-primary leading-relaxed">
                  {item.label}
                </p>
                <span className="text-sm text-gray-500 shrink-0 ml-4">
                  {formatDate(item.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
