import { useEffect, useState } from "react";
import { ClipboardList, Send, FileCheck } from "lucide-react";
import { accountantAnalyticsAPI } from "../../../../../api/accountantAnalytics";
import type { AccountantsDashboardAnalyticsResponse } from "../../../../../types/analytics";
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
  subtitle,
  icon,
  iconBg,
  iconColor,
  pill,
}: {
  label: string;
  value: number;
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
        <span className="text-4xl font-bold text-primary">{value}</span>
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

export default function TaskStats() {
  const [stats, setStats] =
    useState<AccountantsDashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const data = await accountantAnalyticsAPI.getDashboardAnalytics();
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
          onClick={() => {
            setIsLoading(true);
            setError(null);
            accountantAnalyticsAPI
              .getDashboardAnalytics()
              .then(setStats)
              .catch((err) => setError(getErrorMessage(err)))
              .finally(() => setIsLoading(false));
          }}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-5">
        <StatCard
          label="Open Tasks"
          value={stats.openTasks}
          icon={<ClipboardList className="w-6 h-6" />}
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
          label="Submitted Tasks"
          value={stats.submittedTasks}
          subtitle="Pending review"
          icon={<Send className="w-6 h-6" />}
          iconBg="bg-amber-100/70"
          iconColor="text-status-pending"
        />
        <StatCard
          label="For Filing"
          value={stats.forFilingTasks}
          subtitle="Ready to file"
          icon={<FileCheck className="w-6 h-6" />}
          iconBg="bg-emerald-100/70"
          iconColor="text-status-approved"
        />
      </div>
    </div>
  );
}
