import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./guards";
import RoleRedirect from "./pages/RoleRedirect";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import {
  authRoutes,
  managerRoutes,
  csdRoutes,
  oosRoutes,
  qtdRoutes,
  billingRoutes,
  clientRoutes,
} from "./router/index";

export const router = createBrowserRouter([
  // Auth routes (public)
  { ...authRoutes, errorElement: <ErrorPage /> },
  // All other routes require authentication
  {
    element: <AuthGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <RoleRedirect />,
      },
      managerRoutes,
      csdRoutes,
      oosRoutes,
      qtdRoutes,
      billingRoutes,
      clientRoutes,
    ],
  },
  // Catch-all 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
