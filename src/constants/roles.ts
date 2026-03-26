/**
 * User role key constants matching backend roleKey values.
 * Used for routing, guards, and all logic checks.
 */
export const UserRole = {
  MANAGER: "MANAGER",
  OOS: "OOS",
  QTD: "QTD",
  CSD: "CSD",
  BILLING: "BILLING",
  CLIENT: "CLIENT",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/**
 * Maps each roleKey to its route prefix
 */
export const roleRoutePrefix: Record<UserRoleType, string> = {
  [UserRole.MANAGER]: "/manager",
  [UserRole.OOS]: "/oos",
  [UserRole.QTD]: "/qtd",
  [UserRole.CSD]: "/csd",
  [UserRole.BILLING]: "/internal-billing",
  [UserRole.CLIENT]: "/client",
};

/**
 * Maps each roleKey to its default dashboard URL
 */
export const roleDashboardMap: Record<UserRoleType, string> = {
  [UserRole.MANAGER]: "/manager/dashboard",
  [UserRole.OOS]: "/oos/dashboard",
  [UserRole.QTD]: "/qtd/dashboard",
  [UserRole.CSD]: "/csd/dashboard",
  [UserRole.BILLING]: "/internal-billing/clients",
  [UserRole.CLIENT]: "/client/dashboard",
};

/**
 * Get the route prefix for a given roleKey
 */
export function getRolePrefix(roleKey: string): string {
  return roleRoutePrefix[roleKey as UserRoleType] ?? "";
}

/**
 * Get the dashboard URL for a given roleKey
 */
export function getDashboardUrl(roleKey: string): string {
  return roleDashboardMap[roleKey as UserRoleType] ?? "/";
}
