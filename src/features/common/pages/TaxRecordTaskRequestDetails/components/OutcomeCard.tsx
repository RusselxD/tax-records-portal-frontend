import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  TAX_RECORD_TASK_REQUEST_STATUS,
  type TaxRecordTaskRequestDetailResponse,
} from "../../../../../types/tax-record-task-request";

interface Props {
  request: TaxRecordTaskRequestDetailResponse;
  taskLinkPath: string;
}

export default function OutcomeCard({ request, taskLinkPath }: Props) {
  if (request.status === TAX_RECORD_TASK_REQUEST_STATUS.REJECTED) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-5">
        <h3 className="text-sm font-bold text-red-700 mb-2">Rejection Reason</h3>
        {request.rejectionReason ? (
          <p className="text-sm text-red-700 whitespace-pre-wrap leading-relaxed">
            {request.rejectionReason}
          </p>
        ) : (
          <p className="text-sm text-red-700/70 italic">No reason provided.</p>
        )}
      </div>
    );
  }

  if (
    request.status === TAX_RECORD_TASK_REQUEST_STATUS.APPROVED &&
    request.resultingTaskId
  ) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-5">
        <h3 className="text-sm font-bold text-emerald-700 mb-2">Approved</h3>
        <p className="text-sm text-emerald-700 mb-3">
          A tax record task has been created from this request.
        </p>
        <Link
          to={taskLinkPath}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          View Task
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return null;
}
