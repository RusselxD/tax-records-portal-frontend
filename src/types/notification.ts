type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_SUBMITTED"
  | "TASK_APPROVED"
  | "TASK_REJECTED"
  | "PROFILE_SUBMITTED"
  | "PROFILE_APPROVED"
  | "PROFILE_REJECTED"
  | "CLIENT_HANDOFF";
type ReferenceType = "TASK" | "TAX_RECORD_TASK" | "CLIENT" | "CLIENT_INFO" | "CLIENT_INFO_EDIT";

export interface UnreadNotificationsCountResponse{
  unread: number;
}

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
