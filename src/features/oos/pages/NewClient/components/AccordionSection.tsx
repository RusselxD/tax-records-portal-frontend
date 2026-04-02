import { useEffect } from "react";
import { ChevronRight, Loader2, Check, AlertTriangle } from "lucide-react";
import type { InfoSectionMeta, InfoSectionKey } from "../../../../../types/client-info";
import type { SaveStatus } from "../../../../../types/client";
import { useNewClient } from "../context/NewClientContext";
import {
  MainDetailsSection,
  ClientInformationSection,
  CorporateOfficerInformationSection,
  AccessCredentialsSection,
  ScopeOfEngagementSection,
  ProfessionalFeesSection,
  OnboardingDetailsSection,
} from "./sections";

function SectionSaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-status-pending">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-status-approved">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-status-rejected">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRetry();
            }
          }}
          className="underline hover:no-underline cursor-pointer"
        >
          Retry
        </span>
      </span>
    );
  }
  return null;
}

function SectionBody({ sectionKey }: { sectionKey: InfoSectionKey }) {
  const { sections, updateSection } = useNewClient();

  switch (sectionKey) {
    case "mainDetails": {
      const data = sections.mainDetails;
      if (!data) return null;
      return (
        <MainDetailsSection
          data={data}
          onChange={(d) => updateSection("mainDetails", d)}
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

interface AccordionSectionProps {
  section: InfoSectionMeta;
}

export default function AccordionSection({ section }: AccordionSectionProps) {
  const {
    sectionSaveStatus,
    sectionLoadStatus,
    loadSection,
    expandedSections,
    toggleSection,
    retrySection,
    sectionRefs,
  } = useNewClient();

  const isExpanded = expandedSections.has(section.key);
  const saveStatus = sectionSaveStatus[section.key];
  const loadStatus = sectionLoadStatus[section.key];
  const sectionRef = sectionRefs[section.key];

  // Trigger lazy load when section is expanded and not yet loaded
  useEffect(() => {
    if (isExpanded && loadStatus === "idle") {
      loadSection(section.key);
    }
  }, [isExpanded, loadStatus, loadSection, section.key]);

  const isLoadingSection = loadStatus === "loading";
  const isLoadError = loadStatus === "error";
  const isSectionReady = loadStatus === "loaded";

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="rounded-lg bg-white custom-shadow"
    >
      <button
        onClick={() => toggleSection(section.key)}
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
          <span className={`text-base font-semibold ${isExpanded ? "text-white" : "text-primary"}`}>
            {section.label}
          </span>
        </div>
        <SectionSaveIndicator
          status={saveStatus}
          onRetry={() => retrySection(section.key)}
        />
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
          {isLoadingSection && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}
          {isLoadError && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-5 w-5 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Failed to load section</p>
              <button
                onClick={() => loadSection(section.key)}
                className="text-sm text-accent hover:text-accent-hover font-medium"
              >
                Try again
              </button>
            </div>
          )}
          {isSectionReady && <SectionBody sectionKey={section.key} />}
        </div>
      </div>
    </div>
  );
}
