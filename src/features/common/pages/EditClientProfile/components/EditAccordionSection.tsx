import { useEffect } from "react";
import { ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import type { InfoSectionMeta, InfoSectionKey } from "../../../../../types/client-info";
import { useEditClientProfile } from "../context/EditClientProfileContext";
import {
  MainDetailsSection,
  ClientInformationSection,
  CorporateOfficerInformationSection,
  AccessCredentialsSection,
  ScopeOfEngagementSection,
  ProfessionalFeesSection,
  OnboardingDetailsSection,
} from "../../../../oos/pages/NewClient/components/sections";

function SectionBody({ sectionKey }: { sectionKey: InfoSectionKey }) {
  const { sections, sectionLoadStatus, loadSection, updateSection } = useEditClientProfile();
  const status = sectionLoadStatus[sectionKey];

  useEffect(() => {
    if (status === "idle") loadSection(sectionKey);
  }, [sectionKey, status, loadSection]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
        <AlertTriangle className="h-5 w-5 text-gray-300" />
        <p className="text-sm text-status-rejected">Failed to load section.</p>
        <button
          onClick={() => loadSection(sectionKey)}
          className="text-sm text-accent hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  switch (sectionKey) {
    case "mainDetails": {
      const data = sections.mainDetails;
      if (!data) return null;
      return (
        <MainDetailsSection
          data={data}
          onChange={(d) => updateSection("mainDetails", d)}
          hideAccountants
        />
      );
    }
    case "clientInformation": {
      const data = sections.clientInformation;
      if (!data) return null;
      return (
        <ClientInformationSection
          data={data}
          onChange={(d) => updateSection("clientInformation", d)}
        />
      );
    }
    case "corporateOfficerInformation": {
      const data = sections.corporateOfficerInformation;
      if (!data) return null;
      return (
        <CorporateOfficerInformationSection
          data={data}
          onChange={(d) => updateSection("corporateOfficerInformation", d)}
        />
      );
    }
    case "accessCredentials": {
      const data = sections.accessCredentials;
      if (!data) return null;
      return (
        <AccessCredentialsSection
          data={data}
          onChange={(d) => updateSection("accessCredentials", d)}
        />
      );
    }
    case "scopeOfEngagement": {
      const data = sections.scopeOfEngagement;
      if (!data) return null;
      return (
        <ScopeOfEngagementSection
          data={data}
          onChange={(fields) =>
            updateSection("scopeOfEngagement", (prev) => ({ ...prev, ...fields }))
          }
        />
      );
    }
    case "professionalFees": {
      const data = sections.professionalFees;
      if (!data) return null;
      return (
        <ProfessionalFeesSection
          data={data}
          onChange={(d) => updateSection("professionalFees", d)}
        />
      );
    }
    case "onboardingDetails": {
      const data = sections.onboardingDetails;
      if (!data) return null;
      return (
        <OnboardingDetailsSection
          data={data}
          onChange={(fields) =>
            updateSection("onboardingDetails", (prev) => ({ ...prev, ...fields }))
          }
        />
      );
    }
    default:
      return null;
  }
}

export default function EditAccordionSection({ section }: { section: InfoSectionMeta }) {
  const { expandedSections, toggleSection, loadSection, sectionLoadStatus, sectionRefs } = useEditClientProfile();
  const isExpanded = expandedSections.has(section.key);
  const sectionRef = sectionRefs[section.key];

  function handleToggle() {
    if (!isExpanded && sectionLoadStatus[section.key] === "idle") {
      loadSection(section.key);
    }
    toggleSection(section.key);
  }

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="rounded-lg bg-white"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}
    >
      <button
        onClick={handleToggle}
        className={`flex w-full items-center justify-between px-5 h-14 transition-colors ${
          isExpanded
            ? "bg-primary text-white rounded-t-lg"
            : "bg-white hover:bg-gray-50 rounded-lg"
        }`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-90 text-white/70" : "text-gray-400"
            }`}
          />
          <span
            className={`text-base font-semibold ${isExpanded ? "text-white" : "text-primary"}`}
          >
            {section.label}
          </span>
        </div>
      </button>

      <div
        className="transition-all duration-200 ease-out"
        style={{
          maxHeight: isExpanded ? "none" : "0px",
          opacity: isExpanded ? 1 : 0,
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        <div className="p-6">
          <SectionBody sectionKey={section.key} />
        </div>
      </div>
    </div>
  );
}
