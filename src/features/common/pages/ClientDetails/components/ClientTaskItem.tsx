import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants";
import type { ClientTaxRecordTaskItem, TaxRecordTaskStatus } from "../../../../../types/tax-record-task";

const statusStyles: Record<TaxRecordTaskStatus, string> = {
  OPEN: "bg-blue-50 text-blue-600 border border-blue-200",
  SUBMITTED: "bg-amber-50 text-amber-600 border border-amber-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
  APPROVED_FOR_FILING: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  FILED: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  COMPLETED: "bg-gray-50 text-gray-600 border border-gray-200",
};

const statusLabels: Record<TaxRecordTaskStatus, string> = {
  OPEN: "Open",
  SUBMITTED: "Submitted",
  REJECTED: "Rejected",
  APPROVED_FOR_FILING: "Approved",
  FILED: "Filed",
  COMPLETED: "Completed",
};

interface ClientTaskItemProps {
  task: ClientTaxRecordTaskItem;
  showAssignees: boolean;
}

export default function ClientTaskItem({ task, showAssignees }: ClientTaskItemProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = getRolePrefix(user!.roleKey);

  return (
    <div
      onClick={() => navigate(`${prefix}/tax-record-task/${task.id}`)}
      className={`py-3 cursor-pointer transition-colors hover:bg-gray-50 border-t border-gray-100 first:border-t-0 ${
        task.isOverdue ? "pl-3 border-l-4 border-l-red-400 pr-4" : "px-4"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-medium text-primary leading-relaxed" title={task.taskName}>
          {task.taskName}
        </p>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium flex-shrink-0 ${statusStyles[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {task.categoryName} · {task.period} {task.year}
      </p>

      <p className={`text-xs mt-0.5 ${task.isOverdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
        {task.isOverdue ? `Overdue · Due ${formatDate(task.deadline)}` : `Due ${formatDate(task.deadline)}`}
      </p>

      {showAssignees && task.assignedTo.length > 0 && (
        <div className="flex items-center gap-1.5 mt-1">
          <Users className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-500 truncate" title={task.assignedTo.join(", ")}>
            {task.assignedTo.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
