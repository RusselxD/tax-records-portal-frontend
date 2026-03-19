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
import { clientAPI } from "../../../../../api/client";
import type { ClientListItemResponse } from "../../../../../types/client";

const PAGE_SIZE = 20;

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
  const [clients, setClients] = useState<ClientListItemResponse[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearchState] = useState("");

  const params = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      ...(search ? { search } : {}),
    }),
    [page, search],
  );

  const fetchClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await clientAPI.getClients(params);
      setClients(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch clients. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, [params]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const setSearch = (v: string) => {
    setSearchState(v);
    setPageState(0);
  };

  const setPage = (p: number) => setPageState(p);

  return (
    <ClientListContext.Provider
      value={{
        clients,
        isFetching,
        error,
        page,
        totalPages,
        totalElements,
        search,
        setSearch,
        setPage,
        refetch: fetchClients,
      }}
    >
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
