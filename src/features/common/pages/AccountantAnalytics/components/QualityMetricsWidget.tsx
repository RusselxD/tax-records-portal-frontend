import { ChartContainer } from "../../../../../components/common";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";

interface StatRowProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: "green" | "red" | "neutral";
}

const highlightColors = {
  green: "text-status-approved",
  red: "text-status-rejected",
  neutral: "text-primary",
};

const StatRow = ({ label, value, sub, highlight = "neutral" }: StatRowProps) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm text-gray-600 leading-snug">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <span className={`text-xl font-bold ${highlightColors[highlight]} ml-4 shrink-0`}>
      {value}
    </span>
  </div>
);

export default function QualityMetricsWidget({ className }: { className?: string }) {
  const { qualityMetrics } = useAccountantAnalytics();
  const { data, loading, error, retry } = qualityMetrics;

  const approvalRate = data ? Math.round((data.firstAttemptApprovalRate ?? 0) * 100) : 0;
  const rateHighlight =
    approvalRate >= 80 ? "green" : approvalRate >= 50 ? "neutral" : "red";

  if (loading) return <div className={`skeleton rounded-xl h-56 w-full ${className ?? ""}`} />;

  return (
    <ChartContainer title="Quality Metrics" className={className}>

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
        <div className="divide-y divide-gray-100">
          <StatRow
            label="Total Submissions"
            value={(data.totalSubmitted ?? 0).toLocaleString()}
          />
          <StatRow
            label="First-Attempt Approvals"
            sub="Approved with zero rejections"
            value={(data.firstAttemptApproved ?? 0).toLocaleString()}
          />
          <StatRow
            label="First-Attempt Approval Rate"
            value={`${approvalRate}%`}
            highlight={rateHighlight}
          />
          <StatRow
            label="Avg Rejection Cycles"
            sub="Per submitted task"
            value={(data.avgRejectionCyclesPerTask ?? 0).toFixed(1)}
            highlight={(data.avgRejectionCyclesPerTask ?? 0) > 1.5 ? "red" : "neutral"}
          />
        </div>
      )}
    </ChartContainer>
  );
}
