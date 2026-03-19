import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./guards";
import RoleRedirect from "./pages/RoleRedirect";
import NotFound from "./pages/NotFound";
import {
  authRoutes,
  managerRoutes,
  csdRoutes,
  oosRoutes,
  qtdRoutes,
  clientRoutes,
} from "./router/index";

export const router = createBrowserRouter([
  // Auth routes (public)
  authRoutes,
  // All other routes require authentication
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <RoleRedirect />,
      },
      managerRoutes,
      csdRoutes,
      oosRoutes,
      qtdRoutes,
      clientRoutes,
    ],
  },
  // Catch-all 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
