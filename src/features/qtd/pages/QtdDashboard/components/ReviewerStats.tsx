import { useEffect, useState } from "react";
import { ClipboardCheck, ThumbsUp, TrendingUp } from "lucide-react";
import { accountantAnalyticsAPI } from "../../../../../api/accountantAnalytics";
import type { ReviewerDashboardStatsResponse } from "../../../../../types/analytics";
import { getErrorMessage } from "../../../../../lib/api-error";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="skeleton rounded-lg h-28"></div>
      <div className="skeleton rounded-lg h-28"></div>
      <div className="skeleton rounded-lg h-28"></div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueDisplay,
  subtitle,
  icon,
  iconBg,
  iconColor,
  pill,
}: {
  label: string;
  value: number;
  valueDisplay?: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  pill?: { label: string; bg: string; text: string };
}) {
  return (
    <div className="bg-white rounded-lg custom-shadow p-5">
      <div className="flex items-start justify-between text-sm">
        <p className="font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className={`p-3 rounded-full ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="flex items-baseline gap-3 -mt-3">
        <span className="text-4xl font-bold text-primary">
          {valueDisplay ?? value}
        </span>
        {pill && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pill.bg} ${pill.text}`}
          >
            {pill.label}
          </span>
        )}
        {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}

export default function ReviewerStats() {
  const [stats, setStats] =
    useState<ReviewerDashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const data = await accountantAnalyticsAPI.getReviewerDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <StatsSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-2xl custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button
          onClick={async () => {
            setIsLoading(true);
            setError(null);
            try {
              const data = await accountantAnalyticsAPI.getReviewerDashboardStats();
              setStats(data);
            } catch (err) {
              setError(getErrorMessage(err));
            } finally {
              setIsLoading(false);
            }
          }}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const approvalRateDisplay =
    stats.approvalRateThisMonth !== null
      ? `${Math.round(stats.approvalRateThisMonth * 100)}%`
      : "—";

  const approvalRateSubtitle =
    stats.approvalRateThisMonth !== null ? "This month" : "No reviews yet";

  return (
    <div className="grid grid-cols-3 gap-5">
      <StatCard
        label="Awaiting Review"
        value={stats.awaitingReview}
        icon={<ClipboardCheck className="w-6 h-6" />}
        iconBg="bg-accent-light"
        iconColor="text-accent"
        pill={
          stats.newToday > 0
            ? {
                label: `+${stats.newToday} new today`,
                bg: "bg-emerald-100",
                text: "text-emerald-700",
              }
            : undefined
        }
      />
      <StatCard
        label="Approved Today"
        value={stats.approvedToday}
        subtitle="Approved for filing"
        icon={<ThumbsUp className="w-6 h-6" />}
        iconBg="bg-emerald-100/70"
        iconColor="text-status-approved"
      />
      <StatCard
        label="Approval Rate"
        value={stats.approvalRateThisMonth ?? 0}
        valueDisplay={approvalRateDisplay}
        subtitle={approvalRateSubtitle}
        icon={<TrendingUp className="w-6 h-6" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
    </div>
  );
}
