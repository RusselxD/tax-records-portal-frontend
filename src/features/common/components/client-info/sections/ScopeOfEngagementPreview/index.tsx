import type { ScopeOfEngagementDetails } from "../../../../../../types/client-info";
import { CollapsibleSubsection } from "../../../../../../components/common";
import { DateFieldDisplay, FileDisplay } from "../../field-displays";
import DocumentsGatheringPreview, { hasDocumentsGatheringData } from "./components/DocumentsGatheringPreview";
import ClientEngagementsPreview, { hasClientEngagementsData } from "./components/ClientEngagementsPreview";
import RequiredDeliverablesPreview from "./components/RequiredDeliverablesPreview";

export default function ScopeOfEngagementPreview({ data }: { data: ScopeOfEngagementDetails }) {
  const showEngagementLetter = !!(data.dateOfEngagementLetter?.date || data.engagementLetters?.length > 0);
  const showDocs = hasDocumentsGatheringData(data);
  const showEngagements = hasClientEngagementsData(data);
  const showDeliverables = !!(
    (data.standardDeliverable?.content && data.standardDeliverable.content.length > 0) ||
    data.requiredDeliverableOthers
  );

  return (
    <div className="space-y-3">
      {showEngagementLetter && (
        <CollapsibleSubsection title="Engagement Letter">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <DateFieldDisplay label="Date of Engagement Letter" value={data.dateOfEngagementLetter} />
            <FileDisplay label="Engagement Letters" value={data.engagementLetters} />
          </div>
        </CollapsibleSubsection>
      )}

      {showDocs && (
        <CollapsibleSubsection title="Documents & Information Gathering" defaultOpen={false}>
          <DocumentsGatheringPreview data={data} />
        </CollapsibleSubsection>
      )}

      {showEngagements && (
        <CollapsibleSubsection title="Client Engagements" defaultOpen={false}>
          <ClientEngagementsPreview data={data} />
        </CollapsibleSubsection>
      )}

      {showDeliverables && (
        <CollapsibleSubsection title="Required Deliverable & Report" defaultOpen={false}>
          <RequiredDeliverablesPreview data={data} />
        </CollapsibleSubsection>
      )}
    </div>
  );
}
