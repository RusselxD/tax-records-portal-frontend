import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import usePaginatedFetch from "../../../../../hooks/usePaginatedFetch";
import type {
  TaxRecordTaskListItem,
  TaxRecordTaskFilters,
  Period,
  TaxRecordTaskStatus,
} from "../../../../../types/tax-record-task";

interface TaxRecordTasksContextType {
  tasks: TaxRecordTaskListItem[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  filters: TaxRecordTaskFilters;
  setSearch: (value: string) => void;
  setClientFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setSubCategoryFilter: (value: string) => void;
  setTaskNameFilter: (value: string) => void;
  setYearFilter: (value: string) => void;
  setPeriodFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setAccountantFilter: (value: string) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

const TaxRecordTasksContext = createContext<TaxRecordTasksContextType | null>(null);

export function TaxRecordTasksProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [taskNameId, setTaskNameId] = useState("");
  const [year, setYear] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("");
  const [accountantId, setAccountantId] = useState("");

  const setSearch = useCallback((v: string) => setSearchState(v), []);
  const setClientFilter = useCallback((v: string) => setClientId(v), []);
  const setCategoryFilter = useCallback((v: string) => setCategoryId(v), []);
  const setSubCategoryFilter = useCallback((v: string) => setSubCategoryId(v), []);
  const setTaskNameFilter = useCallback((v: string) => setTaskNameId(v), []);
  const setYearFilter = useCallback((v: string) => setYear(v), []);
  const setPeriodFilter = useCallback((v: string) => setPeriod(v), []);
  const setStatusFilter = useCallback((v: string) => setStatus(v), []);
  const setAccountantFilter = useCallback((v: string) => setAccountantId(v), []);

  const filterParams = useMemo(() => {
    const f: Record<string, string | number> = {};
    if (search) f.search = search;
    if (clientId) f.clientId = clientId;
    if (categoryId) f.categoryId = Number(categoryId);
    if (subCategoryId) f.subCategoryId = Number(subCategoryId);
    if (taskNameId) f.taskNameId = Number(taskNameId);
    if (year) f.year = Number(year);
    if (period) f.period = period;
    if (status) f.status = status;
    if (accountantId) f.accountantId = accountantId;
    return f;
  }, [search, clientId, categoryId, subCategoryId, taskNameId, year, period, status, accountantId]);

  // Expose the typed filters object for the UI (filters display, etc.)
  const filters = useMemo<TaxRecordTaskFilters>(() => {
    const f: TaxRecordTaskFilters = { page: 0, size: 20 };
    if (search) f.search = search;
    if (clientId) f.clientId = clientId;
    if (categoryId) f.categoryId = Number(categoryId);
    if (subCategoryId) f.subCategoryId = Number(subCategoryId);
    if (taskNameId) f.taskNameId = Number(taskNameId);
    if (year) f.year = Number(year);
    if (period) f.period = period as Period;
    if (status) f.status = status as TaxRecordTaskStatus;
    if (accountantId) f.accountantId = accountantId;
    return f;
  }, [search, clientId, categoryId, subCategoryId, taskNameId, year, period, status, accountantId]);

  const fetchFn = useCallback(
    (p: { page: number; size: number } & Record<string, unknown>) =>
      taxRecordTaskAPI.getTasks(p as TaxRecordTaskFilters),
    [],
  );

  const { items: tasks, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(fetchFn, filterParams, 20, "Failed to fetch tasks. Try again.");

  const value = useMemo(
    () => ({
      tasks, isFetching, error, page, totalPages, totalElements, filters,
      setSearch, setClientFilter, setCategoryFilter, setSubCategoryFilter,
      setTaskNameFilter, setYearFilter, setPeriodFilter, setStatusFilter,
      setAccountantFilter, setPage, refetch,
    }),
    [
      tasks, isFetching, error, page, totalPages, totalElements, filters,
      setSearch, setClientFilter, setCategoryFilter, setSubCategoryFilter,
      setTaskNameFilter, setYearFilter, setPeriodFilter, setStatusFilter,
      setAccountantFilter, setPage, refetch,
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
