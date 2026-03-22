import {
  ClipboardList,
  AlertCircle,
  TrendingUp,
  Timer,
  CheckCircle2,
  Zap,
  Briefcase,
} from "lucide-react";
import { StatCard, DotList, MetricPill, TrendPill } from "../../../../../components/analytics";
import type { StatCardProps } from "../../../../../components/analytics";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import { formatNum } from "../../../../../lib/formatters";
import type { TaskSummaryResponse } from "../../../../../types/analytics";

/** Format a decimal value as "X.Xd", or "—" when zero/null */
function fmtDays(v: number | null | undefined): string {
  if (v == null || v === 0) return "—";
  return `${v.toFixed(1)}d`;
}

/** Safe toFixed that handles null/undefined */
function safeFix(v: number | null | undefined, digits = 1): string {
  if (v == null) return "—";
  return v.toFixed(digits);
}

function buildCards(d: TaskSummaryResponse): StatCardProps[] {
  const totalPipeline =
    d.open + d.submitted + d.rejected + d.approvedForFiling + d.filed + d.completed;

  const hasCompletions = (d.completed ?? 0) > 0 || (d.completedThisMonth ?? 0) > 0;
  const onTimeRatePct = hasCompletions ? Math.round((d.onTimeRate ?? 0) * 100) : null;

  const hasSubmissions = (d.submitted ?? 0) > 0 || (d.completedThisMonth ?? 0) > 0;
  const approvalRatePct = hasSubmissions
    ? Math.round((d.firstAttemptApprovalRate ?? 0) * 100)
    : null;

  return [
    {
      label: "Task Pipeline",
      valueDisplay: formatNum(totalPipeline),
      icon: <ClipboardList className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      subtitle: (
        <DotList
          items={[
            { label: "Open", value: d.open, dot: "bg-blue-400" },
            { label: "Submitted", value: d.submitted, dot: "bg-status-pending" },
            { label: "Approved", value: d.approvedForFiling, dot: "bg-status-approved" },
            { label: "Rejected", value: d.rejected, dot: "bg-status-rejected" },
          ]}
        />
      ),
    },
    {
      label: "Overdue Tasks",
      valueDisplay: formatNum(d.overdue),
      icon: <AlertCircle className="w-5 h-5" />,
      iconBg: "bg-red-50",
      iconColor: "text-status-rejected",
      subtitle: (
        <DotList
          items={[
            { label: "Due today", value: d.dueToday, dot: "bg-status-pending" },
            { label: "Due this week", value: d.dueThisWeek, dot: "bg-blue-400" },
          ]}
        />
      ),
    },
    {
      label: "Completed This Month",
      valueDisplay: formatNum(d.completedThisMonth),
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconBg: "bg-emerald-100/70",
      iconColor: "text-status-approved",
      subtitle: (
        <DotList
          items={[
            { label: "Submitted", value: d.submittedThisMonth, dot: "bg-status-pending" },
            { label: "New tasks", value: d.newTasksThisMonth, dot: "bg-blue-400" },
          ]}
        />
      ),
    },
    {
      label: "On-Time Rate",
      valueDisplay: onTimeRatePct != null ? `${onTimeRatePct}%` : "—",
      icon: <Timer className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      subtitle:
        onTimeRatePct != null ? (
          <MetricPill
            label={`${safeFix(d.avgCompletionDays)} days avg`}
            bg={onTimeRatePct >= 75 ? "bg-emerald-100" : "bg-red-50"}
            text={onTimeRatePct >= 75 ? "text-emerald-700" : "text-status-rejected"}
          />
        ) : (
          <span className="text-xs text-gray-400">No completed tasks yet</span>
        ),
    },
    {
      label: "First-Attempt Approval",
      valueDisplay: approvalRatePct != null ? `${approvalRatePct}%` : "—",
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-emerald-100/70",
      iconColor: "text-status-approved",
      subtitle:
        approvalRatePct != null ? (
          <MetricPill
            label={`${safeFix(d.avgRejectionCycles)} avg rejections`}
            bg={(d.avgRejectionCycles ?? 0) <= 1.5 ? "bg-emerald-100" : "bg-red-50"}
            text={
              (d.avgRejectionCycles ?? 0) <= 1.5
                ? "text-emerald-700"
                : "text-status-rejected"
            }
          />
        ) : (
          <span className="text-xs text-gray-400">No submissions yet</span>
        ),
    },
    {
      label: "Responsiveness",
      valueDisplay: fmtDays(d.avgDaysToFirstSubmit),
      icon: <Zap className="w-5 h-5" />,
      iconBg: "bg-amber-100/70",
      iconColor: "text-status-pending",
      subtitle:
        (d.avgDaysToFirstSubmit ?? 0) > 0 ||
        (d.avgRejectionTurnaroundDays ?? 0) > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-400" />
              <span>
                <span className="font-medium text-gray-600">
                  {safeFix(d.avgDaysToFirstSubmit)}d
                </span>{" "}
                to first submit
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-status-pending" />
              <span>
                <span className="font-medium text-gray-600">
                  {safeFix(d.avgRejectionTurnaroundDays)}d
                </span>{" "}
                rejection turnaround
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No submissions yet</span>
        ),
    },
    {
      label: "Current Workload",
      valueDisplay: formatNum(d.activeTaskCount),
      icon: <Briefcase className="w-5 h-5" />,
      iconBg: "bg-accent-light",
      iconColor: "text-accent",
      subtitle: (
        <DotList
          items={[
            { label: "Active tasks", value: d.activeTaskCount, dot: "bg-blue-400" },
            { label: "Clients", value: d.assignedClientCount, dot: "bg-status-approved" },
          ]}
        />
      ),
    },
    {
      label: "Monthly Trend",
      valueDisplay: formatNum(d.completedThisMonthTrend),
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      subtitle:
        d.completedLastMonth > 0 || d.completedThisMonthTrend > 0 ? (
          <div className="flex items-center gap-2">
            <TrendPill percentChange={d.percentChange} />
            <span className="text-xs text-gray-400">
              vs {formatNum(d.completedLastMonth)} last month
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Not enough data yet</span>
        ),
    },
  ];
}

export default function TaskSummaryCards() {
  const { taskSummary } = useAccountantAnalytics();
  const { data, loading, error, retry } = taskSummary;

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton rounded-lg h-28" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-red-50 p-6 text-sm text-status-rejected">
        <span>{error}</span>
        <button
          onClick={retry}
          className="ml-2 underline hover:no-underline font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      {buildCards(data).map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
