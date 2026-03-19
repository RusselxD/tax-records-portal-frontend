import { useState } from "react";
import { getErrorMessage } from "../../../../../../lib/api-error";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Alert, Button } from "../../../../../../components/common";
import { taxRecordTaskAPI } from "../../../../../../api/tax-record-task";
import { useToast } from "../../../../../../contexts/ToastContext";
import useImportTaxRecordTasks from "../../hooks/useImportTaxRecordTasks";
import FileUploadZone from "./components/FileUploadZone";
import PreviewTable from "./components/PreviewTable";

interface ImportTaxRecordTasksFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ImportTaxRecordTasksForm({
  onCancel,
  onSuccess,
}: ImportTaxRecordTasksFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toastSuccess } = useToast();

  const {
    rows, validCount, invalidCount,
    isParsing, parseError, refError,
    isSubmitting, submitError,
    processFile, submitRows, clearRows,
  } = useImportTaxRecordTasks();

  const displayError = error || parseError || refError || submitError;
  const hasPreview = rows.length > 0;

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await taxRecordTaskAPI.downloadBulkTemplate();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to download template."));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    if (!selected.name.endsWith(".xlsx") && !selected.name.endsWith(".xls")) {
      setError("Please upload an Excel file (.xlsx)");
      return;
    }
    setError(null);
    setFile(selected);
    processFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    clearRows();
    setError(null);
  };

  const handleSubmit = async () => {
    const result = await submitRows();
    if (!result) return;

    if (result.failed === 0) {
      toastSuccess(
        "Import Successful",
        `${result.created} task${result.created !== 1 ? "s" : ""} created.`,
      );
      onSuccess();
      onCancel();
    } else if (result.created > 0) {
      onSuccess();
      setError(
        `${result.created} task${result.created !== 1 ? "s" : ""} created, ${result.failed} failed. Fix the errors below and re-import.`,
      );
    } else {
      setError(
        `All ${result.failed} task${result.failed !== 1 ? "s" : ""} failed. Fix the errors below and re-import.`,
      );
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </button>

      <div className="rounded-lg bg-white custom-shadow p-6">
        <h2 className="text-lg font-semibold text-primary">Import Tax Record Tasks</h2>

        {displayError && <Alert variant="error" className="mt-4">{displayError}</Alert>}

        <div className="mt-5 space-y-5">
          {/* Step 1: Download Template */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">1. Download Template</h3>
            <p className="text-sm text-gray-500">
              Get an Excel template with reference data for clients, accountants, categories, and task names.
            </p>
            <Button
              variant="secondary"
              onClick={handleDownloadTemplate}
              isLoading={isDownloading}
              disabled={isSubmitting}
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Downloading..." : "Download Template"}
            </Button>
          </div>

          {/* Step 2: Upload */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">2. Upload Filled Template</h3>
            <p className="text-sm text-gray-500">
              Fill out the template in Excel, then upload it here.
            </p>
            <FileUploadZone
              file={file}
              isSubmitting={isSubmitting}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {/* Loading indicator */}
          {isParsing && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Validating file...
            </div>
          )}

          {/* Step 3: Preview */}
          {hasPreview && !isParsing && (
            <PreviewTable
              rows={rows}
              validCount={validCount}
              invalidCount={invalidCount}
            />
          )}

          {/* Submit progress */}
          {isSubmitting && (
            <div className="flex items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
              <Loader2 className="w-4 h-4 animate-spin" />
              Importing tasks...
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={
                !file || invalidCount > 0 || validCount === 0 || isParsing || isSubmitting
              }
            >
              {isSubmitting
                ? "Importing..."
                : `Import ${validCount > 0 ? `${validCount} Rows` : "Tasks"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
