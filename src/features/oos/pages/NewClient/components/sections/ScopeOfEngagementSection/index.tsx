import type { ScopeOfEngagementDetails } from "../../../../../../../types/client-info";
import { MultiFileDropZone, CollapsibleSubsection } from "../../../../../../../components/common";
import { useNewClient } from "../../../context/NewClientContext";
import DateFieldInput from "../DateFieldInput";
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
  const { uploadFile } = useNewClient();
  const update = (fields: Partial<ScopeOfEngagementDetails>) =>
    onChange(fields);

  return (
    <div className="space-y-3">
      <CollapsibleSubsection title="Engagement Letter">
        <DateFieldInput
          label="Date of Engagement Letter"
          value={data.dateOfEngagementLetter}
          onChange={(v) => update({ dateOfEngagementLetter: v })}
        />
        <div className="mt-3">
          <MultiFileDropZone
            label="Engagement Letters"
            value={data.engagementLetters}
            onChange={(v) => update({ engagementLetters: v })}
            uploadFile={uploadFile}
          />
        </div>
      </CollapsibleSubsection>

      <CollapsibleSubsection title="Documents & Information Gathering" defaultOpen={false}>
        <DocumentsGatheringSubsection data={data} onUpdate={update} />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="Client Engagements" defaultOpen={false}>
        <ClientEngagementsSubsection data={data} onUpdate={update} />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="Required Deliverable & Report" defaultOpen={false}>
        <RequiredDeliverablesSubsection data={data} onUpdate={update} />
      </CollapsibleSubsection>
    </div>
  );
}
