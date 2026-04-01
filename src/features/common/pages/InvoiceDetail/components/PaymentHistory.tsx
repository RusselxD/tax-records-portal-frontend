import { useState, useRef } from "react";
import { ChevronDown, Send, Loader2, Pencil, Upload } from "lucide-react";
import { FilePreviewOverlay, Input, Button } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { invoiceAPI } from "../../../../../api/invoice";
import { fileAPI } from "../../../../../api/file";
import { getErrorMessage } from "../../../../../lib/api-error";
import { validateDocumentFile } from "../../../../../lib/file-validation";
import { useToast } from "../../../../../contexts/ToastContext";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import type { InvoicePaymentResponse, FileItemResponse } from "../../../../../types/invoice";

interface PaymentHistoryProps {
  invoiceId: string;
  clientId: string;
  payments: InvoicePaymentResponse[];
  hasEmailRecipients: boolean;
  onRefresh: () => void;
}

export default function PaymentHistory({ invoiceId, clientId, payments, hasEmailRecipients, onRefresh }: PaymentHistoryProps) {
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
            clientId={clientId}
            payment={payment}
            hasEmailRecipients={hasEmailRecipients}
            onPreview={setPreviewFile}
            onRefresh={onRefresh}
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
  clientId,
  payment,
  hasEmailRecipients,
  onPreview,
  onRefresh,
}: {
  invoiceId: string;
  clientId: string;
  payment: InvoicePaymentResponse;
  hasEmailRecipients: boolean;
  onPreview: (file: FileItemResponse) => void;
  onRefresh: () => void;
}) {
  const { toastSuccess, toastError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  if (isEditing) {
    return (
      <EditPaymentForm
        invoiceId={invoiceId}
        clientId={clientId}
        payment={payment}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => { setIsEditing(false); onRefresh(); }}
      />
    );
  }

  return (
    <div>
      <div
        onClick={hasFiles ? () => setIsOpen(!isOpen) : undefined}
        className={`flex items-center gap-4 px-6 py-4 group ${hasFiles ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50/50"} transition-colors`}
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
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              title="Edit payment"
              className="p-2 text-gray-300 hover:text-accent transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
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

function EditPaymentForm({
  invoiceId,
  clientId,
  payment,
  onCancel,
  onSuccess,
}: {
  invoiceId: string;
  clientId: string;
  payment: InvoicePaymentResponse;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { toastSuccess, toastError } = useToast();
  const [date, setDate] = useState(payment.date);
  const [amount, setAmount] = useState(String(payment.amount));
  const [attachments, setAttachments] = useState<FileItemResponse[]>([...(payment.attachments ?? [])]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedAmount = amount ? parseFloat(amount) : 0;

  const handleFileUpload = async (fileList: FileList) => {
    if (fileList.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const result = validateDocumentFile(file);
        if (!result.valid) {
          toastError(result.error!);
          continue;
        }
        const ref = await fileAPI.upload(clientId, file);
        setAttachments((prev) => [...prev, ref]);
      }
    } catch (err) {
      toastError(getErrorMessage(err, "File upload failed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    const isNew = !payment.attachments.some((a) => a.id === id);
    if (isNew) fileAPI.delete(id).catch(() => {});
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    if (!date || parsedAmount <= 0) return;
    setIsSubmitting(true);
    try {
      await invoiceAPI.updatePayment(invoiceId, payment.id, {
        date,
        amount: parsedAmount,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      toastSuccess("Payment Updated", `Payment of ${formatCurrency(parsedAmount)} has been updated.`);
      onSuccess();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to update payment."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-4 bg-accent/5 border-l-4 border-accent">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Input
          label="Payment Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
        {attachments.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {attachments.map((file) => (
              <FileRow key={file.id} name={file.name} onClick={() => {}} onRemove={() => handleRemoveFile(file.id)} />
            ))}
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
        >
          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {isUploading ? "Uploading..." : "Add file"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFileUpload(e.target.files); e.target.value = ""; }}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSave} isLoading={isSubmitting} disabled={!date || parsedAmount <= 0}>Save</Button>
      </div>
    </div>
  );
}
