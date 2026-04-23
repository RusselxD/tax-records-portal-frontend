import type { TaxRecordTaskRequestStatus } from "../types/tax-record-task-request";

export const requestStatusLabels: Record<TaxRecordTaskRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const requestStatusStyles: Record<TaxRecordTaskRequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

export const requestStatusDotColors: Record<TaxRecordTaskRequestStatus, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
};
