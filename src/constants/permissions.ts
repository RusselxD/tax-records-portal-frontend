/**
 * Permission key constants matching backend RolePermissionSeeder
 */
export const Permission = {
  // User management
  USER_CREATE: "user.create",
  USER_VIEW_ALL: "user.view.all",
  USER_DEACTIVATE: "user.deactivate",

  // Client
  CLIENT_CREATE: "client.create",
  CLIENT_VIEW_OWN: "client.view.own",
  CLIENT_VIEW_ALL: "client.view.all",
  CLIENT_VIEW_ARCHIVED: "client.view.archived",
  CLIENT_ASSIGN: "client.assign",
  CLIENT_REASSIGN: "client.reassign",
  CLIENT_MANAGE: "client.manage",

  // Client info
  CLIENT_INFO_CREATE: "client_info.create",
  CLIENT_INFO_EDIT: "client_info.edit",
  CLIENT_INFO_REVIEW: "client_info.review",
  CLIENT_INFO_VIEW_OWN: "client_info.view.own",
  CLIENT_INFO_VIEW_ALL: "client_info.view.all",
  CLIENT_INFO_TEMPLATE_MANAGE: "client_info_template.manage",

  // Tax records
  TAX_RECORDS_VIEW_OWN: "tax_records.view.own",
  TAX_RECORDS_VIEW_ALL: "tax_records.view.all",

  // Tasks
  TASK_CREATE: "task.create",
  TASK_VIEW_OWN: "task.view.own",
  TASK_VIEW_ALL: "task.view.all",
  TASK_EXECUTE: "task.execute",
  TASK_REVIEW: "task.review",
  TASK_TYPE_CREATE: "task_type.create",
  TASK_GROUP_TITLE_MANAGE: "task_group_title.manage",

  // Client dashboard
  CLIENT_NOTICE_MANAGE: "client_notice.manage",
  BILLING_MANAGE: "billing.manage",
  BILLING_VIEW_OWN: "billing.view.own",
  DOCUMENT_UPLOAD: "document.upload",
  REMINDER_CREATE: "reminder.create",

  // Notifications & analytics
  NOTIFICATION_RECEIVE: "notification.receive",
  ANALYTICS_VIEW_OWN: "analytics.view.own",
  ANALYTICS_VIEW_ALL: "analytics.view.all",
  ANALYTICS_SYSTEM_VIEW: "analytics.system.view",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  permissions: string[] | undefined,
  permission: PermissionKey,
): boolean {
  return permissions?.includes(permission) ?? false;
}
