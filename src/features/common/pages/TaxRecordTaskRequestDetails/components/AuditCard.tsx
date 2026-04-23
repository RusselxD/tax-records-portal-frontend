import { formatDateTime } from "../../../../../lib/formatters";
import type { TaxRecordTaskRequestDetailResponse } from "../../../../../types/tax-record-task-request";

interface BlockProps {
  label: string;
  name: string;
  at: string;
}

function AuditBlock({ label, name, at }: BlockProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-primary">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(at)}</p>
    </div>
  );
}

export default function AuditCard({ request }: { request: TaxRecordTaskRequestDetailResponse }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5 space-y-4">
      <AuditBlock
        label="Requested By"
        name={request.requester.name}
        at={request.submittedAt}
      />

      {request.decidedAt && (
        <div className="pt-4 border-t border-gray-100">
          <AuditBlock
            label="Decided By"
            name={request.decidedBy?.name ?? "—"}
            at={request.decidedAt}
          />
        </div>
      )}
    </div>
  );
}
