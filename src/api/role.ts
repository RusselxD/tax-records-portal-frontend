import type { RoleListItem } from "../types/role";
import apiClient from "./axios-config";

export const roleAPI = {
  getEmployeeRoles: async (): Promise<RoleListItem[]> => {
    const res = await apiClient.get("/roles/employees");
    return res.data as RoleListItem[];
  },
};
