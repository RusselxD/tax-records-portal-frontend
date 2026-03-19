import type { ScopeOfEngagementDetails } from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import FileUploadInput from "../FileUploadInput";
import DocumentsGatheringSubsection from "./components/DocumentsGatheringSubsection";
import ClientEngagementsSubsection from "./components/ClientEngagementsSubsection";
import RequiredDeliverablesSubsection from "./components/RequiredDeliverablesSubsection";

interface ScopeOfEngagementSectionProps {
  data: ScopeOfEngagementDetails;
  onChange: (fields: Partial<ScopeOfEngagementDetails>) => void;
}

export default function ScopeOfEngagementSection({
  data,
  onChange,
}: ScopeOfEngagementSectionProps) {
  const update = (fields: Partial<ScopeOfEngagementDetails>) =>
    onChange(fields);

  return (
    <div className="space-y-8">
      {/* Engagement Letter */}
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">
          Engagement Letter
        </h3>
        <DateFieldInput
          label="Date of Engagement Letter"
          value={data.dateOfEngagementLetter}
          onChange={(v) => update({ dateOfEngagementLetter: v })}
        />
        <div className="mt-3">
          <FileUploadInput
            label="Engagement Letter"
            value={data.engagementLetter}
            onChange={(v) => update({ engagementLetter: v })}
          />
        </div>
      </div>

      <DocumentsGatheringSubsection data={data} onUpdate={update} />
      <ClientEngagementsSubsection data={data} onUpdate={update} />
      <RequiredDeliverablesSubsection data={data} onUpdate={update} />
    </div>
  );
}
