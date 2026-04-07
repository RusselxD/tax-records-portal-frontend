import type { ClientNoticeResponse } from "../types/client";
import type {
  ClientInfoHeaderResponse,
  ClientInfoSections,
  InfoSectionKey,
} from "../types/client-info";
import apiClient from "./axios-config";

export const clientMeAPI = {
  getNotices: async (): Promise<ClientNoticeResponse[]> => {
    const res = await apiClient.get("/clients/me/notices");
    return res.data;
  },

  getInfoHeader: async (): Promise<ClientInfoHeaderResponse> => {
    const res = await apiClient.get("/clients/me/info");
    return res.data;
  },

  getInfoSection: async <K extends InfoSectionKey>(
    sectionKey: K,
  ): Promise<ClientInfoSections[K]> => {
    const res = await apiClient.get(`/clients/me/info/${sectionKey}`);
    return res.data;
  },

  getAccountants: async (): Promise<{ id: string; name: string; email: string; position: string }[]> => {
    const res = await apiClient.get("/clients/me/accountants");
    return res.data;
  },

  getBillingContacts: async (): Promise<{ id: string; name: string; email: string }[]> => {
    const res = await apiClient.get("/clients/me/billing-contacts");
    return res.data;
  },
};
