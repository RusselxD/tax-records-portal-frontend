import { FileText, ExternalLink, FileCheck, ShieldCheck } from "lucide-react";
import { FilePreviewButton } from "../../../../../components/common";
import type { TaxRecordEntryResponse } from "../../../../../types/tax-record";
import { periodLabels } from "../../../../../constants/tax-record-task";

interface TaxRecordDetailProps {
  record: TaxRecordEntryResponse;
}

export default function TaxRecordDetail({ record }: TaxRecordDetailProps) {
  const fileEntries = record.workingFiles.filter((f) => f.type === "file");
  const linkEntries = record.workingFiles.filter((f) => f.type === "link");
  const hasWorkingFiles = fileEntries.length > 0 || linkEntries.length > 0;

  return (
    <div className="space-y-5">
      {/* Record Info */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
        <h2 className="text-sm font-semibold text-primary mb-4">Record Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Category</p>
            <p className="text-sm text-primary leading-relaxed">{record.categoryName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Sub Category</p>
            <p className="text-sm text-primary leading-relaxed">{record.subCategoryName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Task</p>
            <p className="text-sm text-primary leading-relaxed">{record.taskName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Year</p>
            <p className="text-sm text-primary leading-relaxed">{record.year}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Period</p>
            <p className="text-sm text-primary leading-relaxed">{periodLabels[record.period] ?? record.period}</p>
          </div>
        </div>
      </div>

      {/* Output File */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Output File</h2>
        </div>
        {record.outputFile ? (
          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <FileText className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="flex-1 text-sm text-primary font-medium leading-relaxed min-w-0">
              {record.outputFile.name}
            </span>
            <FilePreviewButton fileId={record.outputFile.id} fileName={record.outputFile.name} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">No output file available.</p>
        )}
      </div>

      {/* Proof of Filing */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Proof of Filing</h2>
        </div>
        {record.proofOfFilingFile ? (
          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <FileText className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="flex-1 text-sm text-primary font-medium leading-relaxed min-w-0">
              {record.proofOfFilingFile.name}
            </span>
            <FilePreviewButton fileId={record.proofOfFilingFile.id} fileName={record.proofOfFilingFile.name} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">No proof of filing available.</p>
        )}
      </div>

      {/* Working Files */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Working Files</h2>
        </div>
        {!hasWorkingFiles ? (
          <p className="text-sm text-gray-400">No working files available.</p>
        ) : (
          <div className="space-y-2">
            {fileEntries.map((f) => (
              <div
                key={f.fileId}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="flex-1 text-sm text-primary font-medium leading-relaxed min-w-0">
                  {f.fileName}
                </span>
                <FilePreviewButton fileId={f.fileId} fileName={f.fileName} />
              </div>
            ))}
            {linkEntries.map((l, i) => (
              <a
                key={i}
                href={l.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="flex-1 text-sm text-accent font-medium leading-relaxed min-w-0">
                  {l.label || l.url}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
