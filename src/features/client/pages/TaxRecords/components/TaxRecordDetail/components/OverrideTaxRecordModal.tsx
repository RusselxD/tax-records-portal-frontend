import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Upload, Link2, Trash2, FileText, RotateCcw } from "lucide-react";
import Modal from "../../../../../../../components/common/Modal";
import Button from "../../../../../../../components/common/Button";
import Input from "../../../../../../../components/common/Input";
import { taxRecordAPI } from "../../../../../../../api/tax-record";
import { useToast } from "../../../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../../../lib/api-error";
import { validateDocumentFile } from "../../../../../../../lib/file-validation";
import type {
  TaxRecordEntryResponse,
  OverrideFileAction,
} from "../../../../../../../types/tax-record";

interface Props {
  record: TaxRecordEntryResponse;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

interface NewLinkDraft {
  url: string;
  label: string;
}

export default function OverrideTaxRecordModal({
  record,
  setModalOpen,
  onSuccess,
}: Props) {
  const { toastSuccess, toastError } = useToast();

  const [removedWorkingFileIds, setRemovedWorkingFileIds] = useState<string[]>([]);
  const [newWorkingFiles, setNewWorkingFiles] = useState<File[]>([]);
  const [newWorkingLinks, setNewWorkingLinks] = useState<NewLinkDraft[]>([]);

  const [outputAction, setOutputAction] = useState<OverrideFileAction>("keep");
  const [outputFile, setOutputFile] = useState<File | null>(null);

  const [proofAction, setProofAction] = useState<OverrideFileAction>("keep");
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const existingWorkingFiles = record.workingFiles;

  const hasChanges = useMemo(() => {
    if (removedWorkingFileIds.length > 0) return true;
    if (newWorkingFiles.length > 0) return true;
    if (newWorkingLinks.length > 0) return true;
    if (outputAction === "replace" && outputFile) return true;
    if (proofAction === "replace" && proofFile) return true;
    return false;
  }, [removedWorkingFileIds, newWorkingFiles, newWorkingLinks, outputAction, outputFile, proofAction, proofFile]);

  const toggleRemoveWorking = (id: string) => {
    setRemovedWorkingFileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAddWorkingFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const accepted: File[] = [];
    for (const f of Array.from(files)) {
      const res = validateDocumentFile(f);
      if (!res.valid) {
        toastError(res.error!);
        continue;
      }
      accepted.push(f);
    }
    if (accepted.length > 0) setNewWorkingFiles((prev) => [...prev, ...accepted]);
  };

  const removeNewWorkingFile = (idx: number) =>
    setNewWorkingFiles((prev) => prev.filter((_, i) => i !== idx));

  const addLinkDraft = () =>
    setNewWorkingLinks((prev) => [...prev, { url: "", label: "" }]);
  const updateLinkDraft = (idx: number, patch: Partial<NewLinkDraft>) =>
    setNewWorkingLinks((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    );
  const removeLinkDraft = (idx: number) =>
    setNewWorkingLinks((prev) => prev.filter((_, i) => i !== idx));

  const handleReplaceOutput = (files: FileList | null) => {
    if (!files?.[0]) return;
    const res = validateDocumentFile(files[0]);
    if (!res.valid) {
      toastError(res.error!);
      return;
    }
    setOutputFile(files[0]);
    setOutputAction("replace");
  };

  const handleReplaceProof = (files: FileList | null) => {
    if (!files?.[0]) return;
    const res = validateDocumentFile(files[0]);
    if (!res.valid) {
      toastError(res.error!);
      return;
    }
    setProofFile(files[0]);
    setProofAction("replace");
  };

  const handleSave = async () => {
    // Validate links
    const cleanedLinks = newWorkingLinks
      .map((l) => ({ url: l.url.trim(), label: l.label.trim() }))
      .filter((l) => l.url.length > 0);
    for (const l of cleanedLinks) {
      if (!l.label) {
        toastError("Each link needs a label.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await taxRecordAPI.overrideEntry(record.id, {
        removedWorkingFileIds,
        newWorkingFiles,
        newWorkingLinks: cleanedLinks,
        outputFileAction: outputAction,
        outputFile: outputAction === "replace" ? outputFile ?? undefined : undefined,
        proofFileAction: proofAction,
        proofFile: proofAction === "replace" ? proofFile ?? undefined : undefined,
      });
      toastSuccess("Tax record updated.");
      setModalOpen(false);
      onSuccess();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to update tax record."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title="Override Tax Record"
      maxWidth="max-w-2xl"
      actions={
        <>
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving} isLoading={isSaving}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Output File */}
        <FileSlotSection
          title="Output File / Tax Return"
          current={record.outputFile?.name ?? null}
          action={outputAction}
          pendingFile={outputFile}
          onKeep={() => {
            setOutputAction("keep");
            setOutputFile(null);
          }}
          onReplace={handleReplaceOutput}
        />

        {/* Proof of Filing */}
        <FileSlotSection
          title="Proof of Filing / Proof of Payment"
          current={record.proofOfFilingFile?.name ?? null}
          action={proofAction}
          pendingFile={proofFile}
          onKeep={() => {
            setProofAction("keep");
            setProofFile(null);
          }}
          onReplace={handleReplaceProof}
        />

        {/* Working Files & Links */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">Working Files & Links</h3>

          {existingWorkingFiles.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {existingWorkingFiles.map((f) => {
                const marked = removedWorkingFileIds.includes(f.fileId);
                return (
                  <div
                    key={f.fileId}
                    className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm ${
                      marked ? "border-red-200 bg-red-50 text-gray-400 line-through" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {f.type === "link" ? (
                        <Link2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      )}
                      <span className="truncate">{f.label ?? f.fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleRemoveWorking(f.fileId)}
                      className="p-1 rounded text-gray-400 hover:text-red-500"
                      title={marked ? "Undo remove" : "Remove"}
                    >
                      {marked ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending new files */}
          {newWorkingFiles.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {newWorkingFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span className="truncate text-primary">{f.name}</span>
                    <span className="text-xs text-emerald-700">New</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewWorkingFile(i)}
                    className="p-1 rounded text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pending new links */}
          {newWorkingLinks.length > 0 && (
            <div className="space-y-2 mb-3">
              {newWorkingLinks.map((l, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={l.label}
                    onChange={(e) => updateLinkDraft(i, { label: e.target.value })}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Input
                    value={l.url}
                    onChange={(e) => updateLinkDraft(i, { url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeLinkDraft(i)}
                    className="p-2 rounded text-gray-400 hover:text-red-500 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover cursor-pointer">
              <Upload className="h-4 w-4" />
              Add files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleAddWorkingFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={addLinkDraft}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
            >
              <Link2 className="h-4 w-4" />
              Add link
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FileSlotSection({
  title,
  current,
  action,
  pendingFile,
  onKeep,
  onReplace,
}: {
  title: string;
  current: string | null;
  action: OverrideFileAction;
  pendingFile: File | null;
  onKeep: () => void;
  onReplace: (files: FileList | null) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-2">{title}</h3>
      <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
          {action === "replace" && pendingFile ? (
            <span className="truncate text-primary">
              {pendingFile.name} <span className="text-xs text-emerald-700 ml-1">New</span>
            </span>
          ) : current ? (
            <span className="truncate text-primary">{current}</span>
          ) : (
            <span className="text-gray-400 italic">No file</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {action === "replace" && (
            <button
              type="button"
              onClick={onKeep}
              className="text-xs font-medium text-gray-500 hover:text-primary"
            >
              Undo
            </button>
          )}
          <label className="text-xs font-medium text-accent hover:text-accent-hover cursor-pointer">
            Replace
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                onReplace(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
