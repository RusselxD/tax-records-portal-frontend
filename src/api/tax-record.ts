import type {
  DrillDownResponse,
  DrillDownFilters,
  BulkDownloadRequest,
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

  bulkDownload: async (body: BulkDownloadRequest): Promise<Blob> => {
    const res = await apiClient.post("/tax-records/me/bulk-download", body, {
      responseType: "blob",
    });
    return res.data;
  },

  clientBulkDownload: async (clientId: string, body: BulkDownloadRequest): Promise<Blob> => {
    const res = await apiClient.post(`/tax-records/${clientId}/bulk-download`, body, {
      responseType: "blob",
    });
    return res.data;
  },
};
