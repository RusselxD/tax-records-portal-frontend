import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import type { OnboardingPipelineResponse } from "../../../../../types/analytics";

const SEGMENTS = [
  { key: "onboarding", label: "Onboarding", color: "#F59E0B" },
  { key: "activeClient", label: "Active", color: "#16A34A" },
  { key: "offboarding", label: "Offboarding", color: "#2F6FED" },
  { key: "inactiveClient", label: "Inactive", color: "#9CA3AF" },
] as const;

const Skeleton = () => <div className="skeleton rounded-lg h-[240px]" />;

function Donut({ data }: { data: OnboardingPipelineResponse }) {
  const total = data.total ?? 0;
  const isEmpty = total === 0;

  const slices = SEGMENTS.map((s) => ({
    name: s.label,
    value: (data[s.key] as number) ?? 0,
    color: s.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        {isEmpty ? (
          <Pie
            data={[{ value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            dataKey="value"
            strokeWidth={0}
            fill="#E5E7EB"
            isAnimationActive={false}
          />
        ) : (
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={2}
            stroke="#fff"
          >
            {slices.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
        )}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
          <tspan x="50%" dy="-8" fontSize={24} fontWeight={700} fill="#0F172A">
            {total}
          </tspan>
          <tspan x="50%" dy={20} fontSize={11} fill="#9CA3AF">
            {isEmpty ? "No clients" : "clients"}
          </tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

function Legend({ data }: { data: OnboardingPipelineResponse }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {SEGMENTS.map((s) => {
        const value = (data[s.key] as number) ?? 0;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">{value}</span>{" "}
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPipelineWidget() {
  const { pipeline } = useAccountantAnalytics();
  const { data, loading, error, retry } = pipeline;

  return (
    <div className="h-full flex flex-col rounded-lg bg-white custom-shadow px-5 py-4">
      <h2 className="text-base font-semibold text-primary mb-4">
        Client Status Distribution
      </h2>
      <div className="flex-1 flex flex-col gap-8">
        {loading && <Skeleton />}

        {!loading && error && (
          <div className="flex items-center justify-center py-10 text-sm text-status-rejected">
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
          </>
        )}
      </div>
    </div>
  );
}
