import type {
  OnboardingDetails,
  OnboardingMeetingEntry,
  PendingActionItem,
} from "../../../../../types/client-info";
import {
  TextDisplay,
  DateFieldDisplay,
  LinkDisplay,
  RichTextPreview,
} from "../field-displays";
import SubsectionHeading from "./SubsectionHeading";

function meetingHasData(m: OnboardingMeetingEntry): boolean {
  return !!(
    m.titleOfMeeting ||
    m.date?.date ||
    m.timeStarted ||
    m.timeEnded ||
    m.agenda ||
    m.linkToMeetingRecording?.url ||
    (m.minutes?.content && m.minutes.content.length > 0)
  );
}

function actionItemHasData(item: PendingActionItem): boolean {
  return !!(item.particulars || item.notes);
}

function MeetingCard({ meeting, index }: { meeting: OnboardingMeetingEntry; index: number }) {
  if (!meetingHasData(meeting)) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <span className="text-sm font-semibold text-primary mb-3 block">
        Meeting #{index + 1}
      </span>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <TextDisplay label="Title" value={meeting.titleOfMeeting} />
        <DateFieldDisplay label="Date" value={meeting.date} />
        <TextDisplay label="Time Started" value={meeting.timeStarted} />
        <TextDisplay label="Time Ended" value={meeting.timeEnded} />
        <TextDisplay label="Agenda" value={meeting.agenda} fullWidth />
        <LinkDisplay label="Link to Meeting Recording" value={meeting.linkToMeetingRecording} />
        <RichTextPreview label="Minutes" value={meeting.minutes} />
      </div>
    </div>
  );
}

export default function OnboardingDetailsPreview({ data }: { data: OnboardingDetails }) {
  const hasGroupChat = !!(
    data.nameOfGroupChat ||
    data.platformUsed ||
    data.gcCreatedBy ||
    data.gcCreatedDate?.date
  );
  const hasMeetings = data.meetings.some(meetingHasData);
  const hasActionItems = data.pendingActionItems.some(actionItemHasData);

  if (!hasGroupChat && !hasMeetings && !hasActionItems) return null;

  return (
    <div className="space-y-6">
        {hasGroupChat && (
          <div>
            <SubsectionHeading label="Group Chat Details" />
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
              <TextDisplay label="Name of Group Chat" value={data.nameOfGroupChat} />
              <TextDisplay label="Platform Used" value={data.platformUsed} />
              <TextDisplay label="Created By" value={data.gcCreatedBy} />
              <DateFieldDisplay label="Created Date" value={data.gcCreatedDate} />
            </div>
          </div>
        )}

        {hasMeetings && (
          <div>
            <SubsectionHeading label="Meetings" />
            <div className="mt-4 space-y-3">
              {data.meetings.map((meeting, i) => (
                <MeetingCard key={i} meeting={meeting} index={i} />
              ))}
            </div>
          </div>
        )}

        {hasActionItems && (
          <div>
            <SubsectionHeading label="Pending Action Items" />
            <div className="mt-4 overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-gray-200">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Particulars
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingActionItems.filter(actionItemHasData).map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                    >
                      <td className="px-4 py-2.5 text-sm text-primary">
                        {item.particulars}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-primary">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
