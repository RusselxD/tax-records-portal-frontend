import { Plus } from "lucide-react";
import { Input, Button } from "../../../../../../../components/common";
import type {
  OnboardingDetails,
  OnboardingMeetingEntry,
  PendingActionItem,
} from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import MeetingEntryForm from "./components/MeetingEntryForm";
import PendingActionItemsList from "./components/PendingActionItemsList";

function emptyMeeting(): OnboardingMeetingEntry {
  return {
    titleOfMeeting: null,
    date: null,
    timeStarted: null,
    timeEnded: null,
    agenda: null,
    linkToMeetingRecording: null,
    minutes: { type: "doc", content: [] },
  };
}

function emptyActionItem(): PendingActionItem {
  return { particulars: null, notes: null };
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

  const updateMeeting = (
    index: number,
    fields: Partial<OnboardingMeetingEntry>,
  ) => {
    const updated = data.meetings.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    update({ meetings: updated });
  };

  const addMeeting = () =>
    update({ meetings: [...data.meetings, emptyMeeting()] });

  const removeMeeting = (index: number) =>
    update({ meetings: data.meetings.filter((_, i) => i !== index) });

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
      pendingActionItems: data.pendingActionItems.filter(
        (_, i) => i !== index,
      ),
    });

  return (
    <div className="space-y-8">
      {/* Group Chat Info */}
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">
          Group Chat Details
        </h3>
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
      </div>

      {/* Meetings */}
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Meetings</h3>
        <div className="space-y-4">
          {data.meetings.map((meeting, index) => (
            <MeetingEntryForm
              key={index}
              meeting={meeting}
              index={index}
              onUpdate={updateMeeting}
              onRemove={removeMeeting}
            />
          ))}
          <Button variant="secondary" onClick={addMeeting}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Meeting
          </Button>
        </div>
      </div>

      <PendingActionItemsList
        items={data.pendingActionItems}
        onUpdate={updateAction}
        onAdd={addAction}
        onRemove={removeAction}
      />
    </div>
  );
}
