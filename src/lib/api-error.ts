import { AxiosError } from "axios";
import { captureException } from "./sentry";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  captureException(err);
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string> } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

export function isNotFoundError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 404;
}

export function isRateLimitedError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 429;
}

export function isConflictError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 409;
}
