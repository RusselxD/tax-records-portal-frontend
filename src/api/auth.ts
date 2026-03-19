import type { LoginRequest, LoginResponse } from "../types/auth";
import apiClient from "./axios-config";

export const authAPI = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/login", request);
    return res.data as LoginResponse;
  },
};
