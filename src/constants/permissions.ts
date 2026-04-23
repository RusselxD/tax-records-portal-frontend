/**
 * Permission key constants matching backend RolePermissionSeeder.
 * 35 active permissions — keep in sync with backend seeder.
 */
export const Permission = {
  // User management
  USER_CREATE: "user.create",
  USER_VIEW_ALL: "user.view.all",

  // Client
  CLIENT_CREATE: "client.create",
  CLIENT_VIEW_OWN: "client.view.own",
  CLIENT_VIEW_ALL: "client.view.all",
  CLIENT_ASSIGN: "client.assign",
  CLIENT_REASSIGN: "client.reassign",
  CLIENT_MANAGE: "client.manage",

  // Client info
  CLIENT_INFO_CREATE: "client_info.create",
  CLIENT_INFO_EDIT: "client_info.edit",
  CLIENT_INFO_REVIEW: "client_info.review",
  CLIENT_INFO_VIEW_OWN: "client_info.view.own",
  CLIENT_INFO_VIEW_ALL: "client_info.view.all",

  // Tax records
  TAX_RECORDS_VIEW_OWN: "tax_records.view.own",
  TAX_RECORDS_VIEW_ALL: "tax_records.view.all",
  TAX_RECORDS_OVERRIDE: "tax_records.override",

  // Tasks
  TASK_CREATE: "task.create",
  TASK_VIEW_OWN: "task.view.own",
  TASK_VIEW_ALL: "task.view.all",
  TASK_EXECUTE: "task.execute",
  TASK_REVIEW: "task.review",

  // Tax record task requests
  TAX_RECORD_TASK_REQUEST_CREATE: "tax_records.task_request.create",
  TAX_RECORD_TASK_REQUEST_REVIEW: "tax_records.task_request.review",

  // Billing
  BILLING_MANAGE: "billing.manage",
  BILLING_VIEW_OWN: "billing.view.own",

  // Documents & reminders
  DOCUMENT_UPLOAD: "document.upload",
  REMINDER_CREATE: "reminder.create",

  // Consultation
  CONSULTATION_CREATE: "consultation.create",
  CONSULTATION_VIEW_OWN: "consultation.view.own",
  CONSULTATION_VIEW_ALL: "consultation.view.all",
  CONSULTATION_REVIEW: "consultation.review",
  CONSULTATION_CONFIG_MANAGE: "consultation.config.manage",
  CONSULTATION_VIEW_OWN_CLIENT: "consultation.view.own.client",

  // Notifications & analytics
  NOTIFICATION_RECEIVE: "notification.receive",
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
