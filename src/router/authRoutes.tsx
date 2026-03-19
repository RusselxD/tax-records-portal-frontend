import type { RouteObject } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Login from "../pages/Login";
import ActivateAccount from "../pages/ActivateAccount";

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "activate-account/:token", element: <ActivateAccount /> },
  ],
};
