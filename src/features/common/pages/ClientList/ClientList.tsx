import usePageTitle from "../../../../hooks/usePageTitle";
import { useAuth } from "../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../constants/permissions";
import { ClientListProvider } from "./context/ClientListContext";
import ClientListFilters from "./components/ClientListFilters";
import ClientListTable from "./components/ClientListTable";

export default function ClientList() {
  const { user } = useAuth();
  const canViewAll = hasPermission(user?.permissions, Permission.CLIENT_VIEW_ALL);

  usePageTitle(canViewAll ? "Client List" : "Assigned Clients");

  return (
    <ClientListProvider>
      <div className="space-y-4">
        <ClientListFilters />
        <ClientListTable />
      </div>
    </ClientListProvider>
  );
}
