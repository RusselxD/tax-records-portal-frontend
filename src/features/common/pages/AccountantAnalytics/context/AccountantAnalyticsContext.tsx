import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { accountantAnalyticsAPI } from "../../../../../api/accountantAnalytics";
import { getErrorMessage } from "../../../../../lib/api-error";
import type {
  TaskSummaryResponse,
  OnTimeRateResponse,
  QualityMetricsResponse,
  TasksByCategoryResponse,
  OnboardingPipelineResponse,
} from "../../../../../types/analytics";

export interface WidgetState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useWidgetFetch<T>(apiFn: () => Promise<T>) {
  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;

  const [state, setState] = useState<WidgetState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await apiFnRef.current();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (err) {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: getErrorMessage(err, "Failed to load. Please try again."),
          });
      }
    })();

    return () => { cancelled = true; };
  }, [version]);

  return { ...state, retry };
}

interface AccountantAnalyticsContextValue {
  taskSummary: WidgetState<TaskSummaryResponse> & { retry: () => void };
  onTimeRate: WidgetState<OnTimeRateResponse> & { retry: () => void };
  qualityMetrics: WidgetState<QualityMetricsResponse> & { retry: () => void };
  byCategory: WidgetState<TasksByCategoryResponse> & { retry: () => void };
  pipeline: WidgetState<OnboardingPipelineResponse> & { retry: () => void };
}

const AccountantAnalyticsContext =
  createContext<AccountantAnalyticsContextValue | null>(null);

export function AccountantAnalyticsProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string;
}) {
  const taskSummary = useWidgetFetch(
    userId
      ? () => accountantAnalyticsAPI.getUserTaskSummary(userId)
      : accountantAnalyticsAPI.getTaskSummary,
  );
  const onTimeRate = useWidgetFetch(
    userId
      ? () => accountantAnalyticsAPI.getUserOnTimeRate(userId)
      : accountantAnalyticsAPI.getOnTimeRate,
  );
  const qualityMetrics = useWidgetFetch(
    userId
      ? () => accountantAnalyticsAPI.getUserQualityMetrics(userId)
      : accountantAnalyticsAPI.getQualityMetrics,
  );
  const byCategory = useWidgetFetch(
    userId
      ? () => accountantAnalyticsAPI.getUserTasksByCategory(userId)
      : accountantAnalyticsAPI.getTasksByCategory,
  );
  const pipeline = useWidgetFetch(
    userId
      ? () => accountantAnalyticsAPI.getUserOnboardingPipeline(userId)
      : accountantAnalyticsAPI.getOnboardingPipeline,
  );

  return (
    <AccountantAnalyticsContext.Provider
      value={{ taskSummary, onTimeRate, qualityMetrics, byCategory, pipeline }}
    >
      {children}
    </AccountantAnalyticsContext.Provider>
  );
}

export function useAccountantAnalytics() {
  const ctx = useContext(AccountantAnalyticsContext);
  if (!ctx)
    throw new Error(
      "useAccountantAnalytics must be used within AccountantAnalyticsProvider",
    );
  return ctx;
}
