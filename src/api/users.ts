import apiClient from "./axios-config";
import type {
  ManagedUser,
  CreateUserRequest,
  ActivateAccountResponse,
  SetPasswordRequest,
  AccountantListItemResponse,
  PositionListItem,
  MyProfileResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  AssignedClientsResponse,
} from "../types/user";
import type { LoginResponse } from "../types/auth";

export const usersAPI = {
  getMe: async (): Promise<MyProfileResponse> => {
    const res = await apiClient.get("/users/me");
    return res.data as MyProfileResponse;
  },

  updateMe: async (data: UpdateMyProfileRequest): Promise<UpdateMyProfileResponse> => {
    const res = await apiClient.patch("/users/me", data);
    return res.data as UpdateMyProfileResponse;
  },

  getUsers: async (): Promise<ManagedUser[]> => {
    const res = await apiClient.get("/users");
    return res.data as ManagedUser[];
  },

  createUser: async (data: CreateUserRequest): Promise<ManagedUser> => {
    const res = await apiClient.post("/users", data);
    return res.data as ManagedUser;
  },

  validateActivationToken: async (
    token: string,
  ): Promise<ActivateAccountResponse> => {
    const res = await apiClient.get("tokens/verify/activation-token", {
      params: { token },
    });
    return res.data as ActivateAccountResponse;
  },

  setPassword: async (data: SetPasswordRequest): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/set-password", data);
    return res.data as LoginResponse;
  },

  getAccountants: async (
    roleKey?: string,
  ): Promise<AccountantListItemResponse[]> => {
    const res = await apiClient.get("/users/accountants", {
      params: roleKey ? { roleKey } : undefined,
    });
    return res.data;
  },

  getEmployeePositions: async (): Promise<PositionListItem[]> => {
    const res = await apiClient.get("/employee-positions");
    return res.data as PositionListItem[];
  },

  createEmployeePosition: async (name: string): Promise<PositionListItem> => {
    const res = await apiClient.post("/employee-positions", { name });
    return res.data as PositionListItem;
  },

  resendActivation: async (
    userId: string,
    data?: { firstName?: string; lastName?: string; email?: string },
  ): Promise<void> => {
    await apiClient.post(`/users/${userId}/resend-activation`, data ?? {});
  },

  uploadAvatar: async (file: File): Promise<{ profileUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as { profileUrl: string };
  },

  deleteAvatar: async (): Promise<void> => {
    await apiClient.delete("/users/me/avatar");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await apiClient.post("/users/me/change-password", data);
  },

  getMyClients: async (page = 0, size = 20): Promise<AssignedClientsResponse> => {
    const res = await apiClient.get("/clients/assigned", { params: { page, size } });
    return res.data as AssignedClientsResponse;
  },
};
