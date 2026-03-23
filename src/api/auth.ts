import type { LoginRequest, LoginResponse } from "../types/auth";
import apiClient from "./axios-config";

export const authAPI = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/login", request);
    return res.data as LoginResponse;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/reset-password", { token, newPassword });
    return res.data as LoginResponse;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/auth/logout", { refreshToken });
  },
};
