export const PROFILE_REVIEW_TYPE = {
  ONBOARDING: "ONBOARDING",
  PROFILE_UPDATE: "PROFILE_UPDATE",
} as const;

export type ProfileReviewType = (typeof PROFILE_REVIEW_TYPE)[keyof typeof PROFILE_REVIEW_TYPE];

export const PROFILE_REVIEW_STATUS = {
  SUBMITTED: "SUBMITTED",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
} as const;

export type ProfileReviewStatus = (typeof PROFILE_REVIEW_STATUS)[keyof typeof PROFILE_REVIEW_STATUS];

export interface ClientProfileReviewListItem {
  id: string;
  clientId: string;
  clientName: string;
  type: ProfileReviewType;
  status: ProfileReviewStatus;
  submittedBy: string;
  submittedAt: string;
}

export interface ProfileReviewPageResponse {
  content: ClientProfileReviewListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ProfileReviewFilters {
  page?: number;
  size?: number;
  search?: string;
  type?: ProfileReviewType;
  status?: ProfileReviewStatus;
}

export interface ProfileUpdateReviewResponse {
  taskId: string;
  clientId: string;
  clientName: string;
  status: ProfileReviewStatus;
  submittedBy: {
    id: string;
    name: string;
  };
  submittedAt: string;
  comment: string | null;
  changes: ChangedSection[];
}

export interface ChangedSection {
  sectionKey: string;
  current: Record<string, unknown> | null;
  submitted: Record<string, unknown>;
}
