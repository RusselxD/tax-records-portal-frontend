import { ChartContainer } from "../../../../../components/common";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import type { OnboardingPipelineResponse } from "../../../../../types/analytics";

interface StageProps {
  label: string;
  count: number;
  total: number;
  color: string;
  barColor: string;
}

const Stage = ({ label, count, total, color, barColor }: StageProps) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${color}`}>{label}</span>
        <span className="text-sm font-bold text-primary">{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">{pct}% of total</p>
    </div>
  );
};

const Skeleton = () => (
  <div className="space-y-5 pt-1">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-4 w-8 rounded" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    ))}
  </div>
);

const Content = ({ data }: { data: OnboardingPipelineResponse }) => (
  <div className="space-y-5">
    <Stage
      label="Onboarding"
      count={data.onboarding}
      total={data.total}
      color="text-amber-600"
      barColor="bg-amber-400"
    />
    <Stage
      label="Approved"
      count={data.approved}
      total={data.total}
      color="text-blue-600"
      barColor="bg-blue-400"
    />
    <Stage
      label="Active"
      count={data.active}
      total={data.total}
      color="text-emerald-600"
      barColor="bg-emerald-400"
    />
    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
      <span className="text-sm text-gray-500">Total Clients</span>
      <span className="text-lg font-bold text-primary">{data.total}</span>
    </div>
  </div>
);

export default function OnboardingPipelineWidget() {
  const { pipeline } = useAccountantAnalytics();
  const { data, loading, error, retry } = pipeline;

  return (
    <ChartContainer title="Client Pipeline">
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

      {!loading && !error && data && <Content data={data} />}
    </ChartContainer>
  );
}
