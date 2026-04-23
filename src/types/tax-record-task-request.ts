import type { Period } from "./tax-record-task";

export const TAX_RECORD_TASK_REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TaxRecordTaskRequestStatus =
  (typeof TAX_RECORD_TASK_REQUEST_STATUS)[keyof typeof TAX_RECORD_TASK_REQUEST_STATUS];

export interface TaxRecordTaskRequestListItem {
  id: string;
  status: TaxRecordTaskRequestStatus;
  clientId: string;
  clientDisplayName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  requester: { id: string; name: string };
  submittedAt: string;
  decidedAt: string | null;
  resultingTaskId: string | null;
}

export interface TaxRecordTaskRequestPageResponse {
  content: TaxRecordTaskRequestListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TaxRecordTaskRequestDetailResponse {
  id: string;
  status: TaxRecordTaskRequestStatus;
  notes: string | null;
  rejectionReason: string | null;
  clientId: string;
  clientDisplayName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  taskNameId: number;
  taskName: string;
  year: number;
  period: Period;
  requester: { id: string; name: string };
  submittedAt: string;
  decidedAt: string | null;
  decidedBy: { id: string; name: string } | null;
  resultingTaskId: string | null;
}

export interface CreateTaxRecordTaskRequestPayload {
  clientId: string;
  categoryId: number;
  subCategoryId: number;
  taskNameId: number;
  year: number;
  period: Period;
  notes: string | null;
}

export interface CreateTaxRecordTaskRequestResponse {
  id: string;
}

export interface ApproveTaxRecordTaskRequestPayload {
  deadline: string;
  assignedToIds?: string[];
}

export type ApproveTaxRecordTaskRequestResponse = TaxRecordTaskRequestDetailResponse;

export interface RejectTaxRecordTaskRequestPayload {
  reason?: string;
}

export interface TaxRecordTaskRequestFilters {
  page?: number;
  size?: number;
  status?: TaxRecordTaskRequestStatus;
  clientId?: string;
  requesterId?: string;
}
