import type { TaxRecordTaskStatus } from "../types/tax-record-task";

export const statusLabels: Record<TaxRecordTaskStatus, string> = {
  OPEN: "Open",
  SUBMITTED: "Submitted",
  REJECTED: "Rejected",
  APPROVED_FOR_FILING: "Approved for Filing",
  FILED: "Filed",
  COMPLETED: "Completed",
};

export const statusStyles: Record<TaxRecordTaskStatus, string> = {
  OPEN: "bg-blue-50 text-blue-600 border border-blue-200",
  SUBMITTED: "bg-amber-50 text-amber-600 border border-amber-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
  APPROVED_FOR_FILING: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  FILED: "bg-purple-50 text-purple-600 border border-purple-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

export const statusDotColors: Record<TaxRecordTaskStatus, string> = {
  OPEN: "bg-blue-500",
  SUBMITTED: "bg-amber-500",
  REJECTED: "bg-red-500",
  APPROVED_FOR_FILING: "bg-indigo-500",
  FILED: "bg-purple-500",
  COMPLETED: "bg-emerald-500",
};

export const rowBgColors: Record<TaxRecordTaskStatus, string> = {
  OPEN: "",
  SUBMITTED: "bg-amber-50/40",
  REJECTED: "bg-red-50/40",
  APPROVED_FOR_FILING: "bg-indigo-50/40",
  FILED: "bg-purple-50/40",
  COMPLETED: "bg-emerald-50/40",
};

export const periodLabels: Record<string, string> = {
  JAN: "January",
  FEB: "February",
  MAR: "March",
  APR: "April",
  MAY: "May",
  JUN: "June",
  JUL: "July",
  AUG: "August",
  SEP: "September",
  OCT: "October",
  NOV: "November",
  DEC: "December",
  Q1: "Q1",
  Q2: "Q2",
  Q3: "Q3",
  Q4: "Q4",
  ANNUALLY: "Annually",
};
