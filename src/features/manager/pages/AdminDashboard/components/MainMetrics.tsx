import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { SystemAnalyticsResponse } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";

type AccentColor = "green" | "navy" | "red" | "amber";

const accentBorderColors: Record<AccentColor, string> = {
  green: "border-l-status-approved",
  navy: "border-l-primary",
  red: "border-l-status-rejected",
  amber: "border-l-status-pending",
};

interface MetricCardProps {
  value: string;
  label: string;
  subtitle?: string;
  accent: AccentColor;
}

const MetricCard = ({ value, label, subtitle, accent }: MetricCardProps) => (
  <div
    className={`rounded-lg bg-white custom-shadow border-l-4 ${accentBorderColors[accent]} p-5`}
  >
    <div className="text-2xl font-bold text-primary leading-tight">{value}</div>
    <div className="text-sm text-gray-600 mt-1 leading-snug">{label}</div>
    <div className="text-xs text-gray-400 mt-1 min-h-[16px] leading-snug">
      {subtitle ?? "\u00A0"}
    </div>
  </div>
);

const MetricCardSkeleton = () => (
  <div className="rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-[3px] border-l-gray-200 p-5">
    <div className="skeleton h-7 w-20 rounded" />
    <div className="skeleton h-4 w-32 rounded mt-2" />
    <div className="skeleton h-3 w-44 rounded mt-2" />
  </div>
);

const formatNumber = (n: number | null | undefined): string =>
  n != null ? n.toLocaleString() : "—";

const buildMetricCards = (data: SystemAnalyticsResponse): MetricCardProps[] => [
  {
    value: formatNumber(data.totalClients),
    label: "Total Clients",
    subtitle: `${formatNumber(data.totalActiveClients)} active \u00B7 ${formatNumber(data.totalPendingClients)} pending approval`,
    accent: "green",
  },
  {
    value: formatNumber(data.totalTasks),
    label: "Total Tasks",
    subtitle: `${formatNumber(data.openTasks)} open \u00B7 ${formatNumber(data.submittedTasks)} submitted \u00B7 ${formatNumber(data.approvedTasks)} approved \u00B7 ${formatNumber(data.rejectedTasks)} rejected`,
    accent: "navy",
  },
  {
    value: formatNumber(data.totalOverdueTasks),
    label: "Total Overdue Tasks",
    accent: "red",
  },
  {
    value: formatNumber(data.profilesPendingReview),
    label: "Profiles Pending Review",
    accent: "amber",
  },
  {
    value: formatNumber(data.tasksApprovedThisMonth),
    label: "Tasks Approved This Month",
    accent: "green",
  },
  {
    value:
      data.avgTaskCompletionInDays != null
        ? `${data.avgTaskCompletionInDays} days`
        : "—",
    label: "Avg Task Completion Time",
    accent: "navy",
  },
  {
    value: formatNumber(data.tasksDueThisWeek),
    label: "Tasks Due This Week",
    accent: "amber",
  },
  {
    value: formatNumber(data.tasksRejectedThisMonth),
    label: "Tasks Rejected This Month",
    accent: "red",
  },
];

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="col-span-full flex items-center justify-center rounded-lg bg-red-50 p-6 text-sm text-status-rejected">
    <span>{message}</span>
    <button
      onClick={onRetry}
      className="ml-2 underline hover:no-underline font-medium"
    >
      Retry
    </button>
  </div>
);

export default function MainMetrics() {
  const [metrics, setMetrics] = useState<SystemAnalyticsResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getSystemAnalytics();
      setMetrics(res);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to load metrics. Please try again."),
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {isFetching &&
        Array.from({ length: 8 }).map((_, i) => <MetricCardSkeleton key={i} />)}

      {!isFetching && error && (
        <ErrorState message={error} onRetry={fetchMetrics} />
      )}

      {!isFetching &&
        !error &&
        metrics &&
        buildMetricCards(metrics).map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
    </div>
  );
}
