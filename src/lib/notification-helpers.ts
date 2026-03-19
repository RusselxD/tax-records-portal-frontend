import type { NotificationListItemResponse } from "../types/notification";
import { UserRole, roleDashboardMap, type UserRoleType } from "../constants/roles";

function getRoleBasePath(role: UserRoleType): string {
  const dashboard = roleDashboardMap[role];
  return dashboard.replace("/dashboard", "");
}

const ROLES_WITH_ONBOARDING_PREVIEW = new Set<string>([
  UserRole.OOS,
  UserRole.QTD,
  UserRole.MANAGER,
]);

export function getNotificationHref(
  notification: NotificationListItemResponse,
  role: UserRoleType,
): string | null {
  const basePath = getRoleBasePath(role);

  switch (notification.referenceType) {
    case "CLIENT":
    case "CLIENT_INFO": {
      // Handoff means the client is now active — go to details, not preview
      const route =
        notification.type === "CLIENT_HANDOFF"
          ? "client-details"
          : ROLES_WITH_ONBOARDING_PREVIEW.has(role)
            ? "client-preview"
            : "client-details";
      return `${basePath}/${route}/${notification.referenceId}`;
    }
    case "CLIENT_INFO_EDIT":
      return `${basePath}/profile-update-review/${notification.referenceId}`;
    case "TASK":
      return `${basePath}/task-details/${notification.referenceId}`;
    case "TAX_RECORD_TASK":
      return `${basePath}/tax-record-task/${notification.referenceId}`;
    default:
      return null;
  }
}
