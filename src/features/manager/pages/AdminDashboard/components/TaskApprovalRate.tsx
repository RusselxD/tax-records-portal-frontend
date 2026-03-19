import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { TaskApprovalRateData } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer } from "../../../../../components/common";

const COLORS = { approved: "#16A34A", rejected: "#DC2626" };

interface SliceData {
  name: string;
  value: number;
  color: string;
}

const buildSlices = (data: TaskApprovalRateData): SliceData[] => [
  { name: "Approved", value: data.approved, color: COLORS.approved },
  { name: "Rejected", value: data.rejected, color: COLORS.rejected },
];

const CenterLabel = ({ rate }: { rate: number }) => (
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="central"
    className="fill-primary"
  >
    <tspan x="50%" dy="-8" fontSize={28} fontWeight={700}>
      {rate}%
    </tspan>
    <tspan x="50%" dy={24} fontSize={12} className="fill-gray-400">
      approved
    </tspan>
  </text>
);

const EmptyDonut = () => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={[{ value: 1 }]}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={95}
        dataKey="value"
        strokeWidth={0}
        fill="#E5E7EB"
        isAnimationActive={false}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        className="fill-gray-400"
      >
        No data yet
      </text>
    </PieChart>
  </ResponsiveContainer>
);

const DonutChart = ({ data }: { data: TaskApprovalRateData }) => {
  const isEmpty = data.approved === 0 && data.rejected === 0;

  if (isEmpty) return <EmptyDonut />;

  const slices = buildSlices(data);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={slices}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={95}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {slices.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </Pie>
        <CenterLabel rate={data.approved} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Legend = ({ data }: { data: TaskApprovalRateData }) => (
  <div className="flex items-center justify-center gap-6 mt-2">
    <LegendItem
      color={COLORS.approved}
      label="Approved"
      value={data.approved}
    />
    <LegendItem
      color={COLORS.rejected}
      label="Rejected"
      value={data.rejected}
    />
  </div>
);

const LegendItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-600">
    <span
      className="w-2.5 h-2.5 rounded-full inline-block"
      style={{ backgroundColor: color }}
    />
    {label}: {value}%
  </div>
);

const ChartSkeleton = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="skeleton w-[190px] h-[190px] rounded-full" />
    <div className="flex gap-6">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="h-[240px] flex items-center justify-center text-sm text-status-rejected">
    <span>{message}</span>
    <button
      onClick={onRetry}
      className="ml-2 underline hover:no-underline font-medium"
    >
      Retry
    </button>
  </div>
);

export default function TaskApprovalRate() {
  const [data, setData] = useState<TaskApprovalRateData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getTaskApprovalRate();
      setData(res);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to load approval rate. Please try again."),
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ChartContainer title="Task Approval Rate" className="w-96">
      {isFetching && <ChartSkeleton />}

      {!isFetching && error && (
        <ErrorState message={error} onRetry={fetchData} />
      )}

      {!isFetching && !error && data && (
        <>
          <DonutChart data={data} />
          <Legend data={data} />
        </>
      )}
    </ChartContainer>
  );
}
