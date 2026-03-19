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
import { clientAPI } from "../../../../../api/client";
import type { ClientProfileReviewListItem } from "../../../../../types/client-profile";

interface ClientProfilesContextType {
  reviews: ClientProfileReviewListItem[];
  isFetching: boolean;
  error: string | null;
  search: string;
  typeFilter: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setTypeFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  refetch: () => void;
}

const ClientProfilesContext = createContext<ClientProfilesContextType | null>(null);

export function ClientProfilesProvider({ children }: { children: ReactNode }) {
  const [allReviews, setAllReviews] = useState<ClientProfileReviewListItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchReviews = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await clientAPI.getProfileReviews();
      setAllReviews(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch client profiles. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const reviews = useMemo(() => {
    const query = search.toLowerCase();

    return allReviews.filter((review) => {
      const matchesSearch =
        !query ||
        review.clientName.toLowerCase().includes(query) ||
        review.submittedBy.toLowerCase().includes(query);

      const matchesType = !typeFilter || review.type === typeFilter;
      const matchesStatus = !statusFilter || review.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allReviews, search, typeFilter, statusFilter]);

  return (
    <ClientProfilesContext.Provider
      value={{
        reviews,
        isFetching,
        error,
        search,
        typeFilter,
        statusFilter,
        setSearch,
        setTypeFilter,
        setStatusFilter,
        refetch: fetchReviews,
      }}
    >
      {children}
    </ClientProfilesContext.Provider>
  );
}

export function useClientProfiles() {
  const context = useContext(ClientProfilesContext);
  if (!context) {
    throw new Error(
      "useClientProfiles must be used within a ClientProfilesProvider",
    );
  }
  return context;
}
