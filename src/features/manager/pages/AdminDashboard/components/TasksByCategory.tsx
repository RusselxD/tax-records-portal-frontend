import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { TasksByCategorySystemItem } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer } from "../../../../../components/common";
import { ErrorState } from "./chartShared";

const STATUS_BARS: { key: keyof Omit<TasksByCategorySystemItem, "category">; label: string; color: string }[] = [
  { key: "open",             label: "Open",             color: "#3B82F6" },
  { key: "submitted",        label: "Submitted",        color: "#F59E0B" },
  { key: "rejected",         label: "Rejected",         color: "#DC2626" },
  { key: "approvedForFiling",label: "Approved",         color: "#16A34A" },
  { key: "filed",            label: "Filed",            color: "#7C3AED" },
  { key: "completed",        label: "Completed",        color: "#059669" },
];

const ChartSkeleton = () => (
  <div className="h-[280px] flex items-end gap-4 px-8 pb-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2">
        <div className="skeleton w-full rounded-lg" style={{ height: `${80 + i * 25}px` }} />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
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

  return (
    <ChartContainer title="Tasks by Category">
      {isFetching && <ChartSkeleton />}
      {!isFetching && error && <ErrorState message={error} onRetry={fetchData} />}
      {!isFetching && !error && data && (
        data.length === 0 ? <EmptyState /> : (
          <ResponsiveContainer width="100%" height={Math.max(280, data.length * 44 + 60)}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                axisLine={false}
                tickLine={false}
                width={200}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              {STATUS_BARS.map(({ key, label, color }) => (
                <Bar key={key} dataKey={key} name={label} stackId="a" fill={color} radius={[0, 4, 4, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      )}
    </ChartContainer>
  );
}
