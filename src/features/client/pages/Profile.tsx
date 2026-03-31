import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import { clientAPI } from "../../../api/client";
import { getErrorMessage } from "../../../lib/api-error";
import { Button } from "../../../components/common";
import ClientStatusBadge from "../../../components/common/ClientStatusBadge";
import type { ClientInfoHeaderResponse } from "../../../types/client-info";
import useLazySections from "../../common/components/client-info/hooks/useLazySections";
import type { SectionFetcher } from "../../common/components/client-info/hooks/useLazySections";
import MainDetailsPreview from "../../common/components/client-info/sections/MainDetailsPreview";
import ClientInformationPreview from "../../common/components/client-info/sections/ClientInformationPreview";
import CorporateOfficerPreview from "../../common/components/client-info/sections/CorporateOfficerPreview";
import AccessCredentialsPreview from "../../common/components/client-info/sections/AccessCredentialsPreview";
import ScopeOfEngagementPreview from "../../common/components/client-info/sections/ScopeOfEngagementPreview";
import ProfessionalFeesPreview from "../../common/components/client-info/sections/ProfessionalFeesPreview";
import OnboardingDetailsPreview from "../../common/components/client-info/sections/OnboardingDetailsPreview";
import SectionCard from "../../common/components/client-info/sections/SectionCard";

const myFetcher: SectionFetcher = (key) =>
  clientAPI.getMyClientInfoSection(key);

export default function Profile() {
  usePageTitle("Profile");

  const [header, setHeader] = useState<ClientInfoHeaderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getSection, fetchSection } = useLazySections(null, myFetcher);

  const fetchHeader = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientAPI.getMyClientInfoHeader();
      setHeader(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load profile"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeader();
  }, [fetchHeader]);

  // Eagerly fetch main details as soon as header loads
  useEffect(() => {
    if (header) fetchSection("mainDetails");
  }, [header]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <Button variant="secondary" onClick={fetchHeader}>
          Try again
        </Button>
      </div>
    );
  }

  if (!header) return null;

  const mainDetails = getSection("mainDetails");
  const clientInfo = getSection("clientInformation");
  const corporateOfficer = getSection("corporateOfficerInformation");
  const accessCreds = getSection("accessCredentials");
  const scope = getSection("scopeOfEngagement");
  const fees = getSection("professionalFees");
  const onboarding = getSection("onboardingDetails");

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">
          {header.displayName || "My Profile"}
        </h1>
        {header.status && (
          <div className="mt-2">
            <ClientStatusBadge status={header.status} size="lg" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Main Details — always open, not collapsible */}
        <div className="rounded-lg bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-primary">Main Details</h2>
          </div>
          <div className="px-6 py-5">
            {mainDetails.status === "loading" && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
            {mainDetails.status === "error" && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-5 w-5 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Failed to load section</p>
                <button
                  onClick={() => fetchSection("mainDetails")}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  Try again
                </button>
              </div>
            )}
            {mainDetails.data && (
              <MainDetailsPreview
                data={mainDetails.data}
                classification={header.taxpayerClassification}
                assignedCsdOos={header.accountants?.csdOos ?? []}
                assignedQtd={header.accountants?.qtd ?? []}
              />
            )}
          </div>
        </div>

        {/* Remaining 6 sections — collapsible accordions */}
        <SectionCard
          title="Client Information"
          defaultOpen={false}
          status={clientInfo.status}
          onOpen={() => fetchSection("clientInformation")}
          onRetry={() => fetchSection("clientInformation")}
        >
          {clientInfo.data && <ClientInformationPreview data={clientInfo.data} />}
        </SectionCard>

        <SectionCard
          title="Owner's or Corporate Officer's Information"
          defaultOpen={false}
          status={corporateOfficer.status}
          onOpen={() => fetchSection("corporateOfficerInformation")}
          onRetry={() => fetchSection("corporateOfficerInformation")}
        >
          {corporateOfficer.data && (
            <CorporateOfficerPreview data={corporateOfficer.data} />
          )}
        </SectionCard>

        <SectionCard
          title="Access & Credentials"
          defaultOpen={false}
          status={accessCreds.status}
          onOpen={() => fetchSection("accessCredentials")}
          onRetry={() => fetchSection("accessCredentials")}
        >
          {accessCreds.data && (
            <AccessCredentialsPreview data={accessCreds.data} />
          )}
        </SectionCard>

        <SectionCard
          title="Scope of Engagement"
          defaultOpen={false}
          status={scope.status}
          onOpen={() => fetchSection("scopeOfEngagement")}
          onRetry={() => fetchSection("scopeOfEngagement")}
        >
          {scope.data && <ScopeOfEngagementPreview data={scope.data} />}
        </SectionCard>

        <SectionCard
          title="Professional Fees"
          defaultOpen={false}
          status={fees.status}
          onOpen={() => fetchSection("professionalFees")}
          onRetry={() => fetchSection("professionalFees")}
        >
          {fees.data && <ProfessionalFeesPreview data={fees.data} />}
        </SectionCard>

        <SectionCard
          title="Onboarding Details"
          defaultOpen={false}
          status={onboarding.status}
          onOpen={() => fetchSection("onboardingDetails")}
          onRetry={() => fetchSection("onboardingDetails")}
        >
          {onboarding.data && (
            <OnboardingDetailsPreview data={onboarding.data} />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
