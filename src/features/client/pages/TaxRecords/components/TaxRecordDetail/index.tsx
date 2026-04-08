import { FileCheck, ShieldCheck } from "lucide-react";
import type { TaxRecordEntryResponse } from "../../../../../../types/tax-record";
import { periodLabels } from "../../../../../../constants/tax-record-task";
import FileCard from "./components/FileCard";
import WorkingFilesCard from "./components/WorkingFilesCard";
import RecordDetails from "./components/RecordDetails";

interface TaxRecordDetailProps {
  record: TaxRecordEntryResponse;
  protected?: boolean;
}

export default function TaxRecordDetail({ record, protected: isProtected = false }: TaxRecordDetailProps) {
  const fileEntries = record.workingFiles.filter((f) => f.type === "file");
  const linkEntries = record.workingFiles.filter((f) => f.type === "link");
  const hasWorkingFiles = fileEntries.length > 0 || linkEntries.length > 0;
  const outputDisplayName = `${record.taskName} - ${record.year} - ${periodLabels[record.period] ?? record.period}`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileCard
          icon={<FileCheck className="h-4 w-4 text-red-500" />}
          emptyIcon={<FileCheck className="h-10 w-10" />}
          title="Output File / Tax Return"
          file={record.outputFile}
          displayName={outputDisplayName}
          emptyMessage="No file available"
          disabled={isProtected}
        />
        <FileCard
          icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
          emptyIcon={<ShieldCheck className="h-10 w-10" />}
          title="Proof of Filing / Proof of Payment"
          file={record.proofOfFilingFile}
          emptyMessage="No file available"
          disabled={isProtected}
        />
        <WorkingFilesCard
          fileEntries={fileEntries}
          linkEntries={linkEntries}
          hasFiles={hasWorkingFiles}
          disabled={isProtected}
        />
      </div>

      <RecordDetails record={record} />
    </div>
  );
}
