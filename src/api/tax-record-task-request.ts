import apiClient from "./axios-config";
import { buildParams } from "./api-utils";
import type {
  TaxRecordTaskRequestPageResponse,
  TaxRecordTaskRequestDetailResponse,
  TaxRecordTaskRequestFilters,
  CreateTaxRecordTaskRequestPayload,
  CreateTaxRecordTaskRequestResponse,
  ApproveTaxRecordTaskRequestPayload,
  ApproveTaxRecordTaskRequestResponse,
  RejectTaxRecordTaskRequestPayload,
} from "../types/tax-record-task-request";

export const taxRecordTaskRequestAPI = {
  list: async (
    filters: TaxRecordTaskRequestFilters = {},
  ): Promise<TaxRecordTaskRequestPageResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get("/tax-record-task-requests", { params });
    return res.data;
  },

  get: async (id: string): Promise<TaxRecordTaskRequestDetailResponse> => {
    const res = await apiClient.get(`/tax-record-task-requests/${id}`);
    return res.data;
  },

  create: async (
    payload: CreateTaxRecordTaskRequestPayload,
  ): Promise<CreateTaxRecordTaskRequestResponse> => {
    const res = await apiClient.post("/tax-record-task-requests", payload);
    return res.data;
  },

  approve: async (
    id: string,
    payload: ApproveTaxRecordTaskRequestPayload,
  ): Promise<ApproveTaxRecordTaskRequestResponse> => {
    const res = await apiClient.post(
      `/tax-record-task-requests/${id}/approve`,
      payload,
    );
    return res.data;
  },

  reject: async (
    id: string,
    payload: RejectTaxRecordTaskRequestPayload,
  ): Promise<void> => {
    await apiClient.post(`/tax-record-task-requests/${id}/reject`, payload);
  },
};
