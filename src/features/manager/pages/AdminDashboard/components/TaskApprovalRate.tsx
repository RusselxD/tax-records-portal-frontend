import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { TaskApprovalRateData } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer, Dropdown } from "../../../../../components/common";
import { rangeOptions, ErrorState } from "./chartShared";

const COLORS = { approved: "#16A34A", rejected: "#DC2626" };

interface SliceData {
  name: string;
  value: number;
  color: string;
}

const buildSlices = (data: TaskApprovalRateData): SliceData[] => [
  { name: "Approved", value: data.approvedRate, color: COLORS.approved },
  { name: "Rejected", value: data.rejectedRate, color: COLORS.rejected },
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
  const isEmpty = data.approvedRate === 0 && data.rejectedRate === 0;

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
        <CenterLabel rate={data.approvedRate} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Legend = ({ data }: { data: TaskApprovalRateData }) => (
  <div className="flex items-center justify-center gap-6 mt-2">
    <LegendItem
      color={COLORS.approved}
      label="Approved"
      value={data.approvedRate}
    />
    <LegendItem
      color={COLORS.rejected}
      label="Rejected"
      value={data.rejectedRate}
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


export default function TaskApprovalRate() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<TaskApprovalRateData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (selectedRange: string) => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getTaskApprovalRate(selectedRange);
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
    fetchData(range);
  }, [range]);

  return (
    <ChartContainer
      title="Task Approval Rate"
      className=""
      action={<Dropdown options={rangeOptions} value={range} onChange={setRange} size="sm" />}
    >
      {isFetching && <ChartSkeleton />}

      {!isFetching && error && (
        <ErrorState message={error} onRetry={() => fetchData(range)} className="h-[240px]" />
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
