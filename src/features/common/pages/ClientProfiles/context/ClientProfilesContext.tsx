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
import { useDebounce } from "../../../../../hooks/useDebounce";
import type {
  ClientProfileReviewListItem,
  ProfileReviewType,
  ProfileReviewStatus,
} from "../../../../../types/client-profile";

interface ClientProfilesContextType {
  reviews: ClientProfileReviewListItem[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;
  typeFilter: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setTypeFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

const ClientProfilesContext = createContext<ClientProfilesContextType | null>(null);

export function ClientProfilesProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [typeFilter, setTypeFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");

  const setSearch = useCallback((v: string) => setSearchState(v), []);
  const debouncedSearch = useDebounce(search);
  const setTypeFilter = useCallback((v: string) => setTypeFilterState(v), []);
  const setStatusFilter = useCallback((v: string) => setStatusFilterState(v), []);

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (typeFilter) p.type = typeFilter;
    if (statusFilter) p.status = statusFilter;
    return p;
  }, [debouncedSearch, typeFilter, statusFilter]);

  const fetchFn = useCallback(
    (p: { page: number; size: number } & Record<string, string>) =>
      clientAPI.getProfileReviews({
        page: p.page,
        size: p.size,
        search: p.search,
        type: p.type as ProfileReviewType | undefined,
        status: p.status as ProfileReviewStatus | undefined,
      }),
    [],
  );

  const { items: reviews, isFetching, error, page, totalPages, totalElements, setPage, refetch } =
    usePaginatedFetch(fetchFn, params, 20, "Failed to fetch client profiles. Try again.");

  const value = useMemo(
    () => ({
      reviews, isFetching, error, page, totalPages, totalElements,
      search, typeFilter, statusFilter,
      setSearch, setTypeFilter, setStatusFilter, setPage, refetch,
    }),
    [
      reviews, isFetching, error, page, totalPages, totalElements,
      search, typeFilter, statusFilter,
      setSearch, setTypeFilter, setStatusFilter, setPage, refetch,
    ],
  );

  return (
    <ClientProfilesContext.Provider value={value}>
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
