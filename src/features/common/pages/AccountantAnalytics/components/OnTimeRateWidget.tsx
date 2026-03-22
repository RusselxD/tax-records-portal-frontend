import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../../../../../components/common";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import type { OnTimeRateResponse } from "../../../../../types/analytics";

const COLORS = { onTime: "#16A34A", late: "#DC2626" };

const Donut = ({ data }: { data: OnTimeRateResponse }) => {
  const rate = Math.round((data.onTimeRate ?? 0) * 100);
  const isEmpty = !data.totalCompleted;

  if (isEmpty) {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={[{ value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={82}
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
            fontSize={13}
            fill="#9CA3AF"
          >
            No data yet
          </text>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const slices = [
    { name: "On Time", value: data.completedOnTime, color: COLORS.onTime },
    { name: "Late", value: data.completedLate, color: COLORS.late },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={slices}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={82}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {slices.map((s) => (
            <Cell key={s.name} fill={s.color} />
          ))}
        </Pie>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
          <tspan x="50%" dy="-8" fontSize={26} fontWeight={700} fill="#0F172A">
            {rate}%
          </tspan>
          <tspan x="50%" dy={22} fontSize={11} fill="#9CA3AF">
            on time
          </tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

const Legend = ({ data }: { data: OnTimeRateResponse }) => (
  <div className="flex items-center justify-center gap-5 mt-1">
    <div className="flex items-center gap-1.5 text-sm text-gray-600">
      <span className="w-2.5 h-2.5 rounded-full bg-status-approved inline-block" />
      On Time: {data.completedOnTime ?? 0}
    </div>
    <div className="flex items-center gap-1.5 text-sm text-gray-600">
      <span className="w-2.5 h-2.5 rounded-full bg-status-rejected inline-block" />
      Late: {data.completedLate ?? 0}
    </div>
  </div>
);

export default function OnTimeRateWidget() {
  const { onTimeRate } = useAccountantAnalytics();
  const { data, loading, error, retry } = onTimeRate;

  if (loading) return <div className="skeleton rounded-xl h-64 w-full" />;

  return (
    <ChartContainer title="On-Time Rate">
      {!loading && error && (
        <div className="h-[220px] flex items-center justify-center text-sm text-status-rejected">
          <span>{error}</span>
          <button
            onClick={retry}
            className="ml-2 underline hover:no-underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <Donut data={data} />
          <Legend data={data} />
          <p className="text-center text-xs text-gray-400 mt-3">
            Based on {data.totalCompleted ?? 0} completed{" "}
            {(data.totalCompleted ?? 0) === 1 ? "task" : "tasks"}
          </p>
        </>
      )}
    </ChartContainer>
  );
}
