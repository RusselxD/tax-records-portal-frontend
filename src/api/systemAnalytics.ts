import apiClient from "./axios-config";
import type {
  SystemAnalyticsResponse,
  TaskCompletionTrendData,
  TaskApprovalRateData,
  AccountantWorkloadItem,
  TasksByCategorySystemItem,
  AccountantOverviewItem,
} from "../types/analytics";

export const systemAnalyticsAPI = {
  getSystemAnalytics: async (): Promise<SystemAnalyticsResponse> => {
    const res = await apiClient.get("/analytics/system");
    return res.data as SystemAnalyticsResponse;
  },

  getTaskCompletionTrend: async (
    range: string,
  ): Promise<TaskCompletionTrendData> => {
    const res = await apiClient.get(
      `/analytics/task-completion-trend?range=${range}`,
    );
    return res.data as TaskCompletionTrendData;
  },

  getTaskApprovalRate: async (range: string): Promise<TaskApprovalRateData> => {
    const res = await apiClient.get(`/analytics/approval-rate?range=${range}`);
    return res.data as TaskApprovalRateData;
  },

  getAccountantWorkload: async (): Promise<AccountantWorkloadItem[]> => {
    const res = await apiClient.get("/analytics/accountant-workload");
    return res.data as AccountantWorkloadItem[];
  },

  getTasksByCategory: async (): Promise<TasksByCategorySystemItem[]> => {
    const res = await apiClient.get("/analytics/tasks-by-category");
    return res.data as TasksByCategorySystemItem[];
  },

  getAccountantOverview: async (): Promise<AccountantOverviewItem[]> => {
    const res = await apiClient.get("/analytics/accountant-overview");
    return res.data as AccountantOverviewItem[];
  },
};
