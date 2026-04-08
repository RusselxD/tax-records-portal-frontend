import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { useDebounce } from "../../../../../hooks/useDebounce";
import usePaginatedFetch from "../../../../../hooks/usePaginatedFetch";
import type {
  TaxRecordTaskListItem,
  TaxRecordTaskFilters,
  Period,
  TaxRecordTaskStatus,
  SortBy,
  SortDirection,
} from "../../../../../types/tax-record-task";

interface TaxRecordTasksContextType {
  tasks: TaxRecordTaskListItem[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;
  filters: TaxRecordTaskFilters;
  sortBy: SortBy | undefined;
  sortDirection: SortDirection | undefined;
  setSearch: (value: string) => void;
  setClientFilter: (value: string) => void;
  setTaskNameFilter: (value: string) => void;
  setPeriodFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setAccountantFilter: (value: string) => void;
  toggleSort: (column: SortBy) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

const TaxRecordTasksContext = createContext<TaxRecordTasksContextType | null>(null);

export function TaxRecordTasksProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [clientId, setClientId] = useState("");
  const [taskNameId, setTaskNameId] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("");
  const [accountantId, setAccountantId] = useState("");
  const [sortBy, setSortBy] = useState<SortBy | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>();

  const setSearch = useCallback((v: string) => setSearchState(v), []);
  const debouncedSearch = useDebounce(search);
  const setClientFilter = useCallback((v: string) => setClientId(v), []);
  const setTaskNameFilter = useCallback((v: string) => setTaskNameId(v), []);
  const setPeriodFilter = useCallback((v: string) => setPeriod(v), []);
  const setStatusFilter = useCallback((v: string) => setStatus(v), []);
  const setAccountantFilter = useCallback((v: string) => setAccountantId(v), []);

  const toggleSort = useCallback((column: SortBy) => {
    setSortBy((prev) => {
      if (prev !== column) {
        setSortDirection("ASC");
        return column;
      }
      setSortDirection((dir) => {
        if (dir === "ASC") return "DESC";
        // If already desc, clear sort
        setSortBy(undefined);
        return undefined;
      });
      return prev;
    });
  }, []);

  const filterParams = useMemo(() => {
    const f: Record<string, string | number> = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (clientId) f.clientId = clientId;
    if (taskNameId) f.taskNameId = Number(taskNameId);
    if (period) f.period = period;
    if (status) f.status = status;
    if (accountantId) f.accountantId = accountantId;
    if (sortBy) f.sortBy = sortBy;
    if (sortDirection) f.sortDirection = sortDirection;
    return f;
  }, [debouncedSearch, clientId, taskNameId, period, status, accountantId, sortBy, sortDirection]);

  const filters = useMemo<TaxRecordTaskFilters>(() => {
    const f: TaxRecordTaskFilters = { page: 0, size: 20 };
    if (debouncedSearch) f.search = debouncedSearch;
    if (clientId) f.clientId = clientId;
    if (taskNameId) f.taskNameId = Number(taskNameId);
    if (period) f.period = period as Period;
    if (status) f.status = status as TaxRecordTaskStatus;
    if (accountantId) f.accountantId = accountantId;
    if (sortBy) f.sortBy = sortBy;
    if (sortDirection) f.sortDirection = sortDirection;
    return f;
  }, [debouncedSearch, clientId, taskNameId, period, status, accountantId, sortBy, sortDirection]);

  const fetchFn = useCallback(
    (p: { page: number; size: number } & Record<string, unknown>) =>
      taxRecordTaskAPI.getTasks(p as TaxRecordTaskFilters),
    [],
  );

  const { items: tasks, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(fetchFn, filterParams, 20, "Failed to fetch tasks. Try again.");

  const value = useMemo(
    () => ({
      tasks, isFetching, error, page, totalPages, totalElements, search, filters,
      sortBy, sortDirection, setSearch, setClientFilter, setTaskNameFilter,
      setPeriodFilter, setStatusFilter, setAccountantFilter, toggleSort,
      setPage, refetch,
    }),
    [
      tasks, isFetching, error, page, totalPages, totalElements, search, filters,
      sortBy, sortDirection, setSearch, setClientFilter, setTaskNameFilter,
      setPeriodFilter, setStatusFilter, setAccountantFilter, toggleSort,
      setPage, refetch,
    ],
  );

  return (
    <TaxRecordTasksContext.Provider value={value}>
      {children}
    </TaxRecordTasksContext.Provider>
  );
}

export function useTaxRecordTasks() {
  const context = useContext(TaxRecordTasksContext);
  if (!context) {
    throw new Error(
      "useTaxRecordTasks must be used within a TaxRecordTasksProvider",
    );
  }
  return context;
}
