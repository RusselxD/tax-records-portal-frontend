import type { DrillDownResponse, DrillDownFilters } from "../types/tax-record";
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
};
