import type { ReactNode } from "react";
import { periodLabels } from "../../../../../constants/tax-record-task";
import type { TaxRecordTaskRequestDetailResponse } from "../../../../../types/tax-record-task-request";

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="text-sm text-primary">{children}</dd>
    </div>
  );
}

export default function ProposedTaskCard({ request }: { request: TaxRecordTaskRequestDetailResponse }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-primary mb-4">Proposed Task</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <Field label="Client">{request.clientDisplayName}</Field>
        <Field label="Year / Period">
          {request.year} &middot; {periodLabels[request.period] ?? request.period}
        </Field>
        <Field label="Category">{request.categoryName}</Field>
        <Field label="Sub Category">{request.subCategoryName}</Field>
        <Field label="Task Name" wide>
          {request.taskName}
        </Field>
      </dl>
    </div>
  );
}
