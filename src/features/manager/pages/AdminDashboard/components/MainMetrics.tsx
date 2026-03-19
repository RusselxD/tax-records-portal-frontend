import { useEffect, useState, type ReactNode } from "react";
import {
  Users,
  ClipboardList,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Timer,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { SystemAnalyticsResponse } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { formatNum } from "../../../../../lib/formatters";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton rounded-lg h-28" />
      ))}
    </div>
  );
}

interface DotItem {
  label: string;
  value: number;
  dot: string;
}

interface StatCardProps {
  label: string;
  valueDisplay: string;
  subtitle?: ReactNode;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  pill?: { label: string; bg: string; text: string };
}

function StatCard({
  label,
  valueDisplay,
  subtitle,
  icon,
  iconBg,
  iconColor,
  pill,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg custom-shadow p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className={`p-2.5 rounded-full ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="flex items-baseline gap-2.5 mt-1">
        <span className="text-3xl font-bold text-primary leading-tight">
          {valueDisplay}
        </span>
        {pill && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pill.bg} ${pill.text}`}>
            {pill.label}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm">{subtitle}</div>
      )}
    </div>
  );
}

function DotList({ items }: { items: DotItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {items.map(({ label, value, dot }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-xs text-gray-400">
            <span className="font-medium text-gray-600">{formatNum(value)}</span> {label}
          </span>
        </div>
      ))}
    </div>
  );
}

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
      setError(getErrorMessage(err, "Failed to load metrics. Please try again."));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isFetching) return <StatsSkeleton />;

  if (error) {
    return (
      <div className="col-span-4 flex items-center justify-center rounded-lg bg-red-50 p-6 text-sm text-status-rejected">
        <span>{error}</span>
        <button onClick={fetchMetrics} className="ml-2 underline hover:no-underline font-medium">
          Retry
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  const avgDays = metrics.avgTaskCompletionInDays != null
    ? `${parseFloat(metrics.avgTaskCompletionInDays.toFixed(1))} days`
    : "—";

  const onTimeRate = `${Math.round(metrics.onTimeRate * 100)}%`;
  const approvalRate = `${Math.round(metrics.firstAttemptApprovalRate * 100)}%`;

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Card 1 — Clients */}
      <StatCard
        label="Total Clients"
        valueDisplay={formatNum(metrics.totalClients)}
        subtitle={<DotList items={[
          { label: "Active", value: metrics.activeClients, dot: "bg-status-approved" },
          { label: "Onboarding", value: metrics.onboardingClients, dot: "bg-blue-400" },
          { label: "Offboarding", value: metrics.offboardingClients, dot: "bg-status-pending" },
          { label: "Inactive", value: metrics.inactiveClients, dot: "bg-gray-300" },
        ]} />}
        icon={<Users className="w-5 h-5" />}
        iconBg="bg-accent-light"
        iconColor="text-accent"
      />

      {/* Card 2 — Tasks */}
      <StatCard
        label="Total Tasks"
        valueDisplay={formatNum(metrics.totalTasks)}
        subtitle={<DotList items={[
          { label: "Open", value: metrics.openTasks, dot: "bg-blue-400" },
          { label: "Submitted", value: metrics.submittedTasks, dot: "bg-status-pending" },
          { label: "Approved", value: metrics.approvedForFilingTasks, dot: "bg-status-approved" },
          { label: "Rejected", value: metrics.rejectedTasks, dot: "bg-status-rejected" },
        ]} />}
        icon={<ClipboardList className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      {/* Card 3 — Overdue & Due */}
      <StatCard
        label="Overdue Tasks"
        valueDisplay={formatNum(metrics.totalOverdueTasks)}
        subtitle={<DotList items={[
          { label: "Due today", value: metrics.tasksDueToday, dot: "bg-status-pending" },
          { label: "Due this week", value: metrics.tasksDueThisWeek, dot: "bg-blue-400" },
        ]} />}
        icon={<AlertCircle className="w-5 h-5" />}
        iconBg="bg-red-50"
        iconColor="text-status-rejected"
      />

      {/* Card 4 — Profiles */}
      <StatCard
        label="Profiles Pending Review"
        valueDisplay={formatNum(metrics.profilesPendingReview)}
        subtitle={<DotList items={[
          { label: "Onboarding", value: metrics.onboardingProfilesPending, dot: "bg-blue-400" },
          { label: "Updates", value: metrics.profileUpdatesPending, dot: "bg-status-pending" },
        ]} />}
        icon={<FileSearch className="w-5 h-5" />}
        iconBg="bg-amber-100/70"
        iconColor="text-status-pending"
      />

      {/* Card 5 — Monthly Activity */}
      <StatCard
        label="Completed This Month"
        valueDisplay={formatNum(metrics.tasksCompletedThisMonth)}
        subtitle={<DotList items={[
          { label: "Created", value: metrics.tasksCreatedThisMonth, dot: "bg-blue-400" },
          { label: "Rejected", value: metrics.tasksRejectedThisMonth, dot: "bg-status-rejected" },
        ]} />}
        icon={<CheckCircle2 className="w-5 h-5" />}
        iconBg="bg-emerald-100/70"
        iconColor="text-status-approved"
      />

      {/* Card 6 — Completion Time */}
      <StatCard
        label="Avg Completion Time"
        valueDisplay={avgDays}
        subtitle={
          <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {onTimeRate} on time
          </span>
        }
        icon={<Timer className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      {/* Card 7 — Quality */}
      <StatCard
        label="First-Attempt Approval"
        valueDisplay={approvalRate}
        subtitle={
          <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-status-rejected">
            {parseFloat(metrics.avgRejectionCyclesPerTask.toFixed(1))} avg rejections
          </span>
        }
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="bg-emerald-100/70"
        iconColor="text-status-approved"
      />

      {/* Card 8 — Onboarding Pipeline */}
      <StatCard
        label="Activated This Month"
        valueDisplay={formatNum(metrics.clientsActivatedThisMonth)}
        subtitle={<DotList items={[
          { label: "In onboarding", value: metrics.onboardingClientsCopy, dot: "bg-blue-400" },
          { label: "Pending review", value: metrics.onboardingProfilesPendingCopy, dot: "bg-status-pending" },
        ]} />}
        icon={<UserCheck className="w-5 h-5" />}
        iconBg="bg-accent-light"
        iconColor="text-accent"
      />
    </div>
  );
}
