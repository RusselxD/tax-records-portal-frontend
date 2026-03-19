import type { ChangedSection } from "../../../../../types/client-profile";
import type { InfoSectionKey } from "../../../../../types/client-info";
import { extractChanges } from "./diff-utils";

const SECTION_LABELS: Record<string, string> = {
  mainDetails: "Main Details",
  clientInformation: "Client Information",
  corporateOfficerInformation: "Corporate Officers & Point of Contact",
  accessCredentials: "Access & Credentials",
  scopeOfEngagement: "Scope of Engagement",
  professionalFees: "Professional Fees",
  onboardingDetails: "Onboarding Details",
};

export default function SectionDiffCard({ change }: { change: ChangedSection }) {
  const changes = extractChanges(change.current, change.submitted);
  const label = SECTION_LABELS[change.sectionKey as InfoSectionKey] ?? change.sectionKey;

  if (changes.length === 0) return null;

  return (
    <div className="rounded-lg bg-white border border-gray-200" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-primary">{label}</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-2.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Field</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Proposed</span>
      </div>

      {/* Diff rows */}
      <div className="divide-y divide-gray-50">
        {changes.map((field, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-3 items-start">
            <span className="text-sm text-gray-500 leading-relaxed">{field.label}</span>
            <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
              {field.oldValue}
            </span>
            <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
              {field.newValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
