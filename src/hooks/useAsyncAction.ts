import { useState, useCallback } from "react";
import { getErrorMessage } from "../lib/api-error";

interface UseAsyncActionOptions {
  /** Default error message if extraction fails */
  fallbackError?: string;
  /** Called on successful completion */
  onSuccess?: () => void;
}

/**
 * Encapsulates the common try-catch-loading-error pattern for async actions.
 *
 * Usage:
 * ```
 * const { isLoading, error, execute } = useAsyncAction(
 *   () => api.deleteItem(id),
 *   { fallbackError: "Failed to delete.", onSuccess: () => close() }
 * );
 * ```
 */
export default function useAsyncAction(
  action: () => Promise<void>,
  options: UseAsyncActionOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await action();
      options.onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, options.fallbackError ?? "Something went wrong."));
    } finally {
      setIsLoading(false);
    }
  }, [action, options]);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, execute, clearError };
}
