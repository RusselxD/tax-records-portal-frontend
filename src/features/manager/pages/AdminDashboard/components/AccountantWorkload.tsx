import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { AccountantWorkloadItem } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer } from "../../../../../components/common";
import { ErrorState } from "./chartShared";

const BAR_COLOR = "#d0a865";

const ChartSkeleton = () => (
  <div className="h-[280px] flex items-end gap-6 px-8 pb-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2">
        <div className="skeleton w-full rounded-lg" style={{ height: `${60 + i * 30}px` }} />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
    No accountant workload data available.
  </div>
);

const WorkloadChart = ({ data }: { data: AccountantWorkloadItem[] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} layout="vertical">
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
        dataKey="accountantName"
        axisLine={false}
        tickLine={false}
        width={130}
        tick={{ fontSize: 12, fill: "#6B7280" }}
        tickFormatter={(v: string) => v.length > 14 ? `${v.slice(0, 14)}…` : v}
      />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          fontSize: 13,
        }}
        cursor={{ fill: "rgba(208, 168, 101, 0.08)" }}
        formatter={(value: number | undefined) => [value ?? 0, "Active Tasks"]}
      />
      <Bar dataKey="activeTasks" radius={[0, 4, 4, 0]} barSize={24}>
        {data.map((_, i) => (
          <Cell key={i} fill={BAR_COLOR} fillOpacity={1 - i * 0.12} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default function AccountantWorkload() {
  const [data, setData] = useState<AccountantWorkloadItem[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getAccountantWorkload();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load workload data. Please try again."));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ChartContainer
      title="Top Accountants by Workload"
      action={
        <Link to="/manager/analytics" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
          View all →
        </Link>
      }
    >
      {isFetching && <ChartSkeleton />}
      {!isFetching && error && <ErrorState message={error} onRetry={fetchData} />}
      {!isFetching && !error && data && (
        data.length === 0 ? <EmptyState /> : <WorkloadChart data={data} />
      )}
    </ChartContainer>
  );
}
