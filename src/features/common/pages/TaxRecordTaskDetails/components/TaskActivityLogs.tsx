import { useCallback } from "react";
import {
  Send,
  Check,
  X,
  Plus,
  FileCheck,
  Flag,
  CheckCircle,
  Undo2,
} from "lucide-react";
import { formatDateTime } from "../../../../../lib/formatters";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import CommentPopover from "../../../../../components/common/CommentPopover";
import type {
  TaxRecordTaskLogAction,
  TaxRecordTaskLogResponse,
} from "../../../../../types/tax-record-task";

const actionConfig: Record<
  TaxRecordTaskLogAction,
  { label: string; icon: typeof Send; color: string; bg: string }
> = {
  CREATED: { label: "Created", icon: Plus, color: "text-blue-600", bg: "bg-blue-100" },
  SUBMITTED: { label: "Submitted", icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  RECALLED: { label: "Recalled", icon: Undo2, color: "text-amber-600", bg: "bg-amber-100" },
  APPROVED: { label: "Approved", icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  REJECTED: { label: "Rejected", icon: X, color: "text-red-500", bg: "bg-red-100" },
  APPROVED_FOR_FILING: { label: "Approved for filing", icon: FileCheck, color: "text-indigo-600", bg: "bg-indigo-100" },
  FILED: { label: "Marked as filed", icon: Flag, color: "text-purple-600", bg: "bg-purple-100" },
  COMPLETED: { label: "Completed", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
};

function LogEntry({
  log,
  taskId,
  isLast,
  currentUserName,
}: {
  log: TaxRecordTaskLogResponse;
  taskId: string;
  isLast: boolean;
  currentUserName: string;
}) {
  const config = actionConfig[log.action] ?? actionConfig.CREATED;
  const Icon = config.icon;
  const displayName = log.performedBy === currentUserName ? "You" : log.performedBy;

  const fetchComment = useCallback(
    async () => {
      const res = await taxRecordTaskAPI.getTaskLogComment(taskId, log.id);
      return res.comment;
    },
    [taskId, log.id],
  );

  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200" />
      )}

      <div
        className={`relative z-10 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full ${config.bg}`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} strokeWidth={2.5} />
      </div>

      <div className="pb-5 min-w-0 flex-1">
        <p className="text-sm font-medium text-primary leading-[26px]">
          {config.label} &middot; {displayName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDateTime(log.performedAt)}
        </p>

        {log.hasComment && (
          <CommentPopover fetchComment={fetchComment} />
        )}
      </div>
    </div>
  );
}

export default function TaskActivityLogs() {
  const { task, logs } = useTaxRecordTaskDetails();
  const { user } = useAuth();
  const currentUserName = user?.name ?? "";

  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-primary">Activity Logs</h3>
      </div>

      {logs.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-gray-400">No activity yet</p>
        </div>
      ) : (
        <div className="px-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {logs.map((log, i) => (
            <LogEntry
              key={log.id}
              log={log}
              taskId={task?.id ?? ""}
              isLast={i === logs.length - 1}
              currentUserName={currentUserName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
