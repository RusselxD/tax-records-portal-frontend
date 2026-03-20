import type {
  ClientOnboardingListItemResponse,
  CreateClientResponse,
  ClientPageResponse,
  ClientInfoLogsItemResponse,
  ClientAccountResponse,
  ActivateClientAccountPayload,
  ArchiveSnapshotResponse,
  ClientSummaryResponse,
  ClientStatus,
} from "../types/client";
import type {
  ClientInfoResponse,
  ClientInfoHeaderResponse,
  ClientInfoTaskResponse,
  ClientInfoSections,
  InfoSectionKey,
} from "../types/client-info";
import type { ProfileReviewPageResponse, ProfileReviewFilters, ProfileUpdateReviewResponse } from "../types/client-profile";
import type { LookupResponse } from "../types/tax-record-task";
import apiClient from "./axios-config";

// For OOS Accountants
export const oosClientAPI = {
  getMyOnboardingClients: async (): Promise<
    ClientOnboardingListItemResponse[]
  > => {
    const res = await apiClient.get("/clients/onboarding");
    return res.data;
  },

  getClientInfoTemplate: async (): Promise<ClientInfoResponse> => {
    const res = await apiClient.get("/clients/info-template");
    return res.data;
  },

  createClient: async (): Promise<CreateClientResponse> => {
    const res = await apiClient.post("/clients");
    return res.data;
  },

  updateSection: async (
    clientId: string,
    sectionKey: string,
    data: unknown,
  ): Promise<void> => {
    await apiClient.patch(`/clients/${clientId}/info/${sectionKey}`, data);
  },

  submitForReview: async (
    clientId: string,
    comment?: string,
  ): Promise<void> => {
    await apiClient.post(
      `/client-info/tasks/${clientId}/submit`,
      comment ? { comment } : undefined,
    );
  },

  deleteClient: async (clientId: string): Promise<void> => {
    await apiClient.delete(`/clients/${clientId}`);
  },
};

// Shared / Common endpoints (used across multiple roles)
export const clientAPI = {
  getClientInfoHeader: async (
    clientId: string,
  ): Promise<ClientInfoHeaderResponse> => {
    const res = await apiClient.get(`/clients/${clientId}/info`);
    return res.data;
  },

  getClientInfoSection: async <K extends InfoSectionKey>(
    clientId: string,
    sectionKey: K,
  ): Promise<ClientInfoSections[K]> => {
    const res = await apiClient.get(`/clients/${clientId}/info/${sectionKey}`);
    return res.data;
  },

  getClientInfoLogs: async (
    taskId: string,
  ): Promise<ClientInfoLogsItemResponse[]> => {
    const res = await apiClient.get(`/client-info/tasks/${taskId}/logs`);
    return res.data;
  },

  approveClientInfo: async (
    taskId: string,
    comment: string,
  ): Promise<void> => {
    await apiClient.post(`/client-info/tasks/${taskId}/approve`, { comment });
  },

  rejectClientInfo: async (
    taskId: string,
    comment: string,
  ): Promise<void> => {
    await apiClient.post(`/client-info/tasks/${taskId}/reject`, { comment });
  },

  getClientAccount: async (
    clientId: string,
  ): Promise<ClientAccountResponse | null> => {
    const res = await apiClient.get(`/users/client/${clientId}`);
    return res.data;
  },

  activateAccount: async (
    clientId: string,
    payload: ActivateClientAccountPayload,
  ): Promise<void> => {
    await apiClient.post(`/clients/${clientId}/activate`, payload);
  },

  handoffClient: async (clientId: string): Promise<void> => {
    await apiClient.post(`/clients/${clientId}/handoff`);
  },

  getArchiveSnapshot: async (
    clientId: string,
  ): Promise<ArchiveSnapshotResponse> => {
    const res = await apiClient.get(`/clients/${clientId}/archive-snapshot`);
    return res.data;
  },

  getClients: async (
    params: { page?: number; size?: number; search?: string } = {},
  ): Promise<ClientPageResponse> => {
    const query: Record<string, string | number> = {};
    if (params.page != null) query.page = params.page;
    if (params.size != null) query.size = params.size;
    if (params.search) query.search = params.search;
    const res = await apiClient.get("/clients", { params: query });
    return res.data;
  },

  getActiveClients: async (): Promise<LookupResponse[]> => {
    const res = await apiClient.get("/clients/active");
    return res.data;
  },

  getClientSummary: async (
    clientId: string,
  ): Promise<ClientSummaryResponse> => {
    const res = await apiClient.get(`/clients/${clientId}/summary`);
    return res.data;
  },

  getProfileReviews: async (filters: ProfileReviewFilters = {}): Promise<ProfileReviewPageResponse> => {
    const params: Record<string, string | number> = {};
    if (filters.page != null) params.page = filters.page;
    if (filters.size != null) params.size = filters.size;
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    const res = await apiClient.get("/client-info/tasks/reviews", { params });
    return res.data;
  },

  submitProfileUpdate: async (
    clientId: string,
    payload: ClientInfoSections & { comment?: string | null },
  ): Promise<void> => {
    await apiClient.post(`/client-info/tasks/${clientId}/submit-update`, payload);
  },

  getClientInfoTask: async (
    taskId: string,
  ): Promise<ClientInfoTaskResponse> => {
    const res = await apiClient.get(`/client-info/tasks/${taskId}`);
    return res.data;
  },

  getProfileUpdateReview: async (
    taskId: string,
  ): Promise<ProfileUpdateReviewResponse> => {
    const res = await apiClient.get(`/client-info/tasks/${taskId}/profile-update-review`);
    return res.data;
  },

  updateClientStatus: async (
    clientId: string,
    status: ClientStatus,
  ): Promise<void> => {
    await apiClient.patch(`/clients/${clientId}/status`, { status });
  },

  checkEngagementLetter: async (): Promise<{ exists: boolean }> => {
    const res = await apiClient.get("/clients/me/engagement-letter-exists");
    return res.data;
  },

  downloadEngagementLetter: async (): Promise<Blob> => {
    const res = await apiClient.get("/clients/me/engagement-letter", {
      responseType: "blob",
    });
    return res.data;
  },

  getMyClientInfoHeader: async (): Promise<ClientInfoHeaderResponse> => {
    const res = await apiClient.get("/clients/me/info");
    return res.data;
  },

  getMyClientInfoSection: async <K extends InfoSectionKey>(
    sectionKey: K,
  ): Promise<ClientInfoSections[K]> => {
    const res = await apiClient.get(`/clients/me/info/${sectionKey}`);
    return res.data;
  },
};
