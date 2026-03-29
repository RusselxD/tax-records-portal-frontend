import { useState, useCallback, useRef, type FormEvent } from "react";
import { Upload, Loader2, CreditCard } from "lucide-react";
import { Input, Button, ConfirmActionModal } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { FilePreviewOverlay } from "../../../../../components/common";
import { invoiceAPI } from "../../../../../api/invoice";
import { fileAPI } from "../../../../../api/file";
import { formatCurrency } from "../../../../../lib/formatters";
import { useToast } from "../../../../../contexts/ToastContext";
import { validateDocumentFile } from "../../../../../lib/file-validation";
import type { FileItemResponse } from "../../../../../types/invoice";

interface ReceivePaymentFormProps {
  invoiceId: string;
  clientId: string;
  balance: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReceivePaymentForm({
  invoiceId,
  clientId,
  balance,
  onSuccess,
  onCancel,
}: ReceivePaymentFormProps) {
  const { toastSuccess, toastError } = useToast();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [attachments, setAttachments] = useState<FileItemResponse[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ date?: string; amount?: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItemResponse | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedAmount = amount ? parseFloat(amount) : 0;
  const remainingBalance = balance - parsedAmount;
  const isOverpayment = parsedAmount > balance;

  const handleFileUpload = async (fileList: FileList) => {
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
    } catch {
      // silently fail
    } finally {
      setIsUploading(false);
    }
  };

  const cleanupFiles = useCallback((files: FileItemResponse[]) => {
    files.forEach((f) => fileAPI.delete(f.id).catch(() => {}));
  }, []);

  const handleRemoveFile = (id: string) => {
    const removed = attachments.find((f) => f.id === id);
    if (removed) fileAPI.delete(removed.id).catch(() => {});
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCancel = () => {
    cleanupFiles(attachments);
    onCancel();
  };

  const validate = () => {
    const errors: { date?: string; amount?: string } = {};
    if (!date) errors.date = "Payment date is required.";
    if (!amount || !amount.trim()) {
      errors.amount = "Amount is required.";
    } else if (parsedAmount <= 0) {
      errors.amount = "Amount must be greater than zero.";
    }
    return errors;
  };

  const handleSubmitClick = (e: FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    await invoiceAPI.receivePayment(invoiceId, {
      date,
      amount: parsedAmount,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    toastSuccess("Payment Recorded", `${formatCurrency(parsedAmount)} payment has been recorded.`);
    onSuccess();
  };

  return (
    <div className="bg-white border-2 border-accent/30 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-accent/20 bg-accent/5">
        <CreditCard className="h-5 w-5 text-accent" />
        <h3 className="text-base font-bold text-primary">Receive Payment</h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmitClick} className="space-y-4">
          {/* Balance cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(balance)}</p>
            </div>
            <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Remaining After Payment</p>
              <p className={`text-lg font-semibold ${remainingBalance < 0 ? "text-amber-600" : "text-primary"}`}>
                {formatCurrency(remainingBalance)}
              </p>
            </div>
          </div>

          {/* Date + Amount */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Date"
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setFieldErrors((p) => ({ ...p, date: undefined })); }}
              error={fieldErrors.date}
            />
            <div>
              <Input
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setFieldErrors((p) => ({ ...p, amount: undefined })); }}
                placeholder="0.00"
                error={fieldErrors.amount}
              />
              {parsedAmount > 0 && (
                <p className="mt-1 text-sm font-medium text-accent">{formatCurrency(parsedAmount)}</p>
              )}
            </div>
          </div>

          {isOverpayment && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
              <p className="text-xs text-amber-700">
                This amount exceeds the outstanding balance. An overpayment of {formatCurrency(parsedAmount - balance)} will be recorded.
              </p>
            </div>
          )}

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supporting Files <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files); }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 cursor-pointer transition-colors ${
                dragging ? "border-accent bg-accent/5" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-gray-400" />
              )}
              <p className="text-sm text-gray-500">
                {isUploading ? "Uploading..." : <>Drag & drop or <span className="text-accent font-medium">browse</span></>}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-1.5">
              {attachments.map((file) => (
                <FileRow
                  key={file.id}
                  name={file.name}
                  onClick={() => setPreviewFile(file)}
                  onRemove={() => handleRemoveFile(file.id)}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Record Payment
            </Button>
          </div>
        </form>
      </div>

      {previewFile && (
        <FilePreviewOverlay
          fileId={previewFile.id}
          fileName={previewFile.name}
          setModalOpen={() => setPreviewFile(null)}
        />
      )}

      {showConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowConfirm}
          onConfirm={handleConfirm}
          title="Confirm Payment"
          description={`Record a payment of ${formatCurrency(parsedAmount)} for this invoice?`}
          confirmLabel="Confirm Payment"
          loadingLabel="Recording..."
          onSuccess={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
