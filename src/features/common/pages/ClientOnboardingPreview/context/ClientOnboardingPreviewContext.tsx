import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getErrorMessage, isNotFoundError } from "../../../../../lib/api-error";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Permission, hasPermission } from "../../../../../constants";
import { clientAPI } from "../../../../../api/client";
import type {
  ClientInfoHeaderResponse,
  ClientInfoSections,
  InfoSectionKey,
  ClientStatusType,
} from "../../../../../types/client-info";
import type { ProfileReviewStatus } from "../../../../../types/client-profile";
import type { ClientAccountResponse } from "../../../../../types/client";
import useLazySections from "../../../components/client-info/hooks/useLazySections";

type SectionStatus = "idle" | "loading" | "loaded" | "error";

interface ClientInfoReviewContextType {
  taskId: string;
  clientId: string;
  header: ClientInfoHeaderResponse | null;
  clientName: string;
  status: ClientStatusType | null;
  hasActiveTask: boolean;
  lastReviewStatus: ProfileReviewStatus | null;
  setStatus: (status: ClientStatusType) => void;
  setHasActiveTask: (value: boolean) => void;
  setLastReviewStatus: (status: ProfileReviewStatus) => void;
  hasAccount: boolean;
  clientAccount: ClientAccountResponse | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
  logsVersion: number;
  signalLogsRefetch: () => void;
  getSection: <K extends InfoSectionKey>(key: K) => {
    data: ClientInfoSections[K] | null;
    status: SectionStatus;
  };
  fetchSection: (key: InfoSectionKey) => void;
}

const ClientInfoReviewContext =
  createContext<ClientInfoReviewContextType | null>(null);

export function ClientInfoReviewProvider({
  taskId,
  children,
}: {
  taskId: string;
  children: ReactNode;
}) {
  const [resolvedClientId, setResolvedClientId] = useState<string | null>(null);
  const [header, setHeader] = useState<ClientInfoHeaderResponse | null>(null);
  const [statusOverride, setStatusOverride] = useState<ClientStatusType | null>(null);
  const [activeTaskOverride, setActiveTaskOverride] = useState<boolean | null>(null);
  const [reviewStatusOverride, setReviewStatusOverride] = useState<ProfileReviewStatus | null>(null);
  const [clientAccount, setClientAccount] =
    useState<ClientAccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [logsVersion, setLogsVersion] = useState(0);
  const { user } = useAuth();
  const canManageOnboarding = hasPermission(user?.permissions, Permission.CLIENT_INFO_CREATE);

  const clientId = resolvedClientId ?? "";
  const { getSection, fetchSection, resetSections } = useLazySections(clientId || null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setStatusOverride(null);
    setActiveTaskOverride(null);
    setReviewStatusOverride(null);
    resetSections();
    try {
      // Single call: get header + clientId from task endpoint
      const taskData = await clientAPI.getClientInfoTask(taskId);
      setResolvedClientId(taskData.clientId);
      setHeader(taskData);

      if (canManageOnboarding) {
        const accountInfo = await clientAPI.getClientAccount(taskData.clientId).catch(() => null);
        setClientAccount(accountInfo);
      }
    } catch (err) {
      if (isNotFoundError(err)) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err, "Failed to load client details. Try again."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [taskId, canManageOnboarding, resetSections]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clientName = header?.clientDisplayName ?? "";
  const status = statusOverride ?? header?.clientStatus ?? null;
  const hasActiveTask = activeTaskOverride ?? header?.hasActiveTask ?? false;
  const lastReviewStatus = reviewStatusOverride ?? header?.lastReviewStatus ?? null;
  const hasAccount = clientAccount !== null;

  const setStatus = useCallback((newStatus: ClientStatusType) => {
    setStatusOverride(newStatus);
  }, []);

  const setHasActiveTask = useCallback((value: boolean) => {
    setActiveTaskOverride(value);
  }, []);

  const setLastReviewStatus = useCallback((status: ProfileReviewStatus) => {
    setReviewStatusOverride(status);
  }, []);

  const signalLogsRefetch = useCallback(() => {
    setLogsVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({
      taskId,
      clientId,
      header,
      clientName,
      status,
      hasActiveTask,
      lastReviewStatus,
      setStatus,
      setHasActiveTask,
      setLastReviewStatus,
      hasAccount,
      clientAccount,
      isLoading,
      error,
      notFound,
      refetch: fetchData,
      logsVersion,
      signalLogsRefetch,
      getSection,
      fetchSection,
    }),
    [
      taskId,
      clientId,
      header,
      clientName,
      status,
      hasActiveTask,
      lastReviewStatus,
      setStatus,
      setHasActiveTask,
      setLastReviewStatus,
      hasAccount,
      clientAccount,
      isLoading,
      error,
      notFound,
      fetchData,
      logsVersion,
      signalLogsRefetch,
      getSection,
      fetchSection,
    ],
  );

  return (
    <ClientInfoReviewContext.Provider value={value}>
      {children}
    </ClientInfoReviewContext.Provider>
  );
}

export function useInfoReview() {
  const context = useContext(ClientInfoReviewContext);
  if (!context) {
    throw new Error(
      "useInfoReview must be used within a ClientInfoReviewProvider",
    );
  }
  return context;
}
