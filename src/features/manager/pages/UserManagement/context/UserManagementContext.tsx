import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { getErrorMessage } from "../../../../../lib/api-error";
import { usersAPI } from "../../../../../api/users";
import type { ManagedUser } from "../../../../../types/user";

interface UserManagementContextType {
  users: ManagedUser[];
  positions: string[];
  isFetching: boolean;
  error: string | null;
  search: string;
  roleFilter: string;
  statusFilter: string;
  positionFilter: string;
  setSearch: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPositionFilter: (value: string) => void;
  addUser: (user: ManagedUser) => void;
  updateUser: (user: ManagedUser) => void;
  refetch: () => void;
}

const UserManagementContext = createContext<UserManagementContextType | null>(
  null,
);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<ManagedUser[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  // Fetch positions once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await usersAPI.getEmployeePositions();
        if (!cancelled) setPositions(data.map((p) => p.name).sort());
      } catch {
        // positions are non-critical; silently ignore
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await usersAPI.getUsers({
        search: debouncedSearch,
        roleKey: roleFilter,
        status: statusFilter,
        position: positionFilter,
      });
      setAllUsers(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch users. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, positionFilter]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await usersAPI.getUsers({
          search: debouncedSearch,
          roleKey: roleFilter,
          status: statusFilter,
          position: positionFilter,
        });
        if (!cancelled) setAllUsers(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to fetch users. Try again."));
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedSearch, roleFilter, statusFilter, positionFilter]);

  const addUser = useCallback((user: ManagedUser) => {
    setAllUsers((prev) => [user, ...prev]);
  }, []);

  const updateUser = useCallback((user: ManagedUser) => {
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  }, []);

  const value = useMemo(
    () => ({
      users: allUsers,
      positions,
      isFetching,
      error,
      search,
      roleFilter,
      statusFilter,
      positionFilter,
      setSearch,
      setRoleFilter,
      setStatusFilter,
      setPositionFilter,
      addUser,
      updateUser,
      refetch: fetchUsers,
    }),
    [
      allUsers,
      positions,
      isFetching,
      error,
      search,
      roleFilter,
      statusFilter,
      positionFilter,
      addUser,
      updateUser,
      fetchUsers,
    ],
  );

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error(
      "useUserManagement must be used within a UserManagementProvider",
    );
  }
  return context;
}
