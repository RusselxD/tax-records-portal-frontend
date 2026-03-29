import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { consultationAPI } from "../../../../../api/consultation";
import usePaginatedFetch from "../../../../../hooks/usePaginatedFetch";
import type {
  ConsultationLogListItem,
  ConsultationLogFilters,
  ConsultationStatus,
  BillableType,
} from "../../../../../types/consultation";

interface ConsultationLogsContextType {
  logs: ConsultationLogListItem[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  filters: ConsultationLogFilters;
  setSearch: (v: string) => void;
  setClientFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setBillableFilter: (v: string) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

const ConsultationLogsContext = createContext<ConsultationLogsContextType | null>(null);

export function ConsultationLogsProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("");
  const [billableType, setBillableType] = useState("");

  const setSearch = useCallback((v: string) => setSearchState(v), []);
  const setClientFilter = useCallback((v: string) => setClientId(v), []);
  const setStatusFilter = useCallback((v: string) => setStatus(v), []);
  const setBillableFilter = useCallback((v: string) => setBillableType(v), []);

  const filterParams = useMemo(() => {
    const f: Record<string, string | number> = {};
    if (search) f.search = search;
    if (clientId) f.clientId = clientId;
    if (status) f.status = status;
    if (billableType) f.billableType = billableType;
    return f;
  }, [search, clientId, status, billableType]);

  const filters = useMemo<ConsultationLogFilters>(() => {
    const f: ConsultationLogFilters = { page: 0, size: 20 };
    if (search) f.search = search;
    if (clientId) f.clientId = clientId;
    if (status) f.status = status as ConsultationStatus;
    if (billableType) f.billableType = billableType as BillableType;
    return f;
  }, [search, clientId, status, billableType]);

  const fetchFn = useCallback(
    (p: { page: number; size: number } & Record<string, unknown>) =>
      consultationAPI.getLogs(p as ConsultationLogFilters),
    [],
  );

  const { items: logs, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(fetchFn, filterParams, 20, "Failed to fetch consultation logs.");

  const value = useMemo(
    () => ({
      logs, isFetching, error, page, totalPages, totalElements, filters,
      setSearch, setClientFilter, setStatusFilter, setBillableFilter,
      setPage, refetch,
    }),
    [
      logs, isFetching, error, page, totalPages, totalElements, filters,
      setSearch, setClientFilter, setStatusFilter, setBillableFilter,
      setPage, refetch,
    ],
  );

  return (
    <ConsultationLogsContext.Provider value={value}>
      {children}
    </ConsultationLogsContext.Provider>
  );
}

export function useConsultationLogs() {
  const ctx = useContext(ConsultationLogsContext);
  if (!ctx) throw new Error("useConsultationLogs must be used within ConsultationLogsProvider");
  return ctx;
}
