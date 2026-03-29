import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { oosClientAPI } from "../../../../../api/client";
import type { ClientOnboardingListItemResponse } from "../../../../../types/client";

interface ClientOnboardingContextType {
  clients: ClientOnboardingListItemResponse[];
  isFetching: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  refetch: () => void;
}

const ClientOnboardingContext =
  createContext<ClientOnboardingContextType | null>(null);

export function ClientOnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allClients, setAllClients] = useState<
    ClientOnboardingListItemResponse[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await oosClientAPI.getMyOnboardingClients({
        search: debouncedSearch,
      });
      setAllClients(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch clients. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await oosClientAPI.getMyOnboardingClients({
          search: debouncedSearch,
        });
        if (!cancelled) setAllClients(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to fetch clients. Try again."));
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedSearch]);

  const value = useMemo(
    () => ({
      clients: allClients,
      isFetching,
      error,
      search,
      statusFilter,
      setSearch,
      setStatusFilter,
      refetch: fetchClients,
    }),
    [allClients, isFetching, error, search, statusFilter, fetchClients],
  );

  return (
    <ClientOnboardingContext.Provider value={value}>
      {children}
    </ClientOnboardingContext.Provider>
  );
}

export function useClientOnboarding() {
  const context = useContext(ClientOnboardingContext);
  if (!context) {
    throw new Error(
      "useClientOnboarding must be used within a ClientOnboardingProvider",
    );
  }
  return context;
}
