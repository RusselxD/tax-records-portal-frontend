import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import type {
  TaxRecordTaskListItem,
  TaxRecordTaskFilters,
  Period,
  TaxRecordTaskStatus,
} from "../../../../../types/tax-record-task";

const PAGE_SIZE = 20;

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
  const [tasks, setTasks] = useState<TaxRecordTaskListItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearchState] = useState("");
  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [taskNameId, setTaskNameId] = useState("");
  const [year, setYear] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("");
  const [accountantId, setAccountantId] = useState("");

  const filters = useMemo<TaxRecordTaskFilters>(() => {
    const f: TaxRecordTaskFilters = { page, size: PAGE_SIZE };
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
  }, [page, search, clientId, categoryId, subCategoryId, taskNameId, year, period, status, accountantId]);

  const fetchTasks = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await taxRecordTaskAPI.getTasks(filters);
      setTasks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch tasks. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const resetPage = () => setPageState(0);

  const setSearch = (v: string) => { setSearchState(v); resetPage(); };
  const setClientFilter = (v: string) => { setClientId(v); resetPage(); };
  const setCategoryFilter = (v: string) => { setCategoryId(v); resetPage(); };
  const setSubCategoryFilter = (v: string) => { setSubCategoryId(v); resetPage(); };
  const setTaskNameFilter = (v: string) => { setTaskNameId(v); resetPage(); };
  const setYearFilter = (v: string) => { setYear(v); resetPage(); };
  const setPeriodFilter = (v: string) => { setPeriod(v); resetPage(); };
  const setStatusFilter = (v: string) => { setStatus(v); resetPage(); };
  const setAccountantFilter = (v: string) => { setAccountantId(v); resetPage(); };
  const setPage = (p: number) => setPageState(p);

  return (
    <TaxRecordTasksContext.Provider
      value={{
        tasks,
        isFetching,
        error,
        page,
        totalPages,
        totalElements,
        filters,
        setSearch,
        setClientFilter,
        setCategoryFilter,
        setSubCategoryFilter,
        setTaskNameFilter,
        setYearFilter,
        setPeriodFilter,
        setStatusFilter,
        setAccountantFilter,
        setPage,
        refetch: fetchTasks,
      }}
    >
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
