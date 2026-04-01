import type {
  ClientOnboardingListItemResponse,
  ClientOffboardingListItemResponse,
  CreateClientResponse,
  ClientPageResponse,
  ClientInfoTaskLogResponse,
  LogCommentResponse,
  ClientAccountResponse,
  ActivateClientAccountPayload,
  ArchiveSnapshotResponse,
  ClientSummaryResponse,
  ClientStatus,
  CreateClientNoticeRequest,
  ClientNoticeResponse,
  OffboardClientRequest,
  EndOfEngagementLetterTemplateSummary,
  EndOfEngagementLetterTemplate,
} from "../types/client";
import type { RichTextContent } from "../types/client-info";
import type {
  ClientInfoResponse,
  ClientInfoHeaderResponse,
  ClientInfoTaskResponse,
  ClientInfoSections,
  InfoSectionKey,
} from "../types/client-info";
import type { ProfileReviewPageResponse, ProfileReviewFilters, ProfileUpdateReviewResponse } from "../types/client-profile";
import type { ClientAccountantResponse } from "../types/client";
import type { LookupResponse } from "../types/tax-record-task";
import apiClient from "./axios-config";
import { buildParams } from "./api-utils";

// For OOS Accountants
export const oosClientAPI = {
  getMyOnboardingClients: async (
    filters?: { search?: string },
  ): Promise<ClientOnboardingListItemResponse[]> => {
    const params = filters ? buildParams(filters) : undefined;
    const res = await apiClient.get("/clients/onboarding", { params });
    return res.data;
  },

  getMyOffboardingClients: async (): Promise<
    ClientOffboardingListItemResponse[]
  > => {
    const res = await apiClient.get("/clients/offboarding");
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
    comment?: RichTextContent | null,
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
  ): Promise<ClientInfoTaskLogResponse[]> => {
    const res = await apiClient.get(`/client-info/tasks/${taskId}/logs`);
    return res.data;
  },

  getClientInfoLogComment: async (
    taskId: string,
    logId: string,
  ): Promise<LogCommentResponse> => {
    const res = await apiClient.get(`/client-info/tasks/${taskId}/logs/${logId}/comment`);
    return res.data;
  },

  approveClientInfo: async (
    taskId: string,
    comment: RichTextContent | null,
  ): Promise<void> => {
    await apiClient.post(`/client-info/tasks/${taskId}/approve`, { comment });
  },

  rejectClientInfo: async (
    taskId: string,
    comment: RichTextContent | null,
  ): Promise<void> => {
    await apiClient.post(`/client-info/tasks/${taskId}/reject`, { comment });
  },

  getClientAccounts: async (
    clientId: string,
  ): Promise<ClientAccountResponse[]> => {
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
    const query = buildParams(params);
    const res = await apiClient.get("/clients", { params: query });
    return res.data;
  },

  getActiveClients: async (): Promise<LookupResponse[]> => {
    const res = await apiClient.get("/clients/active");
    return res.data;
  },

  getClientAccountants: async (
    clientId: string,
  ): Promise<ClientAccountantResponse[]> => {
    const res = await apiClient.get(`/clients/${clientId}/accountants`);
    return res.data;
  },

  getClientSummary: async (
    clientId: string,
  ): Promise<ClientSummaryResponse> => {
    const res = await apiClient.get(`/clients/${clientId}/summary`);
    return res.data;
  },

  getProfileReviews: async (filters: ProfileReviewFilters = {}): Promise<ProfileReviewPageResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get("/client-info/tasks/reviews", { params });
    return res.data;
  },

  submitProfileUpdate: async (
    clientId: string,
    payload: ClientInfoSections & { comment?: RichTextContent | null },
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

  getNotices: async (
    clientId: string,
  ): Promise<ClientNoticeResponse[]> => {
    const res = await apiClient.get(`/clients/${clientId}/notices`);
    return res.data;
  },

  createNotice: async (
    clientId: string,
    body: CreateClientNoticeRequest,
  ): Promise<ClientNoticeResponse> => {
    const res = await apiClient.post(`/clients/${clientId}/notices`, body);
    return res.data;
  },

  deleteNotice: async (
    clientId: string,
    noticeId: number,
  ): Promise<void> => {
    await apiClient.delete(`/clients/${clientId}/notices/${noticeId}`);
  },

  updateClientStatus: async (
    clientId: string,
    status: ClientStatus,
  ): Promise<void> => {
    await apiClient.patch(`/clients/${clientId}/status`, { status });
  },

  // ── Reassign accountants ──

  reassignAccountants: async (
    clientId: string,
    payload: { csdOosAccountantIds: string[]; qtdAccountantId: string | null },
  ): Promise<void> => {
    await apiClient.put(`/clients/${clientId}/assigned-accountants`, payload);
  },

  // ── Offboarding ──

  offboardClient: async (
    clientId: string,
    payload: OffboardClientRequest,
  ): Promise<void> => {
    await apiClient.post(`/clients/${clientId}/offboard`, payload);
  },

  toggleTaxRecordsProtection: async (
    clientId: string,
    protectTaxRecords: boolean,
  ): Promise<void> => {
    await apiClient.patch(`/clients/${clientId}/tax-records-protection`, { protectTaxRecords });
  },

  sendEndOfEngagementLetter: async (
    clientId: string,
    templateId: string,
  ): Promise<void> => {
    await apiClient.post(`/clients/${clientId}/send-end-of-engagement-letter`, { templateId });
  },

  // ── Engagement Letter Templates ──

  getEndOfEngagementLetterTemplates: async (): Promise<EndOfEngagementLetterTemplateSummary[]> => {
    const res = await apiClient.get("/end-of-engagement-letter-templates");
    return res.data;
  },

  getEndOfEngagementLetterTemplate: async (id: string): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.get(`/end-of-engagement-letter-templates/${id}`);
    return res.data;
  },

  createEndOfEngagementLetterTemplate: async (
    payload: { name: string; body: RichTextContent },
  ): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.post("/end-of-engagement-letter-templates", payload);
    return res.data;
  },

  updateEndOfEngagementLetterTemplate: async (
    id: string,
    payload: { name: string; body: RichTextContent },
  ): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.put(`/end-of-engagement-letter-templates/${id}`, payload);
    return res.data;
  },

  deleteEndOfEngagementLetterTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/end-of-engagement-letter-templates/${id}`);
  },

  checkEngagementLetter: async (): Promise<{ exists: boolean }> => {
    const res = await apiClient.get("/clients/me/engagement-letter-exists");
    return res.data;
  },

  getEngagementLetters: async (): Promise<{ id: string; name: string }[]> => {
    const res = await apiClient.get("/clients/me/engagement-letters");
    return res.data;
  },

  getMyNotices: async (): Promise<ClientNoticeResponse[]> => {
    const res = await apiClient.get("/clients/me/notices");
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
