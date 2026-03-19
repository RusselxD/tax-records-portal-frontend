import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import type { TaxRecordTaskStatus } from "../../../../../types/tax-record-task";

interface BannerConfig {
  icon: LucideIcon;
  message: string;
  variant: "amber" | "blue" | "red" | "green" | "indigo" | "emerald" | "gray";
}

const variantStyles: Record<string, string> = {
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  red: "bg-red-50 border-red-200 text-red-700",
  green: "bg-green-50 border-green-200 text-green-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  gray: "bg-gray-50 border-gray-200 text-gray-600",
};

function resolveBanner(
  status: TaxRecordTaskStatus,
  isAccountant: boolean,
): BannerConfig {
  if (isAccountant) {
    switch (status) {
      case "OPEN":
        return { icon: Upload, message: "Upload files and submit when ready.", variant: "amber" };
      case "SUBMITTED":
        return { icon: Clock, message: "Submitted for review. Waiting for approval.", variant: "blue" };
      case "REJECTED":
        return { icon: AlertCircle, message: "Task was rejected. Review feedback and re-submit.", variant: "red" };
      case "APPROVED_FOR_FILING":
        return { icon: FileText, message: "Approved for filing. Mark as filed when done.", variant: "green" };
      case "FILED":
        return { icon: FileText, message: "Filed. Mark as completed when done.", variant: "indigo" };
      case "COMPLETED":
        return { icon: CheckCircle2, message: "Task completed.", variant: "emerald" };
    }
  }

  // Manager/QTD
  switch (status) {
    case "OPEN":
      return { icon: Clock, message: "Waiting for accountant to submit.", variant: "gray" };
    case "SUBMITTED":
      return { icon: FileText, message: "Ready for review.", variant: "blue" };
    case "REJECTED":
      return { icon: AlertCircle, message: "You rejected this task.", variant: "gray" };
    case "APPROVED_FOR_FILING":
      return { icon: CheckCircle2, message: "Approved for filing.", variant: "green" };
    case "FILED":
      return { icon: FileText, message: "Filed. Waiting for completion.", variant: "indigo" };
    case "COMPLETED":
      return { icon: CheckCircle2, message: "Task completed.", variant: "emerald" };
  }
}

export default function TaskStatusBanner() {
  const { task } = useTaxRecordTaskDetails();
  const { user } = useAuth();

  if (!task) return null;

  const canExecute = hasPermission(user?.permissions, Permission.TASK_EXECUTE);

  const { icon: Icon, message, variant } = resolveBanner(task.status, canExecute);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
