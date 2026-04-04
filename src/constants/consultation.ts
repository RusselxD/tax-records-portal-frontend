import type { ConsultationStatus, BillableType } from "../types/consultation";

export const statusLabels: Record<ConsultationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const statusStyles: Record<ConsultationStatus, string> = {
  DRAFT: "bg-gray-50 text-gray-600 border border-gray-200",
  SUBMITTED: "bg-amber-50 text-amber-600 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
};

export const billableLabels: Record<BillableType, string> = {
  INCLUDED: "Included",
  EXCESS: "Billable",
  COURTESY: "Courtesy",
};

export const billableStyles: Record<BillableType, string> = {
  INCLUDED: "bg-blue-50 text-blue-600 border border-blue-200",
  EXCESS: "bg-orange-50 text-orange-600 border border-orange-200",
  COURTESY: "bg-violet-50 text-violet-600 border border-violet-200",
};
