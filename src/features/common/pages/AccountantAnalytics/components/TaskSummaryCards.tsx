import {
  ClipboardList,
  Clock,
  XCircle,
  CheckCircle2,
  FolderCheck,
  CheckCheck,
  AlertTriangle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
import type { TaskSummaryResponse } from "../../../../../types/analytics";

interface StatCardProps {
  value: number;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  value,
  label,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) => (
  <div className="bg-white border border-gray-100 rounded-xl custom-shadow p-5">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
    </div>
    <div className="text-2xl font-bold text-primary tabular-nums">
      {value.toLocaleString()}
    </div>
  </div>
);

const buildCards = (data: TaskSummaryResponse): StatCardProps[] => [
  {
    value: data.open,
    label: "Open Tasks",
    icon: ClipboardList,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: data.submitted,
    label: "Submitted for Review",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    value: data.rejected,
    label: "Rejected",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    value: data.approvedForFiling,
    label: "Approved for Filing",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    value: data.filed,
    label: "Filed",
    icon: FolderCheck,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    value: data.completed,
    label: "Completed",
    icon: CheckCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    value: data.overdue,
    label: "Overdue",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    value: data.completedThisMonth,
    label: "Completed This Month",
    icon: TrendingUp,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

export default function TaskSummaryCards() {
  const { taskSummary } = useAccountantAnalytics();
  const { data, loading, error, retry } = taskSummary;

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
        <div className="skeleton rounded-md h-24 w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-red-50 p-6 text-sm text-status-rejected">
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
