import type { ScopeOfEngagementDetails } from "../../../../../../types/client-info";
import { DateFieldDisplay, FileDisplay } from "../../field-displays";
import SubsectionHeading from "../SubsectionHeading";
import DocumentsGatheringPreview, { hasDocumentsGatheringData } from "./components/DocumentsGatheringPreview";
import ClientEngagementsPreview, { hasClientEngagementsData } from "./components/ClientEngagementsPreview";
import RequiredDeliverablesPreview from "./components/RequiredDeliverablesPreview";

export default function ScopeOfEngagementPreview({ data }: { data: ScopeOfEngagementDetails }) {
  const showDocs = hasDocumentsGatheringData(data);
  const showEngagements = hasClientEngagementsData(data);
  // RequiredDeliverablesPreview handles its own null check internally
  const showDeliverables = !!(
    (data.standardDeliverable?.content && data.standardDeliverable.content.length > 0) ||
    data.requiredDeliverableOthers
  );

  return (
    <div className="space-y-6">
      {/* Header: Engagement Letter */}
      {(data.dateOfEngagementLetter?.date || data.engagementLetter) && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <DateFieldDisplay label="Date of Engagement Letter" value={data.dateOfEngagementLetter} />
          <FileDisplay label="Engagement Letter" value={data.engagementLetter} />
        </div>
      )}

      {/* A. Documents & Information Gathering */}
      {showDocs && (
        <div>
          <SubsectionHeading label="A. Documents & Information Gathering" />
          <div className="mt-4 pl-5">
            <DocumentsGatheringPreview data={data} />
          </div>
        </div>
      )}

      {/* B. Client Engagements */}
      {showEngagements && (
        <div>
          <SubsectionHeading label="B. Client Engagements" />
          <div className="mt-4 pl-5">
            <ClientEngagementsPreview data={data} />
          </div>
        </div>
      )}

      {/* C. Required Deliverable & Report */}
      {showDeliverables && (
        <div>
          <SubsectionHeading label="C. Required Deliverable & Report" />
          <div className="mt-4 pl-5">
            <RequiredDeliverablesPreview data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
