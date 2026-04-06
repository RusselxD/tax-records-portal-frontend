import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

const Login = lazy(() => import("../pages/Login"));
const ActivateAccount = lazy(() => import("../pages/ActivateAccount"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "activate-account/:token", element: <ActivateAccount /> },
    { path: "reset-password/:token", element: <ResetPassword /> },
  ],
};
