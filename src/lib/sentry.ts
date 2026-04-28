import * as Sentry from "@sentry/react";
import { AxiosError } from "axios";

const IGNORED_MESSAGES = [
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications",
  "Non-Error promise rejection captured",
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "ChunkLoadError",
];

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? "development",
    enabled: import.meta.env.PROD,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    ignoreErrors: IGNORED_MESSAGES,
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],
    beforeSend(event, hint) {
      const err = hint.originalException;
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        // Drop expected 4xx — these are user/business errors, not bugs
        if (status && status >= 400 && status < 500 && status !== 408) return null;
        // Drop client-side connectivity failures (offline, blocked, DNS)
        if (err.code === "ERR_NETWORK" || err.code === "ERR_CANCELED") return null;
      }
      return event;
    },
  });
}

export function setSentryUser(user: { id: string; email: string } | null) {
  if (user) Sentry.setUser({ id: user.id, email: user.email });
  else Sentry.setUser(null);
}

export function captureException(err: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(err, context ? { extra: context } : undefined);
}
