import { Trash2 } from "lucide-react";
import { Input } from "../../../../../../../../components/common";
import type { OnboardingMeetingEntry } from "../../../../../../../../types/client-info";
import DateFieldInput from "../../DateFieldInput";
import RichTextEditor from "../../RichTextEditor";

interface MeetingEntryFormProps {
  meeting: OnboardingMeetingEntry;
  index: number;
  onUpdate: (index: number, fields: Partial<OnboardingMeetingEntry>) => void;
  onRemove: (index: number) => void;
}

export default function MeetingEntryForm({
  meeting,
  index,
  onUpdate,
  onRemove,
}: MeetingEntryFormProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-primary">
          Meeting #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4">
        <Input
          label="Title of Meeting"
          value={meeting.titleOfMeeting ?? ""}
          onChange={(e) =>
            onUpdate(index, {
              titleOfMeeting: e.target.value || null,
            })
          }
          placeholder="Meeting title"
        />
        <div className="grid grid-cols-3 gap-4">
          <DateFieldInput
            label="Date"
            value={meeting.date}
            onChange={(v) => onUpdate(index, { date: v })}
          />
          <Input
            label="Time Started"
            type="time"
            value={meeting.timeStarted ?? ""}
            onChange={(e) =>
              onUpdate(index, {
                timeStarted: e.target.value || null,
              })
            }
          />
          <Input
            label="Time Ended"
            type="time"
            value={meeting.timeEnded ?? ""}
            onChange={(e) =>
              onUpdate(index, {
                timeEnded: e.target.value || null,
              })
            }
          />
        </div>
        <Input
          label="Agenda"
          value={meeting.agenda ?? ""}
          onChange={(e) =>
            onUpdate(index, { agenda: e.target.value || null })
          }
          placeholder="Meeting agenda"
        />
        <Input
          label="Link to Meeting Recording"
          value={meeting.linkToMeetingRecording?.url ?? ""}
          onChange={(e) =>
            onUpdate(index, {
              linkToMeetingRecording: e.target.value
                ? {
                    url: e.target.value,
                    label:
                      meeting.linkToMeetingRecording?.label ??
                      "Recording",
                  }
                : null,
            })
          }
          placeholder="https://..."
        />
        <RichTextEditor
          label="Minutes"
          value={meeting.minutes}
          onChange={(v) => onUpdate(index, { minutes: v })}
          placeholder="Meeting minutes..."
        />
      </div>
    </div>
  );
}
