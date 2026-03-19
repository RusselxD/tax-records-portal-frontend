import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl, type UserRoleType } from "../constants";

interface RoleGuardProps {
  allowedRoles: UserRoleType[];
}

/**
 * Protects routes based on user role.
 * Redirects to user's dashboard if their role is not allowed.
 */
export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.roleKey);

  if (!hasAccess) {
    // Redirect to user's own dashboard
    return <Navigate to={getDashboardUrl(user.roleKey)} replace />;
  }

  return <Outlet />;
}
