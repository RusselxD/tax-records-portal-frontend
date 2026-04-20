import { FileCheck, ShieldCheck } from "lucide-react";
import type { TaxRecordEntryResponse } from "../../../../../../types/tax-record";
import { periodLabels } from "../../../../../../constants/tax-record-task";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../../constants";
import FileCard from "./components/FileCard";
import WorkingFilesCard from "./components/WorkingFilesCard";
import RecordDetails from "./components/RecordDetails";
import OverrideActions from "./components/OverrideActions";

interface TaxRecordDetailProps {
  record: TaxRecordEntryResponse;
  protected?: boolean;
  onOverrideEdited?: () => void;
  onOverrideDeleted?: () => void;
}

export default function TaxRecordDetail({
  record,
  protected: isProtected = false,
  onOverrideEdited,
  onOverrideDeleted,
}: TaxRecordDetailProps) {
  const { user } = useAuth();
  const canOverride =
    !isProtected && hasPermission(user?.permissions, Permission.TAX_RECORDS_OVERRIDE);

  const fileEntries = record.workingFiles.filter((f) => f.type === "file");
  const linkEntries = record.workingFiles.filter((f) => f.type === "link");
  const hasWorkingFiles = fileEntries.length > 0 || linkEntries.length > 0;
  const outputDisplayName = `${record.taskName} - ${record.year} - ${periodLabels[record.period] ?? record.period}`;

  return (
    <div className="space-y-5">
      {canOverride && onOverrideEdited && onOverrideDeleted && (
        <div className="flex justify-end">
          <OverrideActions
            record={record}
            onEdited={onOverrideEdited}
            onDeleted={onOverrideDeleted}
          />
        </div>
      )}

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
