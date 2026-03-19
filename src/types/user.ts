import type { UserRoleType } from "../constants";

export type UserStatus = "PENDING" | "ACTIVE" | "DEACTIVATED";

export interface UserTitle {
  prefix: boolean;
  title: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  roleName: UserRoleType;
  position: string;
  profileUrl: string;
  status: UserStatus;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  positionId: number;
  titles?: UserTitle[];
}

export interface ActivateAccountResponse {
  valid: boolean;
  email: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface AccountantListItemResponse {
  id: string;
  displayName: string;
  position: string;
  role: string;
  roleKey: string;
}

export interface PositionListItem {
  id: number;
  name: string;
}

export interface MyProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  role: string;
  roleKey: UserRoleType;
  position: string | null;
  status: string;
  profileUrl: string | null;
  permissions: string[];
  titles: UserTitle[];
}

export interface UpdateMyProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  titles: UserTitle[];
}

export interface UpdateMyProfileResponse {
  name: string;
  email: string;
}

export interface AssignedClientItem {
  id: string;
  clientName: string;
}

export interface AssignedClientsResponse {
  content: AssignedClientItem[];
  hasMore: boolean;
}
