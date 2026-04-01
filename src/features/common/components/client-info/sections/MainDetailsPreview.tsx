import type { MainDetails, AssignedAccountant } from "../../../../../types/client-info";
import { TAXPAYER_CLASSIFICATION_LABELS } from "../enum-labels";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <TextDisplay label="MRE Code" value={data.mreCode} />
        <DateFieldDisplay label="Commencement of Work" value={data.commencementOfWork} />
        <EnumDisplay
          label="Taxpayer Classification"
          value={classification}
          labels={TAXPAYER_CLASSIFICATION_LABELS}
        />
      </div>

      {(assignedCsdOos.length > 0 || assignedQtd.length > 0) && (
        <>
          <SubsectionHeading label="Assigned Accountants" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {assignedCsdOos.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Assigned OOS / CSD Accountants
                </p>
                <ul className="space-y-2.5">
                  {assignedCsdOos.map((a) => (
                    <li key={a.id}>
                      <p className="text-sm text-primary font-medium leading-relaxed">{a.displayName}</p>
                      <p className="text-xs text-gray-400">{[a.position, a.role].filter(Boolean).join(" · ")}</p>
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
                <ul className="space-y-2.5">
                  {assignedQtd.map((a) => (
                    <li key={a.id}>
                      <p className="text-sm text-primary font-medium leading-relaxed">{a.displayName}</p>
                      <p className="text-xs text-gray-400">{[a.position, a.role].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
