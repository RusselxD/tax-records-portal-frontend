import { AxiosError } from "axios";
import { captureException } from "./sentry";

const GENERIC_FALLBACK = "Something went wrong. Please try again.";

function isNoiseError(err: AxiosError): boolean {
  const status = err.response?.status;
  if (status && status >= 400 && status < 500 && status !== 408) return true;
  if (err.code === "ERR_NETWORK" || err.code === "ERR_CANCELED") return true;
  return false;
}

function isTimeout(err: AxiosError): boolean {
  return err.code === "ECONNABORTED" || err.code === "ETIMEDOUT" || err.message?.includes("timeout");
}

export function getErrorMessage(err: unknown, fallback = GENERIC_FALLBACK): string {
  if (err instanceof AxiosError) {
    if (!isNoiseError(err)) captureException(err);

    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;

    const status = err.response?.status;
    if (status && status >= 500) return "The server ran into a problem. Please try again in a moment.";
    if (isTimeout(err)) return "The request took too long. Check your connection and try again.";
    if (err.code === "ERR_NETWORK") return "Couldn't reach the server. Check your connection and try again.";
    return fallback;
  }

  captureException(err);
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
