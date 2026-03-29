import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Ban, CreditCard, Send, Loader2, AlertTriangle } from "lucide-react";
import { ConfirmActionModal, Button } from "../../../../../components/common";
import Dropdown from "../../../../../components/common/Dropdown";
import { useToast } from "../../../../../contexts/ToastContext";
import { invoiceAPI } from "../../../../../api/invoice";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import { INVOICE_STATUS } from "../../../../../types/invoice";
import type { InvoiceListItemResponse } from "../../../../../types/invoice";
import type { DropdownOption } from "../../../../../components/common/Dropdown";
import InvoiceStatusBadge from "../../../../../components/common/InvoiceStatusBadge";

const STATUS_OPTIONS: DropdownOption[] = [
  { label: "All Statuses", value: "" },
  { label: "Unpaid", value: "UNPAID" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
  { label: "Fully Paid", value: "FULLY_PAID" },
  { label: "Void", value: "VOID" },
];

interface BillingsTableProps {
  invoices: InvoiceListItemResponse[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  clientOptions: DropdownOption[];
  clientFilter: string;
  onClientFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

export default function BillingsTable({
  invoices,
  isLoading,
  error,
  onRefresh,
  clientOptions,
  clientFilter,
  onClientFilterChange,
  statusFilter,
  onStatusFilterChange,
}: BillingsTableProps) {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<InvoiceListItemResponse | null>(null);
  const [voidTarget, setVoidTarget] = useState<InvoiceListItemResponse | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendEmail = async (inv: InvoiceListItemResponse) => {
    if (sendingId) return;
    setSendingId(inv.id);
    try {
      await invoiceAPI.sendEmail(inv.id);
      toastSuccess("Invoice Sent", "The invoice has been emailed to the client.");
      onRefresh();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to send invoice email."));
    } finally {
      setSendingId(null);
    }
  };

  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-4 py-3 w-[22%]">
              <Dropdown
                headerStyle
                portal
                options={clientOptions}
                value={clientFilter}
                onChange={onClientFilterChange}
                placeholder="Client"
              />
            </th>
            <th className="text-left px-4 py-3 w-[12%]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice No.</span>
            </th>
            <th className="text-left px-4 py-3 w-[10%]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date</span>
            </th>
            <th className="text-left px-4 py-3 w-[10%]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Due Date</span>
            </th>
            <th className="text-right px-4 py-3 w-[14%]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Balance</span>
            </th>
            <th className="text-center px-4 py-3 w-[14%]">
              <Dropdown
                headerStyle
                portal
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={onStatusFilterChange}
                placeholder="Status"
              />
            </th>
            <th className="text-right px-4 py-3 w-[14%]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</span>
            </th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="px-4 py-4"><div className="h-4 w-24 rounded skeleton" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : error ? (
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <AlertTriangle className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">{error}</p>
                <Button variant="secondary" onClick={onRefresh}>Retry</Button>
              </td>
            </tr>
          </tbody>
        ) : invoices.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">
                No invoices found.
              </td>
            </tr>
          </tbody>
        ) : (
        <tbody className="divide-y divide-gray-100">
          {invoices.map((inv) => {
            const isVoid = inv.status === INVOICE_STATUS.VOID;
            const isFullyPaid = inv.status === INVOICE_STATUS.FULLY_PAID;
            return (
              <tr
                key={inv.id}
                onClick={() => navigate(`/internal-billing/billings/${inv.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-primary max-w-0">
                  <span className="block truncate" title={inv.clientName}>{inv.clientName}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoiceDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(inv.balance)}</td>
                <td className="px-4 py-3 text-center"><InvoiceStatusBadge status={inv.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSendEmail(inv)}
                      disabled={isVoid || !inv.hasEmailRecipients || sendingId === inv.id}
                      title={!inv.hasEmailRecipients ? "No client accounts to send to" : inv.emailSent ? "Resend invoice email" : "Send invoice email"}
                      className="p-1.5 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {sendingId === inv.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/internal-billing/billings/${inv.id}`)}
                      disabled={isVoid || isFullyPaid}
                      title="Receive Payment"
                      className="p-1.5 rounded-md text-accent bg-accent/10 hover:bg-accent/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVoidTarget(inv)}
                      disabled={isVoid}
                      title="Void Invoice"
                      className="p-1.5 rounded-md text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(inv)}
                      title="Delete Invoice"
                      className="p-1.5 rounded-md text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        )}
      </table>

      {deleteTarget && (
        <ConfirmActionModal
          setModalOpen={() => setDeleteTarget(null)}
          onConfirm={() => invoiceAPI.deleteInvoice(deleteTarget.id)}
          title="Delete Invoice"
          description={`This will permanently remove invoice ${deleteTarget.invoiceNumber} and all its payment records. This action cannot be undone.`}
          confirmLabel="Delete Invoice"
          loadingLabel="Deleting..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onSuccess={() => { setDeleteTarget(null); onRefresh(); }}
        />
      )}

      {voidTarget && (
        <ConfirmActionModal
          setModalOpen={() => setVoidTarget(null)}
          onConfirm={() => invoiceAPI.voidInvoice(voidTarget.id)}
          title="Void Invoice"
          description={`This will mark invoice ${voidTarget.invoiceNumber} as void. The invoice will remain on record but no further payments can be applied.`}
          confirmLabel="Void Invoice"
          loadingLabel="Voiding..."
          confirmClassName="bg-amber-600 hover:bg-amber-700"
          onSuccess={() => { setVoidTarget(null); onRefresh(); }}
        />
      )}
    </>
  );
}
