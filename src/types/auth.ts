import type { UserRoleType } from "../constants";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  roleKey: UserRoleType;
  position: string | null;
  permissions: string[];
  status: string;
  profileUrl: string | null;
}
