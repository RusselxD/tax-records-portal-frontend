import { ChartContainer } from "../../../../../components/common";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import { formatNum } from "../../../../../lib/formatters";
import { ErrorState } from "../../../../manager/pages/AdminDashboard/components/chartShared";
import type { CategoryCountItem } from "../../../../../types/analytics";

const STATUS_CONFIG: { key: keyof Pick<CategoryCountItem, "active" | "completed">; label: string; color: string }[] = [
  { key: "active",    label: "Active",    color: "#2F6FED" },
  { key: "completed", label: "Completed", color: "#16A34A" },
];

function getTotal(item: CategoryCountItem): number {
  return STATUS_CONFIG.reduce((sum, { key }) => sum + item[key], 0);
}

function CategoryRow({ item, maxTotal }: { item: CategoryCountItem; maxTotal: number }) {
  const total = getTotal(item);
  const barPercent = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  const segments = STATUS_CONFIG
    .map(({ key, color }) => ({ value: item[key], color }))
    .filter(({ value }) => value > 0);

  const nonZero = STATUS_CONFIG
    .map(({ key, label, color }) => ({ count: item[key], label, color }))
    .filter(({ count }) => count > 0);

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 leading-snug">{item.category}</span>
        <span className="text-sm font-semibold text-gray-900 tabular-nums ml-3 shrink-0">{formatNum(total)}</span>
      </div>

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

      <div className="flex items-center gap-3 mt-1.5">
        {nonZero.map(({ label, color, count }) => (
          <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {label} {formatNum(count)}
          </span>
        ))}
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
  <div className="h-[12.5rem] flex items-center justify-center text-sm text-gray-400">
    No task data available yet.
  </div>
);

export default function TasksByCategoryChart() {
  const { byCategory } = useAccountantAnalytics();
  const { data, loading, error, retry } = byCategory;

  const items = data?.data ?? [];
  const maxTotal = items.length > 0 ? Math.max(...items.map(getTotal), 1) : 1;

  return (
    <ChartContainer title="Tasks by Category">
      {loading && <ChartSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && data && (
        items.length === 0 ? <EmptyState /> : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <CategoryRow key={item.category} item={item} maxTotal={maxTotal} />
            ))}
          </div>
        )
      )}
    </ChartContainer>
  );
}
