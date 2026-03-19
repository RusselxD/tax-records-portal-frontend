import usePageTitle from "../../../../hooks/usePageTitle";
import { UserManagementProvider } from "./context/UserManagementContext";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";

export default function UserManagement() {
  usePageTitle("User Management");

  return (
    <UserManagementProvider>
      <div className="space-y-4">
        <UserFilters />
        <UserTable />
      </div>
    </UserManagementProvider>
  );
}
