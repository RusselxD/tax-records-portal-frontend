import type { RichTextContent } from "./client-info";

// ── Status & Billable Type ──

export const CONSULTATION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ConsultationStatus =
  (typeof CONSULTATION_STATUS)[keyof typeof CONSULTATION_STATUS];

export const BILLABLE_TYPE = {
  INCLUDED: "INCLUDED",
  EXCESS: "EXCESS",
  COURTESY: "COURTESY",
} as const;

export type BillableType =
  (typeof BILLABLE_TYPE)[keyof typeof BILLABLE_TYPE];

// ── List Item ──

export interface ConsultationLogListItem {
  id: string;
  clientId: string;
  clientDisplayName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  platform: string;
  subject: string;
  billableType: BillableType;
  status: ConsultationStatus;
  createdByName: string;
  createdAt: string;
}

export interface ConsultationLogPageResponse {
  content: ConsultationLogListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ── Filters ──

export interface ConsultationLogFilters {
  clientId?: string;
  status?: ConsultationStatus;
  billableType?: BillableType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  createdById?: string;
  page?: number;
  size?: number;
}

// ── Detail ──

export interface ConsultationLogAuditListItem {
  id: string;
  action: string;
  hasComment: boolean;
  performedByName: string;
  createdAt: string;
}

export interface ConsultationLogDetail {
  id: string;
  clientId: string;
  clientDisplayName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  platform: string;
  subject: string;
  notes: RichTextContent | null;
  billableType: BillableType;
  status: ConsultationStatus;
  attachments: { id: string; name: string }[];
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

// ── Create / Update ──

export interface CreateConsultationLogRequest {
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  subject: string;
  notes: RichTextContent | null;
  attachments: { id: string; name: string }[];
  billableType?: "COURTESY";
}

export interface UpdateConsultationLogRequest {
  clientId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  platform?: string;
  subject?: string;
  notes?: RichTextContent | null;
  attachments?: { id: string; name: string }[];
  billableType?: "COURTESY" | null;
}

// ── Monthly Summary ──

export interface ConsultationMonthlySummary {
  year: number;
  month: number;
  totalHoursConsumed: number;
  courtesyHours: number;
  billableHours: number;
  includedHours: number;
  remainingIncluded: number;
  excessHours: number;
  excessRate: number;
  estimatedExcessFee: number;
}

// ── Config ──

export interface ConsultationConfig {
  clientId: string;
  includedHours: number;
  excessRate: number;
}

export interface UpsertConsultationConfigRequest {
  includedHours: number;
  excessRate: number;
}
