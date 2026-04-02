import { useState } from "react";
import { FilePreviewOverlay } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import type { FileItemResponse } from "../../../../../types/invoice";
import type { InvoiceDetailResponse } from "../../../../../types/invoice";
import InvoiceStatusBadge from "../../../../../components/common/InvoiceStatusBadge";

export default function InvoiceInfo({ invoice }: { invoice: InvoiceDetailResponse }) {
  const [previewFile, setPreviewFile] = useState<FileItemResponse | null>(null);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-primary truncate">{invoice.invoiceNumber}</h2>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{invoice.clientName}</p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
        <Field label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
        <Field label="Terms" value={invoice.terms.name} />
        <Field label="Due Date" value={formatDate(invoice.dueDate)} />
        <Field label="Description" value={invoice.description || "—"} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-5 pt-5 border-t border-gray-100">
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Amount Due</p>
          <p className="text-lg font-semibold text-primary">{formatCurrency(invoice.amountDue)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Balance</p>
          <p className="text-lg font-semibold text-primary">{formatCurrency(invoice.balance)}</p>
        </div>
      </div>

      {invoice.attachments?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Attachments</p>
          <div className="space-y-1.5">
            {invoice.attachments.map((file) => (
              <FileRow key={file.id} name={file.name} onClick={() => setPreviewFile(file)} />
            ))}
          </div>
        </div>
      )}

      {previewFile && (
        <FilePreviewOverlay
          fileId={previewFile.id}
          fileName={previewFile.name}
          setModalOpen={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-primary leading-relaxed">{value}</p>
    </div>
  );
}
