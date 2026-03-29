import type {
  ConsultationLogPageResponse,
  ConsultationLogFilters,
  ConsultationLogDetail,
  ConsultationLogAuditListItem,
  CreateConsultationLogRequest,
  UpdateConsultationLogRequest,
  ConsultationMonthlySummary,
  ConsultationConfig,
  UpsertConsultationConfigRequest,
} from "../types/consultation";
import type { RichTextContent } from "../types/client-info";
import type { LogCommentResponse } from "../types/client";
import apiClient from "./axios-config";
import { buildParams } from "./api-utils";

export const consultationAPI = {
  // ── Logs ──

  getLogs: async (filters: ConsultationLogFilters = {}): Promise<ConsultationLogPageResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get("/consultation-logs", { params });
    return res.data;
  },

  getLog: async (id: string): Promise<ConsultationLogDetail> => {
    const res = await apiClient.get(`/consultation-logs/${id}`);
    return res.data;
  },

  createLog: async (payload: CreateConsultationLogRequest): Promise<ConsultationLogDetail> => {
    const res = await apiClient.post("/consultation-logs", payload);
    return res.data;
  },

  updateLog: async (id: string, payload: UpdateConsultationLogRequest): Promise<ConsultationLogDetail> => {
    const res = await apiClient.put(`/consultation-logs/${id}`, payload);
    return res.data;
  },

  deleteLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/consultation-logs/${id}`);
  },

  submitLog: async (id: string, comment?: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/consultation-logs/${id}/submit`, comment ? { comment } : undefined);
  },

  approveLog: async (id: string, comment?: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/consultation-logs/${id}/approve`, comment ? { comment } : undefined);
  },

  rejectLog: async (id: string, comment?: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/consultation-logs/${id}/reject`, comment ? { comment } : undefined);
  },

  // ── Audits ──

  getAudits: async (logId: string): Promise<ConsultationLogAuditListItem[]> => {
    const res = await apiClient.get(`/consultation-logs/${logId}/audits`);
    return res.data;
  },

  getAuditComment: async (logId: string, auditId: string): Promise<LogCommentResponse> => {
    const res = await apiClient.get(`/consultation-logs/${logId}/audits/${auditId}/comment`);
    return res.data;
  },

  // ── Summary ──

  getClientSummary: async (clientId: string, year: number, month: number): Promise<ConsultationMonthlySummary> => {
    const res = await apiClient.get(`/consultation-logs/client/${clientId}/summary`, {
      params: { year, month },
    });
    return res.data;
  },

  getMySummary: async (): Promise<ConsultationMonthlySummary> => {
    const res = await apiClient.get("/consultation-logs/me/summary");
    return res.data;
  },

  // ── Config ──

  getConfig: async (clientId: string): Promise<ConsultationConfig> => {
    const res = await apiClient.get(`/client-consultation-configs/${clientId}`);
    return res.data;
  },

  upsertConfig: async (clientId: string, payload: UpsertConsultationConfigRequest): Promise<ConsultationConfig> => {
    const res = await apiClient.put(`/client-consultation-configs/${clientId}`, payload);
    return res.data;
  },
};
