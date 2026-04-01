import type { ScopeOfEngagementDetails } from "../../../../../../../types/client-info";
import { TextDisplay, RichTextPreview } from "../../../field-displays";

export default function RequiredDeliverablesPreview({ data }: { data: ScopeOfEngagementDetails }) {
  const hasData = !!(
    (data.standardDeliverable?.content && data.standardDeliverable.content.length > 0) ||
    data.requiredDeliverableOthers
  );

  if (!hasData) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <RichTextPreview label="Standard Deliverable" value={data.standardDeliverable} />
      <TextDisplay label="Others" value={data.requiredDeliverableOthers} />
    </div>
  );
}
