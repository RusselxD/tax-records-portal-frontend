import apiClient from "./axios-config";
import type {
  PageResponse,
  BillingClientListItemResponse,
  InvoiceListItemResponse,
  InvoiceDetailResponse,
  InvoiceTermResponse,
  InvoicePaymentResponse,
  CreateInvoicePayload,
  CreateTermPayload,
  ClientOutstandingInvoice,
  ClientInvoiceListItem,
} from "../types/invoice";

export const invoiceAPI = {
  // ── Billing clients list ──

  getBillingClients: async (
    params: { search?: string; page?: number; size?: number },
  ): Promise<PageResponse<BillingClientListItemResponse>> => {
    const res = await apiClient.get("/invoices/clients", { params });
    return res.data;
  },

  // ── Invoice list ──

  getInvoices: async (
    params: { clientId?: string; page?: number; size?: number },
  ): Promise<PageResponse<InvoiceListItemResponse>> => {
    const res = await apiClient.get("/invoices", { params });
    return res.data;
  },

  // ── Invoice detail ──

  getInvoice: async (id: string): Promise<InvoiceDetailResponse> => {
    const res = await apiClient.get(`/invoices/${id}`);
    return res.data;
  },

  // ── Invoice terms ──

  getTerms: async (): Promise<InvoiceTermResponse[]> => {
    const res = await apiClient.get("/invoice-terms");
    return res.data;
  },

  createTerm: async (payload: CreateTermPayload): Promise<InvoiceTermResponse> => {
    const res = await apiClient.post("/invoice-terms", payload);
    return res.data;
  },

  // ── Create / Delete / Void ──

  createInvoice: async (payload: CreateInvoicePayload): Promise<InvoiceDetailResponse> => {
    const res = await apiClient.post("/invoices", payload);
    return res.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },

  voidInvoice: async (id: string): Promise<void> => {
    await apiClient.patch(`/invoices/${id}/void`);
  },

  // ── Payments ──

  receivePayment: async (
    invoiceId: string,
    payload: { date: string; amount: number; attachments?: { id: string; name: string }[] },
  ): Promise<InvoicePaymentResponse> => {
    const res = await apiClient.post(`/invoices/${invoiceId}/payments`, payload);
    return res.data;
  },

  sendEmail: async (id: string): Promise<void> => {
    await apiClient.post(`/invoices/${id}/send-email`);
  },

  sendPaymentEmail: async (invoiceId: string, paymentId: string): Promise<void> => {
    await apiClient.post(`/invoices/${invoiceId}/payments/${paymentId}/send-email`);
  },

  // ── Client-facing ──

  getMyOutstanding: async (): Promise<ClientOutstandingInvoice[]> => {
    const res = await apiClient.get("/invoices/me/outstanding");
    return res.data;
  },

  getMyInvoices: async (
    params: { page?: number; size?: number },
  ): Promise<PageResponse<ClientInvoiceListItem>> => {
    const res = await apiClient.get("/invoices/me", { params });
    return res.data;
  },

  getMyInvoice: async (id: string): Promise<InvoiceDetailResponse> => {
    const res = await apiClient.get(`/invoices/me/${id}`);
    return res.data;
  },
};
