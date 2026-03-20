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

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiFnRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: getErrorMessage(err, "Failed to load. Please try again."),
      });
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, retry: fetch };
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
}: {
  children: ReactNode;
}) {
  const taskSummary = useWidgetFetch(accountantAnalyticsAPI.getTaskSummary);
  const onTimeRate = useWidgetFetch(accountantAnalyticsAPI.getOnTimeRate);
  const qualityMetrics = useWidgetFetch(
    accountantAnalyticsAPI.getQualityMetrics,
  );
  const byCategory = useWidgetFetch(accountantAnalyticsAPI.getTasksByCategory);
  const pipeline = useWidgetFetch(accountantAnalyticsAPI.getOnboardingPipeline);

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
