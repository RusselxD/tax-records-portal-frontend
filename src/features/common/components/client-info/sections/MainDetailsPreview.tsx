import type { MainDetails, AssignedAccountant } from "../../../../../types/client-info";
import { ENGAGEMENT_STATUS_LABELS, TAXPAYER_CLASSIFICATION_LABELS } from "../enum-labels";
import { TextDisplay, DateFieldDisplay, EnumDisplay } from "../field-displays";
import SubsectionHeading from "./SubsectionHeading";

interface MainDetailsPreviewProps {
  data: MainDetails;
  classification?: string | null;
  assignedCsdOos: AssignedAccountant[];
  assignedQtd: AssignedAccountant[];
}

export default function MainDetailsPreview({
  data,
  classification,
  assignedCsdOos,
  assignedQtd,
}: MainDetailsPreviewProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <TextDisplay label="MRE Code" value={data.mreCode} />
        <DateFieldDisplay label="Commencement of Work" value={data.commencementOfWork} />
        <EnumDisplay
          label="Engagement Status"
          value={data.engagementStatus}
          labels={ENGAGEMENT_STATUS_LABELS}
        />
        <EnumDisplay
          label="Taxpayer Classification"
          value={classification}
          labels={TAXPAYER_CLASSIFICATION_LABELS}
        />
      </div>

      {(assignedCsdOos.length > 0 || assignedQtd.length > 0) && (
        <>
          <SubsectionHeading label="Assigned Accountants" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {assignedCsdOos.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Assigned OOS / CSD Accountants
                </p>
                <ul className="space-y-1">
                  {assignedCsdOos.map((a) => (
                    <li key={a.id} className="text-sm text-primary leading-relaxed">
                      {a.displayName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assignedQtd.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Assigned QTD Accountant
                </p>
                <p className="text-sm text-primary leading-relaxed">
                  {assignedQtd.map((a) => a.displayName).join(", ")}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
