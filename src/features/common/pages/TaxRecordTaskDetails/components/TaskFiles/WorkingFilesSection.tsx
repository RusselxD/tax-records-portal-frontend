import { useState, useRef, type DragEvent } from "react";
import { Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../../../components/common";
import { WorkingFileItem, WorkingLinkItem } from "../../../../../../components/common/file-cards";
import { useTaxRecordTaskDetails } from "../../context/TaxRecordTaskDetailsContext";
import { useToast } from "../../../../../../contexts/ToastContext";
import { validateDocumentFile } from "../../../../../../lib/file-validation";

function AddLinkForm({ onAdd }: { onAdd: (url: string, label: string) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Link
      </button>
    );
  }

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(url.trim(), label.trim() || url.trim());
      setUrl("");
      setLabel("");
      setIsOpen(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 p-3 space-y-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (optional)"
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="flex gap-2">
        <Button onClick={handleSubmit} isLoading={isAdding} disabled={!url.trim()}>
          Add
        </Button>
        <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={isAdding}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

export default function WorkingFilesSection() {
  const {
    files,
    canEdit,
    uploadWorkingFile,
    addWorkingLink,
    deleteWorkingFile,
  } = useTaxRecordTaskDetails();
  const { toastError } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const workingFiles = files?.workingFiles ?? [];
  const fileEntries = workingFiles.filter((f) => f.type === "file");
  const linkEntries = workingFiles.filter((f) => f.type === "link");

  const handleUploadMultiple = async (fileList: FileList) => {
    if (fileList.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const result = validateDocumentFile(file);
        if (!result.valid) {
          toastError(result.error!);
          continue;
        }
        await uploadWorkingFile(file);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUploadMultiple(e.dataTransfer.files);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Working Paper and Other Files
      </h3>

      {canEdit && (
        <div className="space-y-3 mb-3">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-5 cursor-pointer transition-colors ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400" />
            )}
            <p className="text-sm text-gray-500">
              {isUploading
                ? "Uploading..."
                : <>Drag & drop or <span className="text-accent font-medium">browse</span></>}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUploadMultiple(e.target.files);
                }
                e.target.value = "";
              }}
            />
          </div>

          <AddLinkForm onAdd={addWorkingLink} />
        </div>
      )}

      {workingFiles.length === 0 ? (
        <p className="text-sm text-gray-400">No working files yet.</p>
      ) : (
        <div className="space-y-2">
          {fileEntries.map((item) => (
            <WorkingFileItem
              key={item.fileId}
              fileId={item.fileId}
              fileName={item.fileName}
              action={canEdit ? <DeleteButton onDelete={() => deleteWorkingFile(item.fileId)} /> : undefined}
            />
          ))}
          {linkEntries.map((item) => (
            <WorkingLinkItem
              key={item.fileId}
              url={item.url}
              label={item.label}
              action={canEdit ? <DeleteButton onDelete={() => deleteWorkingFile(item.fileId)} /> : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
