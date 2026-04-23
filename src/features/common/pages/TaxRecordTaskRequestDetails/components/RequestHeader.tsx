import BackButton from "../../../../../components/common/BackButton";
import {
  requestStatusLabels,
  requestStatusStyles,
  requestStatusDotColors,
} from "../../../../../constants/tax-record-task-request";
import type { TaxRecordTaskRequestDetailResponse } from "../../../../../types/tax-record-task-request";

interface Props {
  request: TaxRecordTaskRequestDetailResponse;
  onBack: () => void;
}

export default function RequestHeader({ request, onBack }: Props) {
  return (
    <div>
      <BackButton label="Task Requests" onClick={onBack} className="mb-3" />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary truncate">
          {request.taskName}
        </h1>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shrink-0 ${requestStatusStyles[request.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${requestStatusDotColors[request.status]}`} />
          {requestStatusLabels[request.status]}
        </span>
      </div>
    </div>
  );
}
