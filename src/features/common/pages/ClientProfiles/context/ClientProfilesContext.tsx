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
import type {
  ClientProfileReviewListItem,
  ProfileReviewFilters,
  ProfileReviewType,
  ProfileReviewStatus,
} from "../../../../../types/client-profile";

const PAGE_SIZE = 20;

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
  const [reviews, setReviews] = useState<ClientProfileReviewListItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearchState] = useState("");
  const [typeFilter, setTypeFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");

  const filters = useMemo<ProfileReviewFilters>(() => {
    const f: ProfileReviewFilters = { page, size: PAGE_SIZE };
    if (search) f.search = search;
    if (typeFilter) f.type = typeFilter as ProfileReviewType;
    if (statusFilter) f.status = statusFilter as ProfileReviewStatus;
    return f;
  }, [page, search, typeFilter, statusFilter]);

  const fetchReviews = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await clientAPI.getProfileReviews(filters);
      setReviews(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch client profiles. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const setSearch = useCallback((v: string) => { setSearchState(v); setPageState(0); }, []);
  const setTypeFilter = useCallback((v: string) => { setTypeFilterState(v); setPageState(0); }, []);
  const setStatusFilter = useCallback((v: string) => { setStatusFilterState(v); setPageState(0); }, []);
  const setPage = useCallback((p: number) => setPageState(p), []);

  const value = useMemo(
    () => ({
      reviews, isFetching, error, page, totalPages, totalElements,
      search, typeFilter, statusFilter,
      setSearch, setTypeFilter, setStatusFilter, setPage, refetch: fetchReviews,
    }),
    [
      reviews, isFetching, error, page, totalPages, totalElements,
      search, typeFilter, statusFilter,
      setSearch, setTypeFilter, setStatusFilter, setPage, fetchReviews,
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
