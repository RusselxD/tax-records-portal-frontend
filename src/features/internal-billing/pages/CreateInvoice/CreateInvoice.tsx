import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Upload, Loader2 } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { Input, Dropdown, Button, Alert, FilePreviewOverlay, ConfirmActionModal } from "../../../../components/common";
import { useToast } from "../../../../contexts/ToastContext";
import FileRow from "../../../../components/common/FileRow";
import { invoiceAPI } from "../../../../api/invoice";
import { clientAPI } from "../../../../api/client";
import { fileAPI } from "../../../../api/file";
import { getErrorMessage, isConflictError } from "../../../../lib/api-error";
import { validateDocumentFile } from "../../../../lib/file-validation";
import { formatDate, formatCurrency } from "../../../../lib/formatters";
import type { InvoiceTermResponse, FileItemResponse } from "../../../../types/invoice";
import type { LookupResponse } from "../../../../types/tax-record-task";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function CreateInvoice() {
  usePageTitle("Create Invoice");
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const [searchParams] = useSearchParams();
  const prefilledClientId = searchParams.get("clientId") || "";

  const [clients, setClients] = useState<LookupResponse[]>([]);
  const [terms, setTerms] = useState<InvoiceTermResponse[]>([]);

  const [clientId, setClientId] = useState(prefilledClientId);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [termsId, setTermsId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [attachments, setAttachments] = useState<FileItemResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItemResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAddTerm, setShowAddTerm] = useState(false);
  const [newTermName, setNewTermName] = useState("");
  const [newTermDays, setNewTermDays] = useState("");
  const [isAddingTerm, setIsAddingTerm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [c, t] = await Promise.all([
          clientAPI.getActiveClients(),
          invoiceAPI.getTerms(),
        ]);
        if (cancelled) return;
        setClients(c);
        setTerms(t);
      } catch (err) {
        console.warn("Failed to load invoice form data", err);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const selectedTerm = terms.find((t) => String(t.id) === termsId);
  const computedDueDate = invoiceDate && selectedTerm
    ? addDays(invoiceDate, selectedTerm.days)
    : null;

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.displayName }));
  const termOptions = [
    ...terms.map((t) => ({ value: String(t.id), label: t.name })),
    { value: "__add_new__", label: "+ Add new term" },
  ];

  const handleTermChange = (value: string) => {
    if (value === "__add_new__") {
      setShowAddTerm(true);
      return;
    }
    setTermsId(value);
  };

  const handleAddTerm = async () => {
    if (!newTermName.trim() || !newTermDays) return;
    setIsAddingTerm(true);
    try {
      const created = await invoiceAPI.createTerm({
        name: newTermName.trim(),
        days: parseInt(newTermDays),
      });
      setTerms((prev) => [...prev, created]);
      setTermsId(String(created.id));
      setShowAddTerm(false);
      setNewTermName("");
      setNewTermDays("");
    } catch (err) {
      if (isConflictError(err)) {
        setError("A term with that name already exists.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsAddingTerm(false);
    }
  };

  const uploadFile = useCallback(
    (file: File) => fileAPI.upload(clientId, file),
    [clientId],
  );

  const handleDropFiles = async (fileList: FileList) => {
    if (!clientId || fileList.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const result = validateDocumentFile(file);
        if (!result.valid) {
          toastError(result.error!);
          continue;
        }
        const ref = await uploadFile(file);
        setAttachments((prev) => [...prev, ref]);
      }
    } catch (err) {
      setError(getErrorMessage(err, "File upload failed"));
    } finally {
      setIsUploading(false);
    }
  };

  const cleanupFiles = useCallback((files: FileItemResponse[]) => {
    files.forEach((f) => fileAPI.delete(f.id).catch(() => {}));
  }, []);

  const handleAttachmentsChange = useCallback((newAttachments: FileItemResponse[]) => {
    const removed = attachments.filter((a) => !newAttachments.some((n) => n.id === a.id));
    cleanupFiles(removed);
    setAttachments(newAttachments);
  }, [attachments, cleanupFiles]);

  const handleCancel = () => {
    cleanupFiles(attachments);
    navigate("/internal-billing/billings");
  };

  const handleSubmitClick = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const handleConfirmCreate = async () => {
    const created = await invoiceAPI.createInvoice({
      clientId,
      invoiceNumber: invoiceNumber.trim(),
      invoiceDate,
      termsId: parseInt(termsId),
      description: description.trim() || undefined,
      amountDue: parseFloat(amountDue),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    toastSuccess("Invoice Created", `Invoice ${invoiceNumber.trim()} has been created.`);
    navigate(`/internal-billing/billings/${created.id}`);
  };

  const canSubmit = clientId && invoiceNumber.trim() && invoiceDate && termsId && amountDue && parseFloat(amountDue) > 0;

  return (
    <div className="pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
        <button onClick={() => navigate("/internal-billing/billings")} className="hover:text-accent transition-colors">
          Billings
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-primary font-medium">Create Invoice</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmitClick} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Row 1: Client + Invoice Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dropdown
              label="Client"
              options={clientOptions}
              value={clientId}
              onChange={setClientId}
              placeholder="Select a client"
            />
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g. INV-2026-001"
            />
            <div>
              <Input
                label="Amount Due"
                type="number"
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                placeholder="0.00"
              />
              {amountDue && parseFloat(amountDue) > 0 && (
                <p className="mt-1 text-sm font-medium text-accent">{formatCurrency(parseFloat(amountDue))}</p>
              )}
            </div>
          </div>

          {/* Row 2: Invoice Date + Terms + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Invoice Date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
            <div>
              {showAddTerm ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Term</label>
                  <div className="flex items-end gap-2">
                    <input
                      type="text"
                      value={newTermName}
                      onChange={(e) => setNewTermName(e.target.value)}
                      placeholder="Name"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <input
                      type="number"
                      value={newTermDays}
                      onChange={(e) => setNewTermDays(e.target.value)}
                      placeholder="Days"
                      className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <Button onClick={handleAddTerm} isLoading={isAddingTerm} disabled={!newTermName.trim() || !newTermDays}>
                      Add
                    </Button>
                    <Button variant="secondary" onClick={() => setShowAddTerm(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <Dropdown
                  label="Terms"
                  options={termOptions}
                  value={termsId}
                  onChange={handleTermChange}
                  placeholder="Select terms"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <p className="text-sm text-primary font-medium bg-gray-50 rounded-md border border-gray-200 px-3 py-2.5">
                {computedDueDate ? formatDate(computedDueDate) : <span className="text-gray-400">Select date & terms</span>}
              </p>
            </div>
          </div>

          {/* Row 3: Description + Drop Zone (side by side, matched height) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[140px]">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Invoice description or notes"
                className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            </div>
            {clientId && (
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div
                  onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 0) handleDropFiles(e.dataTransfer.files); }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed cursor-pointer transition-colors ${
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
                      if (e.target.files) handleDropFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Uploaded files list — full width below */}
          {attachments.length > 0 && (
            <div className="space-y-1.5">
              {attachments.map((file) => (
                <FileRow
                  key={file.id}
                  name={file.name}
                  onClick={() => setPreviewFile(file)}
                  onRemove={() => handleAttachmentsChange(attachments.filter((f) => f.id !== file.id))}
                />
              ))}
            </div>
          )}

          {previewFile && (
            <FilePreviewOverlay
              fileId={previewFile.id}
              fileName={previewFile.name}
              setModalOpen={() => setPreviewFile(null)}
            />
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Create Invoice
            </Button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowConfirm}
          onConfirm={handleConfirmCreate}
          title="Create Invoice?"
          description={`Create invoice ${invoiceNumber.trim()} for ${formatCurrency(parseFloat(amountDue))}?`}
          confirmLabel="Create Invoice"
          loadingLabel="Creating..."
          onSuccess={() => setShowConfirm(false)}
          onError={(err) => {
            setShowConfirm(false);
            if (isConflictError(err)) {
              setError("An invoice with this number already exists.");
            } else {
              setError(getErrorMessage(err));
            }
          }}
        />
      )}
    </div>
  );
}
