import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatNum } from "../../../../../lib/formatters";
import type { TasksByCategorySystemItem } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer } from "../../../../../components/common";
import { ErrorState } from "./chartShared";

const STATUS_CONFIG: { key: keyof Omit<TasksByCategorySystemItem, "category">; label: string; color: string }[] = [
  { key: "open",              label: "Open",      color: "#3B82F6" },
  { key: "submitted",         label: "Submitted", color: "#F59E0B" },
  { key: "rejected",          label: "Rejected",  color: "#DC2626" },
  { key: "approvedForFiling", label: "Approved",  color: "#16A34A" },
  { key: "filed",             label: "Filed",     color: "#7C3AED" },
  { key: "completed",         label: "Completed", color: "#059669" },
];

const MAX_VISIBLE_STATUSES = 3;

function getTotal(item: TasksByCategorySystemItem): number {
  return STATUS_CONFIG.reduce((sum, { key }) => sum + item[key], 0);
}

function CategoryRow({ item, maxTotal }: { item: TasksByCategorySystemItem; maxTotal: number }) {
  const total = getTotal(item);
  const barPercent = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  const nonZeroStatuses = STATUS_CONFIG
    .map(({ key, label, color }) => ({ count: item[key], label, color }))
    .filter(({ count }) => count > 0);

  const visible = nonZeroStatuses.slice(0, MAX_VISIBLE_STATUSES);
  const remaining = nonZeroStatuses.length - MAX_VISIBLE_STATUSES;

  // Build stacked segments for the bar
  const segments = STATUS_CONFIG
    .map(({ key, color }) => ({ value: item[key], color }))
    .filter(({ value }) => value > 0);

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 leading-snug">{item.category}</span>
        <span className="text-sm font-semibold text-gray-900 tabular-nums ml-3 shrink-0">{formatNum(total)}</span>
      </div>

      {/* Stacked progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full flex rounded-full overflow-hidden" style={{ width: `${barPercent}%` }}>
          {segments.map(({ color, value }, i) => (
            <div
              key={i}
              className="h-full"
              style={{
                width: `${(value / total) * 100}%`,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
        {visible.map(({ label, color, count }) => (
          <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {label} {formatNum(count)}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs text-gray-400">+{remaining} more</span>
        )}
      </div>
    </div>
  );
}

const ChartSkeleton = () => (
  <div className="space-y-4 py-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i}>
        <div className="flex justify-between mb-2">
          <div className="skeleton h-3.5 rounded" style={{ width: `${8 + i * 1.5}rem` }} />
          <div className="skeleton h-3.5 w-8 rounded" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="flex gap-3 mt-2">
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-3 w-14 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="h-[17.5rem] flex items-center justify-center text-sm text-gray-400">
    No task data available.
  </div>
);

export default function TasksByCategory() {
  const [data, setData] = useState<TasksByCategorySystemItem[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getTasksByCategory();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load category data. Please try again."));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const maxTotal = data ? Math.max(...data.map(getTotal), 1) : 1;

  return (
    <ChartContainer title="Tasks by Category" className="h-full min-h-0 flex flex-col">
      {isFetching && <ChartSkeleton />}
      {!isFetching && error && <ErrorState message={error} onRetry={fetchData} />}
      {!isFetching && !error && data && (
        data.length === 0 ? <EmptyState /> : (
          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 divide-y divide-gray-100">
            {data.map((item) => (
              <CategoryRow key={item.category} item={item} maxTotal={maxTotal} />
            ))}
          </div>
        )
      )}
    </ChartContainer>
  );
}
