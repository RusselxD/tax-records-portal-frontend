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

interface ClientListContextType {
  clients: ClientListItemResponse[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

const ClientListContext = createContext<ClientListContextType | null>(null);

export function ClientListProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const setSearch = useCallback((v: string) => setSearchState(v), []);

  const params = useMemo(
    () => (search ? { search } : {}),
    [search],
  );

  const { items: clients, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(clientAPI.getClients, params, 20, "Failed to fetch clients. Try again.");

  const value = useMemo(
    () => ({
      clients, isFetching, error, page, totalPages, totalElements, search,
      setSearch, setPage, refetch,
    }),
    [clients, isFetching, error, page, totalPages, totalElements, search, setSearch, setPage, refetch],
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
