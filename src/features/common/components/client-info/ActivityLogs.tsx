import { useState, useEffect, useCallback } from "react";
import { Send, RotateCw, Check, X, Loader2 } from "lucide-react";
import SidebarCard from "./SidebarCard";
import { formatDateTime } from "../../../../lib/formatters";
import { clientAPI } from "../../../../api/client";
import { useAuth } from "../../../../contexts/AuthContext";
import type { ClientInfoLogsItemResponse } from "../../../../types/client";

const actionConfig: Record<
  string,
  { label: string; icon: typeof Send; color: string; bg: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    icon: Send,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  RESUBMITTED: {
    label: "Resubmitted",
    icon: RotateCw,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  APPROVED: {
    label: "Approved",
    icon: Check,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  REJECTED: {
    label: "Rejected",
    icon: X,
    color: "text-red-500",
    bg: "bg-red-100",
  },
};

function LogEntry({
  log,
  isLast,
  currentUserName,
}: {
  log: ClientInfoLogsItemResponse;
  isLast: boolean;
  currentUserName: string;
}) {
  const config = actionConfig[log.action] ?? actionConfig.SUBMITTED;
  const Icon = config.icon;
  const displayName =
    log.performedBy === currentUserName ? "You" : log.performedBy;

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

      <div className="pb-5 min-w-0">
        <p className="text-sm font-medium text-primary leading-[26px]">
          {config.label} &middot; {displayName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDateTime(log.createdAt)}
        </p>
        {log.comment && log.comment.trim() !== "" && (
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            {log.comment}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ActivityLogs({
  taskId,
  refetchSignal = 0,
}: {
  taskId: string | null;
  refetchSignal?: number;
}) {
  const { user } = useAuth();
  const currentUserName = user?.name ?? "";

  const [logs, setLogs] = useState<ClientInfoLogsItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!taskId) {
      setLogs([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await clientAPI.getClientInfoLogs(taskId);
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refetchSignal]);

  return (
    <SidebarCard title="Activity Logs">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : logs.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-gray-400">No activity yet</p>
        </div>
      ) : (
        <div className="px-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {logs.map((log, i) => (
            <LogEntry
              key={i}
              log={log}
              isLast={i === logs.length - 1}
              currentUserName={currentUserName}
            />
          ))}
        </div>
      )}
    </SidebarCard>
  );
}
