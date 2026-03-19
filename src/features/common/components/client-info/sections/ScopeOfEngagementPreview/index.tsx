import type { ScopeOfEngagementDetails } from "../../../../../../types/client-info";
import { DateFieldDisplay, FileDisplay } from "../../field-displays";
import SubsectionHeading from "../SubsectionHeading";
import DocumentsGatheringPreview from "./components/DocumentsGatheringPreview";
import ClientEngagementsPreview from "./components/ClientEngagementsPreview";
import RequiredDeliverablesPreview from "./components/RequiredDeliverablesPreview";

export default function ScopeOfEngagementPreview({ data }: { data: ScopeOfEngagementDetails }) {
  return (
    <div className="space-y-6">
        {/* Header: Engagement Letter */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <DateFieldDisplay label="Date of Engagement Letter" value={data.dateOfEngagementLetter} />
          <FileDisplay label="Engagement Letter" value={data.engagementLetter} />
        </div>

        {/* A. Documents & Information Gathering */}
        <div>
          <SubsectionHeading label="A. Documents & Information Gathering" />
          <div className="mt-4">
            <DocumentsGatheringPreview data={data} />
          </div>
        </div>

        {/* B. Client Engagements */}
        <div>
          <SubsectionHeading label="B. Client Engagements" />
          <div className="mt-4">
            <ClientEngagementsPreview data={data} />
          </div>
        </div>

        {/* C. Required Deliverable & Report */}
        <div>
          <SubsectionHeading label="C. Required Deliverable & Report" />
          <div className="mt-4">
            <RequiredDeliverablesPreview data={data} />
          </div>
        </div>
    </div>
  );
}
