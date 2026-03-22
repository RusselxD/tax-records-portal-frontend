import { useEffect, useState } from "react";
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
import { StatCard, DotList, MetricPill } from "../../../../../components/analytics";
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

  const onTimeRateVal = metrics.onTimeRate ?? 0;
  const onTimeRate = metrics.onTimeRate != null ? `${Math.round(onTimeRateVal * 100)}%` : "—";
  const approvalRateVal = metrics.firstAttemptApprovalRate ?? 0;
  const approvalRate = metrics.firstAttemptApprovalRate != null ? `${Math.round(approvalRateVal * 100)}%` : "—";

  return (
    <div className="grid grid-cols-4 gap-4">
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

      <StatCard
        label="Avg Completion Time"
        valueDisplay={avgDays}
        subtitle={
          <MetricPill
            label={`${onTimeRate} on time`}
            bg="bg-emerald-100"
            text="text-emerald-700"
          />
        }
        icon={<Timer className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatCard
        label="First-Attempt Approval"
        valueDisplay={approvalRate}
        subtitle={
          <MetricPill
            label={`${parseFloat((metrics.avgRejectionCyclesPerTask ?? 0).toFixed(1))} avg rejections`}
            bg="bg-red-50"
            text="text-status-rejected"
          />
        }
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="bg-emerald-100/70"
        iconColor="text-status-approved"
      />

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
