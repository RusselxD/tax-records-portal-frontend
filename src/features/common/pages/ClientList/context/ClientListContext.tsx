import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { clientAPI } from "../../../../../api/client";
import usePaginatedFetch from "../../../../../hooks/usePaginatedFetch";
import type { ClientListItemResponse } from "../../../../../types/client";

type SortDirection = "ASC" | "DESC";

interface ClientListContextType {
  clients: ClientListItemResponse[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;
  sortBy: string | undefined;
  sortDirection: SortDirection | undefined;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  toggleSort: (column: string) => void;
  refetch: () => void;
}

const ClientListContext = createContext<ClientListContextType | null>(null);

export function ClientListProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(undefined);
  const setSearch = useCallback((v: string) => setSearchState(v), []);

  const toggleSort = useCallback((column: string) => {
    setSortBy((prev) => {
      if (prev !== column) {
        setSortDirection("ASC");
        return column;
      }
      setSortDirection((d) => (d === "ASC" ? "DESC" : "ASC"));
      return column;
    });
  }, []);

  const params = useMemo(
    () => {
      const p: Record<string, string> = {};
      if (search) p.search = search;
      if (sortBy) p.sortBy = sortBy;
      if (sortDirection) p.sortDirection = sortDirection;
      return p;
    },
    [search, sortBy, sortDirection],
  );

  const { items: clients, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(clientAPI.getClients, params, 20, "Failed to fetch clients. Try again.");

  const value = useMemo(
    () => ({
      clients, isFetching, error, page, totalPages, totalElements, search,
      sortBy, sortDirection,
      setSearch, setPage, toggleSort, refetch,
    }),
    [clients, isFetching, error, page, totalPages, totalElements, search, sortBy, sortDirection, setSearch, setPage, toggleSort, refetch],
  );

  return (
    <ClientListContext.Provider value={value}>
      {children}
    </ClientListContext.Provider>
  );
}

export function useClientList() {
  const context = useContext(ClientListContext);
  if (!context) {
    throw new Error(
      "useClientList must be used within a ClientListProvider",
    );
  }
  return context;
}
