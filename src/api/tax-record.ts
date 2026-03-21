import type {
  DrillDownResponse,
  DrillDownFilters,
  RecentTaxRecordRange,
  RecentTaxRecordEntryResponse,
  ImportantDateResponse,
} from "../types/tax-record";
import apiClient from "./axios-config";

export const taxRecordAPI = {
  drillDown: async (filters: DrillDownFilters = {}): Promise<DrillDownResponse> => {
    const params: Record<string, string | number> = {};

    if (filters.categoryId != null) params.categoryId = filters.categoryId;
    if (filters.subCategoryId != null) params.subCategoryId = filters.subCategoryId;
    if (filters.taskNameId != null) params.taskNameId = filters.taskNameId;
    if (filters.year != null) params.year = filters.year;
    if (filters.period) params.period = filters.period;

    const res = await apiClient.get("/tax-records/me/drill-down", { params });
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
