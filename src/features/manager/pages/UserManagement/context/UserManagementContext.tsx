import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { usersAPI } from "../../../../../api/users";
import type { ManagedUser } from "../../../../../types/user";

interface UserManagementContextType {
  users: ManagedUser[];
  isFetching: boolean;
  error: string | null;
  search: string;
  roleFilter: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  addUser: (user: ManagedUser) => void;
  refetch: () => void;
}

const UserManagementContext = createContext<UserManagementContextType | null>(
  null,
);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<ManagedUser[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await usersAPI.getUsers();
      setAllUsers(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch users. Try again."));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback((user: ManagedUser) => {
    setAllUsers((prev) => [user, ...prev]);
  }, []);

  const users = useMemo(() => {
    const query = search.toLowerCase();

    return allUsers.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole = !roleFilter || user.roleName === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, search, roleFilter, statusFilter]);

  return (
    <UserManagementContext.Provider
      value={{
        users,
        isFetching,
        error,
        search,
        roleFilter,
        statusFilter,
        setSearch,
        setRoleFilter,
        setStatusFilter,
        addUser,
        refetch: fetchUsers,
      }}
    >
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
