import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Ban, CreditCard, Send, Loader2 } from "lucide-react";
import { ConfirmActionModal } from "../../../../../components/common";
import { useToast } from "../../../../../contexts/ToastContext";
import { invoiceAPI } from "../../../../../api/invoice";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import { INVOICE_STATUS } from "../../../../../types/invoice";
import type { InvoiceListItemResponse } from "../../../../../types/invoice";
import InvoiceStatusBadge from "../../../../../components/common/InvoiceStatusBadge";

interface BillingsTableProps {
  invoices: InvoiceListItemResponse[];
  onRefresh: () => void;
}

export default function BillingsTable({ invoices, onRefresh }: BillingsTableProps) {
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
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No.</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
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
                <td className="px-4 py-3 font-medium text-primary max-w-[200px] truncate">{inv.clientName}</td>
                <td className="px-4 py-3 text-gray-600">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoiceDate)}</td>
                <td className="px-4 py-3 text-gray-600">{inv.termsName}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(inv.amountDue)}</td>
                <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(inv.balance)}</td>
                <td className="px-4 py-3 text-center"><InvoiceStatusBadge status={inv.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSendEmail(inv)}
                      disabled={isVoid || !inv.hasEmailRecipients || sendingId === inv.id}
                      title={!inv.hasEmailRecipients ? "No client accounts to send to" : inv.emailSent ? "Resend invoice email" : "Send invoice email"}
                      className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                      className="p-1.5 rounded-md text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVoidTarget(inv)}
                      disabled={isVoid}
                      title="Void Invoice"
                      className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(inv)}
                      title="Delete Invoice"
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
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
