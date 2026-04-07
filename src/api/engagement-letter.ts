import type {
  EndOfEngagementLetterTemplateSummary,
  EndOfEngagementLetterTemplate,
} from "../types/client";
import type { RichTextContent } from "../types/client-info";
import apiClient from "./axios-config";

export const engagementLetterAPI = {
  // ── Templates ──

  getTemplates: async (): Promise<EndOfEngagementLetterTemplateSummary[]> => {
    const res = await apiClient.get("/end-of-engagement-letter-templates");
    return res.data;
  },

  getTemplate: async (id: string): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.get(`/end-of-engagement-letter-templates/${id}`);
    return res.data;
  },

  createTemplate: async (
    payload: { name: string; body: RichTextContent },
  ): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.post("/end-of-engagement-letter-templates", payload);
    return res.data;
  },

  updateTemplate: async (
    id: string,
    payload: { name: string; body: RichTextContent },
  ): Promise<EndOfEngagementLetterTemplate> => {
    const res = await apiClient.put(`/end-of-engagement-letter-templates/${id}`, payload);
    return res.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/end-of-engagement-letter-templates/${id}`);
  },

  // ── Send ──

  send: async (clientId: string, templateId: string): Promise<void> => {
    await apiClient.post(`/clients/${clientId}/send-end-of-engagement-letter`, { templateId });
  },

  // ── Client-facing ──

  checkExists: async (): Promise<{ exists: boolean }> => {
    const res = await apiClient.get("/clients/me/engagement-letter-exists");
    return res.data;
  },

  getMyLetters: async (): Promise<{ id: string; name: string }[]> => {
    const res = await apiClient.get("/clients/me/engagement-letters");
    return res.data;
  },
};
