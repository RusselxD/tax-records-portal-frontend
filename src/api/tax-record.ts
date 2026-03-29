import type {
  DrillDownResponse,
  DrillDownFilters,
  RecentTaxRecordRange,
  RecentTaxRecordEntryResponse,
  ImportantDateResponse,
} from "../types/tax-record";
import apiClient from "./axios-config";
import { buildParams } from "./api-utils";

export const taxRecordAPI = {
  drillDown: async (filters: DrillDownFilters = {}): Promise<DrillDownResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get("/tax-records/me/drill-down", { params });
    return res.data;
  },

  clientDrillDown: async (clientId: string, filters: DrillDownFilters = {}): Promise<DrillDownResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get(`/tax-records/client/${clientId}/drill-down`, { params });
    return res.data;
  },

  getRecentEntries: async (
    range: RecentTaxRecordRange = "7d"
  ): Promise<RecentTaxRecordEntryResponse[]> => {
    const res = await apiClient.get("/tax-records/me/recent", {
      params: { range },
    });
    return res.data;
  },

  getImportantDates: async (): Promise<ImportantDateResponse[]> => {
    const res = await apiClient.get("/tax-records/me/important-dates");
    return res.data;
  },

};
