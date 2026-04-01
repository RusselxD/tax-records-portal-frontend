import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button, Input, CommentEditor } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { FilePreviewOverlay } from "../../../../../components/common";
import { consultationAPI } from "../../../../../api/consultation";
import { fileAPI } from "../../../../../api/file";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import { validateDocumentFile } from "../../../../../lib/file-validation";
import type { RichTextContent } from "../../../../../types/client-info";
import type { ConsultationLogDetail } from "../../../../../types/consultation";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

interface EditConsultationLogFormProps {
  log: ConsultationLogDetail;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditConsultationLogForm({ log, onCancel, onSuccess }: EditConsultationLogFormProps) {
  const { toastSuccess, toastError } = useToast();

  const [date, setDate] = useState(log.date);
  const [startTime, setStartTime] = useState(log.startTime);
  const [endTime, setEndTime] = useState(log.endTime);
  const [platform, setPlatform] = useState(log.platform);
  const [subject, setSubject] = useState(log.subject);
  const [notes, setNotes] = useState<RichTextContent>(log.notes || EMPTY_DOC);
  const [isCourtesy, setIsCourtesy] = useState(log.billableType === "COURTESY");
  const [attachments, setAttachments] = useState<{ id: string; name: string }[]>([...log.attachments]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const ref = await fileAPI.upload(log.clientId, file);
        setAttachments((prev) => [...prev, ref]);
      }
    } catch (err) {
      toastError(getErrorMessage(err, "File upload failed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    const isNew = !log.attachments.some((a) => a.id === id);
    if (isNew) fileAPI.delete(id).catch(() => {});
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const canSubmit = date && startTime && endTime && platform && subject.trim();

  const hasNotes = (doc: RichTextContent) => {
    if (!doc.content || doc.content.length === 0) return false;
    return doc.content.some((n) => {
      if (n.type === "image") return true;
      return n.content && Array.isArray(n.content) && (n.content as unknown[]).length > 0;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await consultationAPI.updateLog(log.id, {
        date,
        startTime,
        endTime,
        platform,
        subject: subject.trim(),
        notes: hasNotes(notes) ? notes : null,
        attachments,
        billableType: isCourtesy ? "COURTESY" : null,
      });
      toastSuccess("Updated", "Consultation log has been updated.");
      onSuccess();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to update."));
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, log.id, date, startTime, endTime, platform, subject, notes, attachments, isCourtesy, toastSuccess, toastError, onSuccess]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 -ml-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-primary">Edit Consultation Log</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-5">
          {/* Client is read-only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <p className="text-sm text-primary font-medium bg-gray-50 rounded-md border border-gray-200 px-3 py-2.5">
                {log.clientDisplayName}
              </p>
            </div>
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. Zoom, Google Meet, Phone"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <div className="col-span-2">
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Monthly tax review"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCourtesy}
              onChange={(e) => setIsCourtesy(e.target.checked)}
              className="rounded border-gray-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-gray-700">
              Mark as courtesy <span className="text-gray-400">(won't count toward billing)</span>
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <CommentEditor
              value={notes}
              onChange={setNotes}
              placeholder="Meeting notes, action items, etc."
              minHeight="100px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files); }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 cursor-pointer transition-colors ${
                dragging ? "border-accent bg-accent/5" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {isUploading ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
              <p className="text-sm text-gray-500">
                {isUploading ? "Uploading..." : <>Drag & drop or <span className="text-accent font-medium">browse</span></>}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files) handleFileUpload(e.target.files); e.target.value = ""; }}
              />
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {attachments.map((file) => (
                  <FileRow key={file.id} name={file.name} onClick={() => setPreviewFile(file)} onRemove={() => handleRemoveFile(file.id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>Save Changes</Button>
        </div>
      </div>

      {previewFile && (
        <FilePreviewOverlay fileId={previewFile.id} fileName={previewFile.name} setModalOpen={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
