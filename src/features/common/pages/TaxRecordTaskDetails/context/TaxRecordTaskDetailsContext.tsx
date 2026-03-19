import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { isNotFoundError } from "../../../../../lib/api-error";
import {
  TAX_RECORD_TASK_STATUS,
  type TaxRecordTaskDetailResponse,
  type TaxRecordTaskFilesResponse,
  type TaxRecordTaskLogResponse,
  type TaxRecordTaskStatus,
} from "../../../../../types/tax-record-task";

interface TaxRecordTaskDetailsContextType {
  task: TaxRecordTaskDetailResponse | null;
  files: TaxRecordTaskFilesResponse | null;
  logs: TaxRecordTaskLogResponse[];
  isLoading: boolean;
  error: string | null;
  notFound: boolean;

  // Derived booleans
  canEdit: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canMarkFiled: boolean;
  canMarkCompleted: boolean;
  canEditProof: boolean;
  canRecall: boolean;

  // Working file actions
  uploadWorkingFile: (file: File) => Promise<void>;
  addWorkingLink: (url: string, label: string) => Promise<void>;
  deleteWorkingFile: (workingFileId: string) => Promise<void>;

  // Single file actions
  uploadOutputFile: (file: File) => Promise<void>;
  deleteOutputFile: () => Promise<void>;
  uploadProofOfFiling: (file: File) => Promise<void>;
  deleteProofOfFiling: () => Promise<void>;

  // Workflow actions
  submitTask: (comment: string) => Promise<void>;
  approveTask: (comment: string) => Promise<void>;
  rejectTask: (comment: string) => Promise<void>;
  markFiled: () => Promise<void>;
  markCompleted: () => Promise<void>;
  recallTask: () => Promise<void>;
  refetch: () => void;
}

const TaxRecordTaskDetailsContext =
  createContext<TaxRecordTaskDetailsContextType | null>(null);

