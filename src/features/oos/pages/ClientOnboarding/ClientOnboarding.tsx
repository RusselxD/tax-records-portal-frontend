import usePageTitle from "../../../../hooks/usePageTitle";
import { ClientOnboardingProvider } from "./context/ClientOnboardingContext";
import ClientOnboardingFilters from "./components/ClientOnboardingFilters";
import ClientOnboardingTable from "./components/ClientOnboardingTable";

export default function ClientOnboarding() {
  usePageTitle("Client Onboarding");

  return (
    <ClientOnboardingProvider>
      <div className="space-y-4">
        <ClientOnboardingFilters />
        <ClientOnboardingTable />
      </div>
    </ClientOnboardingProvider>
  );
}
