import { useState } from "react";
import { ChevronDown, Send, Loader2 } from "lucide-react";
import { FilePreviewOverlay } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { invoiceAPI } from "../../../../../api/invoice";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import type { InvoicePaymentResponse, FileItemResponse } from "../../../../../types/invoice";

interface PaymentHistoryProps {
  invoiceId: string;
  payments: InvoicePaymentResponse[];
  hasEmailRecipients: boolean;
}

export default function PaymentHistory({ invoiceId, payments, hasEmailRecipients }: PaymentHistoryProps) {
  const [previewFile, setPreviewFile] = useState<FileItemResponse | null>(null);

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-primary mb-3">Payment History</h3>
        <p className="text-sm text-gray-400">No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-primary">Payment History</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <PaymentRow
            key={payment.id}
            invoiceId={invoiceId}
            payment={payment}
            hasEmailRecipients={hasEmailRecipients}
            onPreview={setPreviewFile}
          />
        ))}
      </div>

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

function PaymentRow({
  invoiceId,
  payment,
  hasEmailRecipients,
  onPreview,
}: {
  invoiceId: string;
  payment: InvoicePaymentResponse;
  hasEmailRecipients: boolean;
  onPreview: (file: FileItemResponse) => void;
}) {
  const { toastSuccess, toastError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(payment.emailSent);
  const hasFiles = (payment.attachments?.length ?? 0) > 0;

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSending) return;
    setIsSending(true);
    try {
      await invoiceAPI.sendPaymentEmail(invoiceId, payment.id);
      setSent(true);
      toastSuccess("Payment Receipt Sent", "The payment receipt has been emailed to the client.");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to send payment receipt."));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div
        onClick={hasFiles ? () => setIsOpen(!isOpen) : undefined}
        className={`flex items-center gap-4 px-6 py-4 ${hasFiles ? "cursor-pointer hover:bg-gray-50" : ""} transition-colors`}
      >
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700">{formatDate(payment.date)}</span>
            {hasFiles && (
              <span className="text-xs text-gray-400">
                {payment.attachments.length} file{payment.attachments.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{formatCurrency(payment.amount)}</span>
            {hasEmailRecipients && (
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSending}
                title={sent ? "Resend payment receipt" : "Send payment receipt"}
                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30"
              >
                {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
        {hasFiles && (
          <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
        )}
      </div>

      {isOpen && hasFiles && (
        <div className="px-6 pb-4">
          <div className="space-y-1.5">
            {payment.attachments.map((file) => (
              <FileRow key={file.id} name={file.name} onClick={() => onPreview(file)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