export function TaxRecordTaskDetailsProvider({
  taskId,
  children,
}: {
  taskId: string;
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [task, setTask] = useState<TaxRecordTaskDetailResponse | null>(null);
  const [files, setFiles] = useState<TaxRecordTaskFilesResponse | null>(null);
  const [logs, setLogs] = useState<TaxRecordTaskLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  // Refetch only files (no loading spinner, no full page refresh)
  const refetchFiles = useCallback(async () => {
    try {
      const filesData = await taxRecordTaskAPI.getTaskFiles(taskId);
      setFiles(filesData);
    } catch {
      // silently fail — files section will stay stale
    }
  }, [taskId]);

  // Refetch only logs
  const refetchLogs = useCallback(async () => {
    try {
      const logsData = await taxRecordTaskAPI.getTaskLogs(taskId);
      setLogs(logsData);
    } catch {
      // silently fail
    }
  }, [taskId]);

  // Update status locally without refetching
  const updateStatus = useCallback((newStatus: TaxRecordTaskStatus) => {
    setTask((prev) => (prev ? { ...prev, status: newStatus } : prev));
  }, []);

  // Initial fetch + full refetch (task, files, logs)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    Promise.all([
      taxRecordTaskAPI.getTask(taskId),
      taxRecordTaskAPI.getTaskFiles(taskId),
      taxRecordTaskAPI.getTaskLogs(taskId),
    ])
      .then(([taskData, filesData, logsData]) => {
        if (cancelled) return;
        setTask(taskData);
        setFiles(filesData);
        setLogs(logsData);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          setNotFound(true);
        } else {
          setError("Failed to load task details.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [taskId, version]);

  // Derived booleans
  const canExecute = hasPermission(user?.permissions, Permission.TASK_EXECUTE);
  const canReviewTasks = hasPermission(user?.permissions, Permission.TASK_REVIEW);
  const status = task?.status;

  const canEdit =
    canExecute &&
    (status === TAX_RECORD_TASK_STATUS.OPEN ||
      status === TAX_RECORD_TASK_STATUS.REJECTED);
  const canRecall = canExecute && status === TAX_RECORD_TASK_STATUS.SUBMITTED;
  const hasFiles =
    (files?.workingFiles?.length ?? 0) > 0 || files?.outputFile != null;
  const canSubmit =
    canEdit &&
    hasFiles &&
    (status === TAX_RECORD_TASK_STATUS.OPEN ||
      status === TAX_RECORD_TASK_STATUS.REJECTED);
  const canReview = canReviewTasks && status === TAX_RECORD_TASK_STATUS.SUBMITTED;
  const canMarkFiled = canExecute && status === TAX_RECORD_TASK_STATUS.APPROVED_FOR_FILING;
  const canMarkCompleted = canExecute && status === TAX_RECORD_TASK_STATUS.FILED;
  const canEditProof = canExecute && status === TAX_RECORD_TASK_STATUS.FILED;

  // Working file actions — only refetch files
  const uploadWorkingFile = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadWorkingFile(taskId, file);
      await refetchFiles();
    },
    [taskId, refetchFiles],
  );

  const addWorkingLink = useCallback(
    async (url: string, label: string) => {
      await taxRecordTaskAPI.addWorkingLink(taskId, url, label);
      await refetchFiles();
    },
    [taskId, refetchFiles],
  );

  const deleteWorkingFile = useCallback(
    async (workingFileId: string) => {
      await taxRecordTaskAPI.deleteWorkingFile(taskId, workingFileId);
      await refetchFiles();
    },
    [taskId, refetchFiles],
  );

  // Single file actions — only refetch files
  const uploadOutputFile = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadOutputFile(taskId, file);
      await refetchFiles();
    },
    [taskId, refetchFiles],
  );

  const deleteOutputFile = useCallback(async () => {
    await taxRecordTaskAPI.deleteOutputFile(taskId);
    await refetchFiles();
  }, [taskId, refetchFiles]);

  const uploadProofOfFiling = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadProofOfFiling(taskId, file);
      await refetchFiles();
    },
    [taskId, refetchFiles],
  );

  const deleteProofOfFiling = useCallback(async () => {
    await taxRecordTaskAPI.deleteProofOfFiling(taskId);
    await refetchFiles();
  }, [taskId, refetchFiles]);

  // Workflow actions — full refetch (status changes, logs update)
  const submitTask = useCallback(
    async (comment: string) => {
      await taxRecordTaskAPI.submitTask(taskId, comment);
      updateStatus("SUBMITTED");
      refetchLogs();
    },
    [taskId, updateStatus, refetchLogs],
  );

  const approveTask = useCallback(
    async (comment: string) => {
      await taxRecordTaskAPI.approveTask(taskId, comment);
      updateStatus("APPROVED_FOR_FILING");
      refetchLogs();
    },
    [taskId, updateStatus, refetchLogs],
  );

  const rejectTask = useCallback(
    async (comment: string) => {
      await taxRecordTaskAPI.rejectTask(taskId, comment);
      updateStatus("REJECTED");
      refetchLogs();
    },
    [taskId, updateStatus, refetchLogs],
  );

  const markFiled = useCallback(async () => {
    await taxRecordTaskAPI.markFiled(taskId);
    updateStatus("FILED");
    refetchLogs();
  }, [taskId, updateStatus, refetchLogs]);

  const markCompleted = useCallback(async () => {
    await taxRecordTaskAPI.markCompleted(taskId);
    updateStatus("COMPLETED");
    refetchLogs();
  }, [taskId, updateStatus, refetchLogs]);

  const recallTask = useCallback(async () => {
    await taxRecordTaskAPI.recallTask(taskId);
    updateStatus("OPEN");
    refetchLogs();
  }, [taskId, updateStatus, refetchLogs]);

  const value = useMemo(
    () => ({
      task,
      files,
      logs,
      isLoading,
      error,
      notFound,
      canEdit,
      canSubmit,
      canReview,
      canMarkFiled,
      canMarkCompleted,
      canEditProof,
      canRecall,
      uploadWorkingFile,
      addWorkingLink,
      deleteWorkingFile,
      uploadOutputFile,
      deleteOutputFile,
      uploadProofOfFiling,
      deleteProofOfFiling,
      submitTask,
      approveTask,
      rejectTask,
      markFiled,
      markCompleted,
      recallTask,
      refetch,
    }),
    [
      task, files, logs, isLoading, error, notFound,
      canEdit, canSubmit, canReview, canMarkFiled, canMarkCompleted, canEditProof, canRecall,
      uploadWorkingFile, addWorkingLink, deleteWorkingFile,
      uploadOutputFile, deleteOutputFile,
      uploadProofOfFiling, deleteProofOfFiling,
      submitTask, approveTask, rejectTask,
      markFiled, markCompleted, recallTask, refetch,
    ],
  );

  return (
    <TaxRecordTaskDetailsContext.Provider value={value}>
      {children}
    </TaxRecordTaskDetailsContext.Provider>
  );
}

export function useTaxRecordTaskDetails() {
  const context = useContext(TaxRecordTaskDetailsContext);
  if (!context) {
    throw new Error(
      "useTaxRecordTaskDetails must be used within a TaxRecordTaskDetailsProvider",
    );
  }
  return context;
}
