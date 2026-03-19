import usePageTitle from "../../../../hooks/usePageTitle";
import { ClientProfilesProvider } from "./context/ClientProfilesContext";
import ClientProfilesFilters from "./components/ClientProfilesFilters";
import ClientProfilesTable from "./components/ClientProfilesTable";

export default function ClientProfiles() {
  usePageTitle("Client Profiles");

  return (
    <ClientProfilesProvider>
      <div className="space-y-4">
        <ClientProfilesFilters />
        <ClientProfilesTable />
      </div>
    </ClientProfilesProvider>
  );
}
