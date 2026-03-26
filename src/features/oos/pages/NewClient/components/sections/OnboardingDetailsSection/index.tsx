import { uid } from "../../../../../../../lib/uid";
import { Input, CollapsibleSubsection } from "../../../../../../../components/common";
import type {
  OnboardingDetails,
  PendingActionItem,
} from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import PendingActionItemsList from "./components/PendingActionItemsList";

function emptyActionItem(): PendingActionItem {
  return { _uid: uid(), particulars: null, notes: null };
}

interface OnboardingDetailsSectionProps {
  data: OnboardingDetails;
  onChange: (fields: Partial<OnboardingDetails>) => void;
}

export default function OnboardingDetailsSection({
  data,
  onChange,
}: OnboardingDetailsSectionProps) {
  const update = (fields: Partial<OnboardingDetails>) => onChange(fields);

  const updateAction = (index: number, fields: Partial<PendingActionItem>) => {
    const updated = data.pendingActionItems.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    update({ pendingActionItems: updated });
  };

  const addAction = () =>
    update({
      pendingActionItems: [...data.pendingActionItems, emptyActionItem()],
    });

  const removeAction = (index: number) =>
    update({
      pendingActionItems: data.pendingActionItems.filter((_, i) => i !== index),
    });

  return (
    <div className="space-y-3">
      <CollapsibleSubsection title="Group Chat Details">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name of Group Chat"
              value={data.nameOfGroupChat ?? ""}
              onChange={(e) =>
                update({ nameOfGroupChat: e.target.value || null })
              }
              placeholder="Enter group chat name"
            />
            <Input
              label="Platform Used"
              value={data.platformUsed ?? ""}
              onChange={(e) =>
                update({ platformUsed: e.target.value || null })
              }
              placeholder="e.g. Viber, Messenger"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="GC Created By"
              value={data.gcCreatedBy ?? ""}
              onChange={(e) =>
                update({ gcCreatedBy: e.target.value || null })
              }
              placeholder="Name of creator"
            />
            <DateFieldInput
              label="GC Created Date"
              value={data.gcCreatedDate}
              onChange={(v) => update({ gcCreatedDate: v })}
            />
          </div>
        </div>
      </CollapsibleSubsection>

      <CollapsibleSubsection title="Pending Action Items">
        <PendingActionItemsList
        items={data.pendingActionItems}
          onUpdate={updateAction}
          onAdd={addAction}
          onRemove={removeAction}
        />
      </CollapsibleSubsection>
    </div>
  );
}
