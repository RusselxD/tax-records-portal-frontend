import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl } from "../constants";

/**
 * Redirects authenticated users to their role-based dashboard.
 * Used at the root "/" route.
 */
export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const dashboardUrl = getDashboardUrl(user.roleKey);
  return <Navigate to={dashboardUrl} replace />;
}
