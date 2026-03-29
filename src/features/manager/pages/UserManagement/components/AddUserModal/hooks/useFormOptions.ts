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
    let cancelled = false;

    const fetchRoles = async () => {
      try {
        const data = await roleAPI.getEmployeeRoles();
        if (!cancelled) setRoles(data);
      } catch {
        if (!cancelled) setError("Failed to load roles.");
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    };
    const fetchPositions = async () => {
      try {
        const data = await usersAPI.getEmployeePositions();
        if (!cancelled) setPositions(data);
      } catch {
        if (!cancelled) setError("Failed to load positions.");
      } finally {
        if (!cancelled) setPositionsLoading(false);
      }
    };
    fetchRoles();
    fetchPositions();

    return () => { cancelled = true; };
  }, []);

  const addPosition = (position: PositionListItem) => {
    setPositions((prev) => [...prev, position]);
  };

  return { roles, positions, rolesLoading, positionsLoading, error, addPosition };
}
