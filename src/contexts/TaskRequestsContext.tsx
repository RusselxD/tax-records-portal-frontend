import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useWebSocket, type WebSocketMessage } from "./WebSocketContext";
import { taxRecordTaskRequestAPI } from "../api/tax-record-task-request";
import { hasPermission, Permission } from "../constants";
import { TAX_RECORD_TASK_REQUEST_STATUS } from "../types/tax-record-task-request";

interface TaskRequestsContextType {
  pendingCount: number;
  refreshPending: () => void;
}

const TaskRequestsContext = createContext<TaskRequestsContextType | null>(null);

export function TaskRequestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();
  const canReview = hasPermission(user?.permissions, Permission.TAX_RECORD_TASK_REQUEST_REVIEW);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPending = useCallback(async () => {
    if (!canReview) return;
    try {
      const res = await taxRecordTaskRequestAPI.list({
        status: TAX_RECORD_TASK_REQUEST_STATUS.PENDING,
        page: 0,
        size: 1,
      });
      setPendingCount(res.totalElements);
    } catch {
      // silent fail — badge is a cue, not critical
    }
  }, [canReview]);

  useEffect(() => {
    if (!canReview) {
      setPendingCount(0);
      return;
    }
    refreshPending();
  }, [canReview, refreshPending]);

  useEffect(() => {
    if (!canReview) return;
    return subscribe("NEW_NOTIFICATION", (msg: WebSocketMessage) => {
      const notif = msg.payload as { type?: string } | undefined;
      if (notif?.type === "TAX_RECORD_TASK_REQUEST_SUBMITTED") {
        refreshPending();
      }
    });
  }, [canReview, subscribe, refreshPending]);

  const value = useMemo(
    () => ({ pendingCount, refreshPending }),
    [pendingCount, refreshPending],
  );

  return (
    <TaskRequestsContext.Provider value={value}>
      {children}
    </TaskRequestsContext.Provider>
  );
}

export function useTaskRequests() {
  const ctx = useContext(TaskRequestsContext);
  if (!ctx) {
    throw new Error("useTaskRequests must be used within a TaskRequestsProvider");
  }
  return ctx;
}
