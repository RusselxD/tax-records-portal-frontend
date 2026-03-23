import type {
  MainDetails,
  ClientInformation,
  CorporateOfficerInformation,
  AccessCredentialDetails,
  ScopeOfEngagementDetails,
  ProfessionalFeeEntry,
  OnboardingDetails,
  AssignedAccountant,
} from "./client-info";

export const CLIENT_STATUS = {
  ONBOARDING: "ONBOARDING",
  ACTIVE_CLIENT: "ACTIVE_CLIENT",
  OFFBOARDING: "OFFBOARDING",
  INACTIVE_CLIENT: "INACTIVE_CLIENT",
} as const;

export type ClientStatus = (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];

export interface ClientOnboardingListItemResponse {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  handedOff: boolean;
  hasActiveTask: boolean;
  activeTaskId: string | null;
  lastTaskId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListItemResponse {
  id: string;
  clientName: string;
  accountants: string[];
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  nearestDeadline: string | null;
  status: ClientStatus;
}

export interface ClientPageResponse {
  content: ClientListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

type ClientInfoLogAction = "SUBMITTED" | "REJECTED" | "RESUBMITTED" | "APPROVED";

export interface ClientInfoLogsItemResponse {
  performedBy: string;
  action: ClientInfoLogAction;
  comment: string | null;
  createdAt: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface CreateClientResponse {
  id: string;
}

export type ClientPortalAccountStatus = "PENDING" | "ACTIVE" | "DEACTIVATED";

export interface ClientAccountResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string | null;
  status: ClientPortalAccountStatus;
}

export interface ActivateClientAccountPayload {
  firstName: string;
  lastName: string;
  email: string;
}

// Handoff endpoint has no request body — accountants are assigned via mainDetails PATCH

export interface ArchiveSnapshotResponse {
  clientDisplayName: string | null;
  taxpayerClassification: string | null;
  assignedCsdOosAccountants: AssignedAccountant[];
  assignedQtdAccountants: AssignedAccountant[];
  submittedAt: string;
  mainDetails: MainDetails;
  clientInformation: ClientInformation;
  corporateOfficerInformation: CorporateOfficerInformation;
  accessCredentials: AccessCredentialDetails[];
  scopeOfEngagement: ScopeOfEngagementDetails;
  professionalFees: ProfessionalFeeEntry[];
  onboardingDetails: OnboardingDetails;
}

export const NOTICE_TYPE = {
  REMINDER: "REMINDER",
  PENDING_DOCUMENT: "PENDING_DOCUMENT",
  HIGHLIGHT: "HIGHLIGHT",
} as const;

export type NoticeType = (typeof NOTICE_TYPE)[keyof typeof NOTICE_TYPE];

export interface CreateClientNoticeRequest {
  type: NoticeType;
  content: string;
}

export interface ClientNoticeResponse {
  id: number;
  type: NoticeType;
  content: string;
}

export interface ClientSummaryResponse {
  id: string;
  name: string;
  status: ClientStatus;
  mreCode: string | null;
  taxpayerClassification: string | null;
  assignedCsdOosAccountants: string[];
  assignedQtdAccountants: string[];
}
