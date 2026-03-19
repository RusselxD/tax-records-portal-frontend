import { useState, useEffect } from "react";
import { usersAPI } from "../../../../../../../api/users";
import { roleAPI } from "../../../../../../../api/role";
import type { RoleListItem } from "../../../../../../../types/role";
import type { PositionListItem } from "../../../../../../../types/user";

export default function useFormOptions() {
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [positions, setPositions] = useState<PositionListItem[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleAPI.getEmployeeRoles();
        setRoles(data);
      } catch {
        setError("Failed to load roles.");
      } finally {
        setRolesLoading(false);
      }
    };
    const fetchPositions = async () => {
      try {
        const data = await usersAPI.getEmployeePositions();
        setPositions(data);
      } catch {
        setError("Failed to load positions.");
      } finally {
        setPositionsLoading(false);
      }
    };
    fetchRoles();
    fetchPositions();
  }, []);

  const addPosition = (position: PositionListItem) => {
    setPositions((prev) => [...prev, position]);
  };

  return { roles, positions, rolesLoading, positionsLoading, error, addPosition };
}
