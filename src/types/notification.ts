type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_SUBMITTED"
  | "TASK_APPROVED"
  | "TASK_REJECTED"
  | "PROFILE_SUBMITTED"
  | "PROFILE_APPROVED"
  | "PROFILE_REJECTED"
  | "CLIENT_HANDOFF"
  | "OFFBOARDING_ASSIGNED"
  | "CONSULTATION_SUBMITTED"
  | "CONSULTATION_APPROVED"
  | "CONSULTATION_REJECTED"
  | "TAX_RECORD_TASK_REQUEST_SUBMITTED"
  | "TAX_RECORD_TASK_REQUEST_APPROVED"
  | "TAX_RECORD_TASK_REQUEST_REJECTED";
type ReferenceType =
  | "TASK"
  | "TAX_RECORD_TASK"
  | "CLIENT"
  | "CLIENT_INFO"
  | "CLIENT_INFO_EDIT"
  | "CONSULTATION_LOG"
  | "TAX_RECORD_TASK_REQUEST";

export interface NotificationListItemResponse {
  id: string;
  type: NotificationType;
  referenceId: string;
  referenceType: ReferenceType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationScrollResponse {
  content: NotificationListItemResponse[];
  hasMore: boolean;
}
