// ── Shared pagination wrapper ──

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ── Invoice status ──

export type InvoiceStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID" | "VOID";

export const INVOICE_STATUS = {
  UNPAID: "UNPAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  FULLY_PAID: "FULLY_PAID",
  VOID: "VOID",
} as const;

// ── Invoice terms ──

export interface InvoiceTermResponse {
  id: number;
  name: string;
  days: number;
}

// ── Billing clients list (Page 1) ──

export interface BillingClientListItemResponse {
  clientId: string;
  clientName: string;
  totalInvoices: number;
  unpaidInvoices: number;
  partiallyPaidInvoices: number;
  fullyPaidInvoices: number;
  totalAmountDue: number;
  totalBalance: number;
}

// ── Invoice list (Page 2) ──

export interface InvoiceListItemResponse {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  termsName: string;
  dueDate: string;
  description: string | null;
  amountDue: number;
  balance: number;
  status: InvoiceStatus;
  emailSent: boolean;
  hasEmailRecipients: boolean;
}

// ── Invoice detail (Page 3) ──

export interface FileItemResponse {
  id: string;
  name: string;
}

export interface InvoicePaymentResponse {
  id: string;
  date: string;
  amount: number;
  attachments: FileItemResponse[];
  emailSent: boolean;
}

export interface InvoiceDetailResponse {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  terms: InvoiceTermResponse;
  dueDate: string;
  description: string | null;
  amountDue: number;
  balance: number;
  status: InvoiceStatus;
  emailSent: boolean;
  hasEmailRecipients: boolean;
  attachments: FileItemResponse[];
  payments: InvoicePaymentResponse[];
}

// ── Payloads ──

export interface CreateInvoicePayload {
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  termsId: number;
  description?: string;
  amountDue: number;
  attachments?: FileItemResponse[];
}

export interface CreateTermPayload {
  name: string;
  days: number;
}

// ── Client-facing ──

export interface ClientOutstandingInvoice {
  id: string;
  invoiceNumber: string;
  dueDate: string;
  amountDue: number;
  balance: number;
  status: "UNPAID" | "PARTIALLY_PAID";
}

export interface ClientInvoiceListItem {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  description: string | null;
  amountDue: number;
  balance: number;
  status: InvoiceStatus;
  isOverdue: boolean;
}
