import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TaskCompletionTrendData } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer, Dropdown } from "../../../../../components/common";
import type { DropdownOption } from "../../../../../components/common";

const rangeOptions: DropdownOption[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 1 Month", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
];

interface ChartDataPoint {
  label: string;
  value: number;
}

const toChartData = (data: TaskCompletionTrendData): ChartDataPoint[] =>
  data.labels.map((label, i) => ({ label, value: data.values[i] }));

const EmptyState = () => (
  <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
    No task completions in this period.
  </div>
);

const TrendChart = ({ data }: { data: ChartDataPoint[] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
      <XAxis
        dataKey="label"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#6B7280" }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#6B7280" }}
        allowDecimals={false}
      />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          fontSize: 13,
        }}
        cursor={{ fill: "rgba(47, 111, 237, 0.06)" }}
      />
      <Bar dataKey="value" fill="#2F6FED" radius={[4, 4, 0, 0]} barSize={40} />
    </BarChart>
  </ResponsiveContainer>
);

const ChartSkeleton = () => (
  <div className="h-[280px] flex items-end gap-6 px-8 pb-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2">
        <div
          className="skeleton w-20 rounded-lg"
          style={{ height: `${60 + Math.random() * 120}px` }}
        />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    ))}
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="h-[280px] flex items-center justify-center text-sm text-status-rejected">
    <span>{message}</span>
    <button
      onClick={onRetry}
      className="ml-2 underline hover:no-underline font-medium"
    >
      Retry
    </button>
  </div>
);

export default function TaskCompletionTrend() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<TaskCompletionTrendData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = async (selectedRange: string) => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getTaskCompletionTrend(selectedRange);
      setData(res);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to load chart data. Please try again."),
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTrend(range);
  }, [range]);

  return (
    <ChartContainer
      title="Task Completion Trend"
      action={
        <Dropdown options={rangeOptions} value={range} onChange={setRange} />
      }
      className="flex-1"
    >
      {isFetching && <ChartSkeleton />}

      {!isFetching && error && (
        <ErrorState message={error} onRetry={() => fetchTrend(range)} />
      )}

      {!isFetching &&
        !error &&
        data &&
        (data.values.every((v) => v === 0) ? (
          <EmptyState />
        ) : (
          <TrendChart data={toChartData(data)} />
        ))}
    </ChartContainer>
  );
}
