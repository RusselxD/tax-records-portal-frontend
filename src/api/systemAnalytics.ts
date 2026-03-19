import apiClient from "./axios-config";
import type {
  SystemAnalyticsResponse,
  TaskCompletionTrendData,
  TaskApprovalRateData,
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

  getTaskApprovalRate: async (): Promise<TaskApprovalRateData> => {
    const res = await apiClient.get("/analytics/approval-rate");
    return res.data as TaskApprovalRateData;
  },
};
