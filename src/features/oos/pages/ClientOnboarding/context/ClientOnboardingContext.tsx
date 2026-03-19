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
  const [statusFilter, setStatusFilter] = useState("");

  const fetchClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await oosClientAPI.getMyOnboardingClients();
      setAllClients(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch clients. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const clients = useMemo(() => {
    const query = search.toLowerCase();

    return allClients.filter((client) => {
      const matchesSearch =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allClients, search, statusFilter]);

  return (
    <ClientOnboardingContext.Provider
      value={{
        clients,
        isFetching,
        error,
        search,
        statusFilter,
        setSearch,
        setStatusFilter,
        refetch: fetchClients,
      }}
    >
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
