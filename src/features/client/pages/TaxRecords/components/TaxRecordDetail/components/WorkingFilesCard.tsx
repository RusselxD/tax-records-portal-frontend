import { FolderOpen } from "lucide-react";
import { WorkingFileItem, WorkingLinkItem, EmptyCardState } from "../../../../../../../components/common/file-cards";
import type { TaxRecordEntryResponse } from "../../../../../../../types/tax-record";
import { CARD_SHELL } from "../constants";

interface WorkingFilesCardProps {
  fileEntries: TaxRecordEntryResponse["workingFiles"];
  linkEntries: TaxRecordEntryResponse["workingFiles"];
  hasFiles: boolean;
  disabled?: boolean;
}

export default function WorkingFilesCard({
  fileEntries,
  linkEntries,
  hasFiles,
  disabled = false,
}: WorkingFilesCardProps) {
  return (
    <div className={CARD_SHELL}>
      {!hasFiles ? (
        <EmptyCardState
          icon={<FolderOpen className="h-10 w-10" />}
          title="Working Files"
          message="No files available"
        />
      ) : (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="h-4 w-4 text-violet-500" />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Working Files
            </h3>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {fileEntries.map((f) => (
              <WorkingFileItem key={f.fileId} fileId={f.fileId} fileName={f.fileName} disabled={disabled} />
            ))}
            {linkEntries.map((l, i) => (
              <WorkingLinkItem key={i} url={l.url} label={l.label} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
