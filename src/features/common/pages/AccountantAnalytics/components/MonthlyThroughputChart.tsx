import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { accountantAnalyticsAPI } from "../../../../../api/accountantAnalytics";
import { getErrorMessage } from "../../../../../lib/api-error";
import { ChartContainer, Dropdown } from "../../../../../components/common";
import type { DropdownOption } from "../../../../../components/common";
import type { MonthlyThroughputItem } from "../../../../../types/analytics";

const monthOptions: DropdownOption[] = [
  { label: "Last 3 Months", value: "3" },
  { label: "Last 6 Months", value: "6" },
  { label: "Last 12 Months", value: "12" },
];

const formatMonth = (raw: string): string => {
  const [year, month] = raw.split("-");
  const date = new Date(+year, +month - 1);
  const mon = date.toLocaleDateString("en-US", { month: "short" });
  return `${mon} '${year.slice(2)}`;
};

const Chart = ({ data }: { data: MonthlyThroughputItem[] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart
      data={data.map((d) => ({ label: formatMonth(d.month), value: d.completed }))}
      margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
    >
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
        formatter={(value) => [value ?? 0, "Completed"]}
      />
      <Bar dataKey="value" fill="#2F6FED" radius={[4, 4, 0, 0]} barSize={36} />
    </BarChart>
  </ResponsiveContainer>
);

const Skeleton = () => <div className="skeleton h-[280px] rounded-lg" />;


export default function MonthlyThroughputChart({ userId }: { userId?: string }) {
  const [months, setMonths] = useState("6");
  const [data, setData] = useState<MonthlyThroughputItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchData = useCallback(async (m: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = userId
        ? await accountantAnalyticsAPI.getUserMonthlyThroughput(userId, +m)
        : await accountantAnalyticsAPI.getMonthlyThroughput(+m);
      if (mountedRef.current) setData(res.data);
    } catch (err) {
      if (mountedRef.current)
        setError(getErrorMessage(err, "Failed to load chart data."));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(months);
  }, [months, fetchData]);

  const handleMonthsChange = (val: string) => {
    setMonths(val);
  };

  return (
    <ChartContainer
      title="Monthly Throughput"
      action={
        <Dropdown
          options={monthOptions}
          value={months}
          onChange={handleMonthsChange}
        />
      }
      className="flex-1"
    >
      {loading && <Skeleton />}

      {!loading && error && (
        <div className="h-[280px] flex items-center justify-center text-sm text-status-rejected">
          <span>{error}</span>
          <button
            onClick={() => fetchData(months)}
            className="ml-2 underline hover:no-underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && <Chart data={data} />}
    </ChartContainer>
  );
}
