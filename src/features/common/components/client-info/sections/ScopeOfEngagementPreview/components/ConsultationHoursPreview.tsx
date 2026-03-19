import { formatDate } from "../../../../../../../lib/formatters";
import type { ConsultationHoursDetails, ConsultationEntry } from "../../../../../../../types/client-info";
import { TextDisplay, RichTextPreview } from "../../../field-displays";

function entryHasData(e: ConsultationEntry): boolean {
  return !!(
    e.date?.date ||
    e.timeStarted ||
    e.timeEnded ||
    e.numberOfHours ||
    e.platform ||
    e.amount !== null ||
    e.vat !== null ||
    (e.topicsAndDocumentation?.content && e.topicsAndDocumentation.content.length > 0)
  );
}

export default function ConsultationHoursPreview({ data }: { data: ConsultationHoursDetails }) {
  const filledEntries = data.consultations.filter(entryHasData);
  const hasHeader = !!(
    data.freeHoursPerMonth !== null ||
    data.ratePerHourAfterFree !== null ||
    data.totalBillableAmount !== null
  );

  if (!hasHeader && filledEntries.length === 0) return null;

  return (
    <div className="space-y-4">
      {hasHeader && (
        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
          <TextDisplay label="Free Hours / Month" value={data.freeHoursPerMonth} />
          <TextDisplay label="Rate / Hour After Free" value={data.ratePerHourAfterFree} />
          <TextDisplay label="Total Billable Amount" value={data.totalBillableAmount} />
        </div>
      )}

      {filledEntries.length > 0 && (
        <div className="space-y-3">
          {filledEntries.map((entry, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
            >
              <span className="text-sm font-semibold text-primary mb-3 block">
                Consultation #{i + 1}
              </span>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <TextDisplay
                  label="Date"
                  value={entry.date?.date ? formatDate(entry.date.date) : null}
                />
                <TextDisplay label="Time Started" value={entry.timeStarted} />
                <TextDisplay label="Time Ended" value={entry.timeEnded} />
                <TextDisplay label="Number of Hours" value={entry.numberOfHours} />
                <TextDisplay label="Platform" value={entry.platform} />
                <TextDisplay label="Amount" value={entry.amount} />
                <TextDisplay label="VAT" value={entry.vat} />
                <RichTextPreview label="Topics & Documentation" value={entry.topicsAndDocumentation} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
