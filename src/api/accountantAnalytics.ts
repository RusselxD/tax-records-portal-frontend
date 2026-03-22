import type {
  AccountantsDashboardAnalyticsResponse,
  ReviewerDashboardStatsResponse,
  TaskSummaryResponse,
  MonthlyThroughputResponse,
  OnTimeRateResponse,
  QualityMetricsResponse,
  TasksByCategoryResponse,
  OnboardingPipelineResponse,
  ClientPortfolioResponse,
} from "../types/analytics";
import apiClient from "./axios-config";

export const accountantAnalyticsAPI = {
  getDashboardAnalytics:
    async (): Promise<AccountantsDashboardAnalyticsResponse> => {
      const res = await apiClient.get("tax-record-tasks/dashboard-stats");
      return res.data as AccountantsDashboardAnalyticsResponse;
    },

  getTaskSummary: async (): Promise<TaskSummaryResponse> => {
    const res = await apiClient.get("analytics/me/task-summary");
    return res.data as TaskSummaryResponse;
  },

  getMonthlyThroughput: async (
    months: number = 6,
  ): Promise<MonthlyThroughputResponse> => {
    const res = await apiClient.get("analytics/me/monthly-throughput", {
      params: { months },
    });
    return res.data as MonthlyThroughputResponse;
  },

  getOnTimeRate: async (): Promise<OnTimeRateResponse> => {
    const res = await apiClient.get("analytics/me/on-time-rate");
    return res.data as OnTimeRateResponse;
  },

  getQualityMetrics: async (): Promise<QualityMetricsResponse> => {
    const res = await apiClient.get("analytics/me/quality-metrics");
    return res.data as QualityMetricsResponse;
  },

  getTasksByCategory: async (): Promise<TasksByCategoryResponse> => {
    const res = await apiClient.get("analytics/me/tasks-by-category");
    return res.data as TasksByCategoryResponse;
  },

  getOnboardingPipeline: async (): Promise<OnboardingPipelineResponse> => {
    const res = await apiClient.get("analytics/me/onboarding-pipeline");
    return res.data as OnboardingPipelineResponse;
  },

  getClientPortfolio: async (
    page: number = 0,
    size: number = 20,
  ): Promise<ClientPortfolioResponse> => {
    const res = await apiClient.get("analytics/me/client-portfolio", {
      params: { page, size },
    });
    return res.data as ClientPortfolioResponse;
  },

  getReviewerDashboardStats:
    async (): Promise<ReviewerDashboardStatsResponse> => {
      const res = await apiClient.get(
        "tax-record-tasks/reviewer-dashboard-stats",
      );
      return res.data as ReviewerDashboardStatsResponse;
    },

  // Manager viewing a specific accountant's analytics
  getUserTaskSummary: async (userId: string): Promise<TaskSummaryResponse> => {
    const res = await apiClient.get(`analytics/users/${userId}/task-summary`);
    return res.data as TaskSummaryResponse;
  },

  getUserMonthlyThroughput: async (
    userId: string,
    months: number = 6,
  ): Promise<MonthlyThroughputResponse> => {
    const res = await apiClient.get(
      `analytics/users/${userId}/monthly-throughput`,
      { params: { months } },
    );
    return res.data as MonthlyThroughputResponse;
  },

  getUserOnTimeRate: async (userId: string): Promise<OnTimeRateResponse> => {
    const res = await apiClient.get(`analytics/users/${userId}/on-time-rate`);
    return res.data as OnTimeRateResponse;
  },

  getUserQualityMetrics: async (
    userId: string,
  ): Promise<QualityMetricsResponse> => {
    const res = await apiClient.get(
      `analytics/users/${userId}/quality-metrics`,
    );
    return res.data as QualityMetricsResponse;
  },

  getUserTasksByCategory: async (
    userId: string,
  ): Promise<TasksByCategoryResponse> => {
    const res = await apiClient.get(
      `analytics/users/${userId}/tasks-by-category`,
    );
    return res.data as TasksByCategoryResponse;
  },

  getUserOnboardingPipeline: async (
    userId: string,
  ): Promise<OnboardingPipelineResponse> => {
    const res = await apiClient.get(
      `analytics/users/${userId}/onboarding-pipeline`,
    );
    return res.data as OnboardingPipelineResponse;
  },

  getUserClientPortfolio: async (
    userId: string,
    page: number = 0,
    size: number = 20,
  ): Promise<ClientPortfolioResponse> => {
    const res = await apiClient.get(
      `analytics/users/${userId}/client-portfolio`,
      { params: { page, size } },
    );
    return res.data as ClientPortfolioResponse;
  },
};
