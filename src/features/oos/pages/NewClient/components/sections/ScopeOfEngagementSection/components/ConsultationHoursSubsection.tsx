import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../../../../../../components/common";
import type {
  ScopeOfEngagementDetails,
  ConsultationEntry,
  RichTextContent,
} from "../../../../../../../../types/client-info";
import DateFieldInput from "../../DateFieldInput";
import RichTextEditor from "../../RichTextEditor";

interface ConsultationHoursSubsectionProps {
  data: ScopeOfEngagementDetails;
  onUpdate: (fields: Partial<ScopeOfEngagementDetails>) => void;
}

export default function ConsultationHoursSubsection({
  data,
  onUpdate,
}: ConsultationHoursSubsectionProps) {
  const updateConsultation = (
    index: number,
    fields: Partial<ConsultationEntry>,
  ) => {
    const updated = data.consultationHours.consultations.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onUpdate({
      consultationHours: { ...data.consultationHours, consultations: updated },
    });
  };

  const addConsultation = () =>
    onUpdate({
      consultationHours: {
        ...data.consultationHours,
        consultations: [
          ...data.consultationHours.consultations,
          {
            date: null,
            timeStarted: null,
            timeEnded: null,
            topicsAndDocumentation: { type: "doc", content: [] },
            numberOfHours: null,
            platform: null,
            amount: null,
            vat: null,
          },
        ],
      },
    });

  const removeConsultation = (index: number) =>
    onUpdate({
      consultationHours: {
        ...data.consultationHours,
        consultations: data.consultationHours.consultations.filter(
          (_, i) => i !== index,
        ),
      },
    });

  return (
    <div>
      <h4 className="text-sm font-medium text-primary mb-3">
        Consultation Hours
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Free Hours / Month"
            type="number"
            value={data.consultationHours.freeHoursPerMonth ?? ""}
            onChange={(e) =>
              onUpdate({
                consultationHours: {
                  ...data.consultationHours,
                  freeHoursPerMonth: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                },
              })
            }
            placeholder="0"
          />
          <Input
            label="Rate / Hour (After Free)"
            type="number"
            value={data.consultationHours.ratePerHourAfterFree ?? ""}
            onChange={(e) =>
              onUpdate({
                consultationHours: {
                  ...data.consultationHours,
                  ratePerHourAfterFree: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                },
              })
            }
            placeholder="₱0.00"
          />
          <Input
            label="Total Billable Amount"
            type="number"
            value={data.consultationHours.totalBillableAmount ?? ""}
            onChange={(e) =>
              onUpdate({
                consultationHours: {
                  ...data.consultationHours,
                  totalBillableAmount: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                },
              })
            }
            placeholder="₱0.00"
          />
        </div>

        {data.consultationHours.consultations.map((entry, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-primary">
                Consultation #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeConsultation(index)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <DateFieldInput
                  label="Date"
                  value={entry.date}
                  onChange={(v) =>
                    updateConsultation(index, { date: v })
                  }
                />
                <Input
                  label="Time Started"
                  type="time"
                  value={entry.timeStarted ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      timeStarted: e.target.value || null,
                    })
                  }
                />
                <Input
                  label="Time Ended"
                  type="time"
                  value={entry.timeEnded ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      timeEnded: e.target.value || null,
                    })
                  }
                />
                <Input
                  label="Hours"
                  type="number"
                  value={entry.numberOfHours ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      numberOfHours: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Platform"
                  value={entry.platform ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      platform: e.target.value || null,
                    })
                  }
                  placeholder="e.g. Zoom, Google Meet"
                />
                <Input
                  label="Amount"
                  type="number"
                  value={entry.amount ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      amount: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="₱0"
                />
                <Input
                  label="VAT"
                  type="number"
                  value={entry.vat ?? ""}
                  onChange={(e) =>
                    updateConsultation(index, {
                      vat: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="₱0.00"
                />
              </div>
              <RichTextEditor
                label="Topics & Documentation"
                value={entry.topicsAndDocumentation}
                onChange={(v: RichTextContent) =>
                  updateConsultation(index, { topicsAndDocumentation: v })
                }
              />
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={addConsultation}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Consultation
        </Button>
      </div>
    </div>
  );
}
