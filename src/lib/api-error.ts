import { AxiosError } from "axios";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
}

export function isNotFoundError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 404;
}
