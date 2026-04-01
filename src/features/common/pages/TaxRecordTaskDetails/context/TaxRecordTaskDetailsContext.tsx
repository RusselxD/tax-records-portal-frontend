import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { isNotFoundError, isConflictError, getErrorMessage } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";
import {
  type TaxRecordTaskDetailResponse,
  type TaxRecordTaskFilesResponse,
  type TaxRecordTaskLogResponse,
} from "../../../../../types/tax-record-task";
import type { RichTextContent } from "../../../../../types/client-info";

interface TaxRecordTaskDetailsContextType {
  task: TaxRecordTaskDetailResponse | null;
  files: TaxRecordTaskFilesResponse | null;
  logs: TaxRecordTaskLogResponse[];
  isLoading: boolean;
  error: string | null;
  notFound: boolean;

  // Server-provided action flags
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
  submitTask: (comment: RichTextContent | null) => Promise<void>;
  approveTask: (comment: RichTextContent | null) => Promise<void>;
  rejectTask: (comment: RichTextContent | null) => Promise<void>;
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
  const { toastError } = useToast();

  const [task, setTask] = useState<TaxRecordTaskDetailResponse | null>(null);
  const [files, setFiles] = useState<TaxRecordTaskFilesResponse | null>(null);
  const [logs, setLogs] = useState<TaxRecordTaskLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  /** On 409 conflict: show toast, full refetch, then re-throw so caller UI resets */
  const handleConflict = useCallback(
    (err: unknown) => {
      if (isConflictError(err)) {
        toastError("Conflict", getErrorMessage(err));
        refetch();
      }
      throw err;
    },
    [toastError, refetch],
  );

  // Refetch only files (no loading spinner, no full page refresh)
  const refetchFiles = useCallback(async () => {
    try {
      const filesData = await taxRecordTaskAPI.getTaskFiles(taskId);
      setFiles(filesData);
    } catch {
      // silently fail — partial refetch
    }
  }, [taskId]);

  // Refetch only task (for updated action flags after file changes)
  const refetchTask = useCallback(async () => {
    try {
      const taskData = await taxRecordTaskAPI.getTask(taskId);
      setTask(taskData);
    } catch {
      // silently fail — partial refetch
    }
  }, [taskId]);


  // Initial fetch + full refetch (task, files, logs)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    async function fetch() {
      try {
        const [taskData, filesData, logsData] = await Promise.all([
          taxRecordTaskAPI.getTask(taskId),
          taxRecordTaskAPI.getTaskFiles(taskId),
          taxRecordTaskAPI.getTaskLogs(taskId),
        ]);
        if (cancelled) return;
        setTask(taskData);
        setFiles(filesData);
        setLogs(logsData);
      } catch (err) {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          setNotFound(true);
        } else {
          setError(getErrorMessage(err, "Failed to load task details."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [taskId, version]);

  // Server-provided action flags (from task.actions)
  const actions = task?.actions;
  const canEdit = actions?.canEdit ?? false;
  const canRecall = actions?.canRecall ?? false;
  const canSubmit = actions?.canSubmit ?? false;
  const canReview = (actions?.canApprove || actions?.canReject) ?? false;
  const canMarkFiled = actions?.canMarkFiled ?? false;
  const canMarkCompleted = actions?.canMarkCompleted ?? false;
  const canEditProof = actions?.canUploadProof ?? false;

  // Working file actions — refetch files + task (canSubmit depends on working files)
  const uploadWorkingFile = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadWorkingFile(taskId, file).catch(handleConflict);
      await Promise.all([refetchFiles(), refetchTask()]);
    },
    [taskId, refetchFiles, refetchTask, handleConflict],
  );

  const addWorkingLink = useCallback(
    async (url: string, label: string) => {
      await taxRecordTaskAPI.addWorkingLink(taskId, url, label).catch(handleConflict);
      await Promise.all([refetchFiles(), refetchTask()]);
    },
    [taskId, refetchFiles, refetchTask, handleConflict],
  );

  const deleteWorkingFile = useCallback(
    async (workingFileId: string) => {
      const prev = files;
      setFiles((f) => f ? {
        ...f,
        workingFiles: f.workingFiles.filter((w) => w.fileId !== workingFileId),
      } : f);
      try {
        await taxRecordTaskAPI.deleteWorkingFile(taskId, workingFileId);
        await refetchTask();
      } catch (err) {
        setFiles(prev);
        if (!isConflictError(err)) toastError(getErrorMessage(err, "Failed to delete file."));
        handleConflict(err);
      }
    },
    [taskId, files, refetchTask, handleConflict, toastError],
  );

  // Output file actions — refetch files + task (canSubmit depends on output file)
  const uploadOutputFile = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadOutputFile(taskId, file).catch(handleConflict);
      await Promise.all([refetchFiles(), refetchTask()]);
    },
    [taskId, refetchFiles, refetchTask, handleConflict],
  );

  const deleteOutputFile = useCallback(async () => {
    const prev = files;
    setFiles((f) => f ? { ...f, outputFile: null } : f);
    try {
      await taxRecordTaskAPI.deleteOutputFile(taskId);
      await refetchTask();
    } catch (err) {
      setFiles(prev);
      if (!isConflictError(err)) toastError(getErrorMessage(err, "Failed to delete file."));
      handleConflict(err);
    }
  }, [taskId, files, refetchTask, handleConflict, toastError]);

  const uploadProofOfFiling = useCallback(
    async (file: File) => {
      await taxRecordTaskAPI.uploadProofOfFiling(taskId, file).catch(handleConflict);
      await refetchFiles();
    },
    [taskId, refetchFiles, handleConflict],
  );

  const deleteProofOfFiling = useCallback(async () => {
    const prev = files;
    setFiles((f) => f ? { ...f, proofOfFilingFile: null } : f);
    try {
      await taxRecordTaskAPI.deleteProofOfFiling(taskId);
    } catch (err) {
      setFiles(prev);
      if (!isConflictError(err)) toastError(getErrorMessage(err, "Failed to delete file."));
      handleConflict(err);
    }
  }, [taskId, files, handleConflict, toastError]);

  // Workflow actions — full refetch so server-recomputed `actions` flags update the UI
  const submitTask = useCallback(
    async (comment: RichTextContent | null) => {
      await taxRecordTaskAPI.submitTask(taskId, comment).catch(handleConflict);
      refetch();
    },
    [taskId, refetch, handleConflict],
  );

  const approveTask = useCallback(
    async (comment: RichTextContent | null) => {
      await taxRecordTaskAPI.approveTask(taskId, comment).catch(handleConflict);
      refetch();
    },
    [taskId, refetch, handleConflict],
  );

  const rejectTask = useCallback(
    async (comment: RichTextContent | null) => {
      await taxRecordTaskAPI.rejectTask(taskId, comment).catch(handleConflict);
      refetch();
    },
    [taskId, refetch, handleConflict],
  );

  const markFiled = useCallback(async () => {
    await taxRecordTaskAPI.markFiled(taskId).catch(handleConflict);
    refetch();
  }, [taskId, refetch, handleConflict]);

  const markCompleted = useCallback(async () => {
    await taxRecordTaskAPI.markCompleted(taskId).catch(handleConflict);
    refetch();
  }, [taskId, refetch, handleConflict]);

  const recallTask = useCallback(async () => {
    await taxRecordTaskAPI.recallTask(taskId).catch(handleConflict);
    refetch();
  }, [taskId, refetch, handleConflict]);

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
