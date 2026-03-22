import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getErrorMessage } from "../lib/api-error";

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

interface UsePaginatedFetchResult<T> {
  items: T[];
  isFetching: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

/**
 * Generic hook for paginated API fetches.
 *
 * @param fetchFn - API function that accepts params and returns a paged response
 * @param params - Filter/search params (excluding page/size). When these change, page resets to 0.
 * @param pageSize - Items per page (default 20)
 * @param errorMessage - Fallback error message
 */
export default function usePaginatedFetch<T, P extends Record<string, unknown>>(
  fetchFn: (params: P & { page: number; size: number }) => Promise<PagedResponse<T>>,
  params: P,
  pageSize = 20,
  errorMessage = "Failed to fetch data. Try again.",
): UsePaginatedFetchResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [version, setVersion] = useState(0);

  // Track previous params to reset page on filter change
  const paramsKey = JSON.stringify(params);
  const prevParamsKey = useRef(paramsKey);

  // When filters change, reset to page 0 synchronously before building fullParams
  const effectivePage = paramsKey !== prevParamsKey.current ? 0 : page;

  // Sync the ref and state after render
  useEffect(() => {
    if (paramsKey !== prevParamsKey.current) {
      prevParamsKey.current = paramsKey;
      setPageState(0);
    }
  }, [paramsKey]);

  const fullParams = useMemo(
    () => ({ ...params, page: effectivePage, size: pageSize }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramsKey, effectivePage, pageSize],
  );

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchFn(fullParams);
        if (cancelled) return;
        setItems(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, errorMessage));
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => { cancelled = true; };
  }, [fetchFn, fullParams, errorMessage, version]);

  const setPage = useCallback((p: number) => setPageState(p), []);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { items, isFetching, error, page: effectivePage, totalPages, totalElements, setPage, refetch };
}
