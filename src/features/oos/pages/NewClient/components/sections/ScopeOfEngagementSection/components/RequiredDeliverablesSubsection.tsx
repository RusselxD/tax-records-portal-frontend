import { Input } from "../../../../../../../../components/common";
import type {
  ScopeOfEngagementDetails,
  RichTextContent,
} from "../../../../../../../../types/client-info";
import RichTextEditor from "../../RichTextEditor";

interface RequiredDeliverablesSubsectionProps {
  data: ScopeOfEngagementDetails;
  onUpdate: (fields: Partial<ScopeOfEngagementDetails>) => void;
}

export default function RequiredDeliverablesSubsection({
  data,
  onUpdate,
}: RequiredDeliverablesSubsectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-3">
        C. Required Deliverable & Report
      </h3>
      <div className="space-y-4">
        <RichTextEditor
          label="Standard Deliverable"
          value={data.standardDeliverable}
          onChange={(v: RichTextContent) => onUpdate({ standardDeliverable: v })}
        />
        <Input
          label="Others"
          value={data.requiredDeliverableOthers ?? ""}
          onChange={(e) =>
            onUpdate({ requiredDeliverableOthers: e.target.value || null })
          }
          placeholder="Other required deliverables"
        />
      </div>
    </div>
  );
}
