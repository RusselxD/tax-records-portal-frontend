import type {
  InfoSectionKey,
  ClientInfoSections as SectionsMap,
  AssignedAccountant,
} from "../../../../types/client-info";
import MainDetailsPreview from "./sections/MainDetailsPreview";
import ClientInformationPreview from "./sections/ClientInformationPreview";
import CorporateOfficerPreview from "./sections/CorporateOfficerPreview";
import AccessCredentialsPreview from "./sections/AccessCredentialsPreview";
import ScopeOfEngagementPreview from "./sections/ScopeOfEngagementPreview";
import ProfessionalFeesPreview from "./sections/ProfessionalFeesPreview";
import OnboardingDetailsPreview from "./sections/OnboardingDetailsPreview";
import SectionCard from "./sections/SectionCard";

type SectionStatus = "idle" | "loading" | "loaded" | "error";

interface ClientInfoSectionsProps {
  getSection: <K extends InfoSectionKey>(key: K) => {
    data: SectionsMap[K] | null;
    status: SectionStatus;
  };
  fetchSection: (key: InfoSectionKey) => void;
  classification?: string | null;
  assignedCsdOos?: AssignedAccountant[];
  assignedQtd?: AssignedAccountant[];
  mainDetailsAction?: React.ReactNode;
}

export default function ClientInfoSections({
  getSection,
  fetchSection,
  classification,
  assignedCsdOos,
  assignedQtd,
  mainDetailsAction,
}: ClientInfoSectionsProps) {
  const mainDetails = getSection("mainDetails");
  const clientInfo = getSection("clientInformation");
  const corporateOfficer = getSection("corporateOfficerInformation");
  const accessCreds = getSection("accessCredentials");
  const scope = getSection("scopeOfEngagement");
  const fees = getSection("professionalFees");
  const onboarding = getSection("onboardingDetails");

  return (
    <div className="space-y-3">
      <SectionCard
        title="Main Details"
        status={mainDetails.status}
        onOpen={() => fetchSection("mainDetails")}
        onRetry={() => fetchSection("mainDetails")}
        headerAction={mainDetailsAction}
      >
        {mainDetails.data && (
          <MainDetailsPreview
            data={mainDetails.data}
            classification={classification}
            assignedCsdOos={assignedCsdOos ?? []}
            assignedQtd={assignedQtd ?? []}
          />
        )}
      </SectionCard>

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
  );
}
