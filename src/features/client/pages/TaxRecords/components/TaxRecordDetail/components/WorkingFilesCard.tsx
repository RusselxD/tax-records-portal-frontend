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
    <div className={`${CARD_SHELL} flex flex-col h-[20rem]`}>
      {/* Fixed header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 shrink-0">
        <FolderOpen className="h-4 w-4 text-violet-500" />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Working Files
        </h3>
      </div>

      {/* Scrollable content */}
      {!hasFiles ? (
        <EmptyCardState
          icon={<FolderOpen className="h-10 w-10" />}
          title=""
          message="No files available"
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0 scrollbar-thin">
          {fileEntries.map((f) => (
            <WorkingFileItem key={f.fileId} fileId={f.fileId} fileName={f.fileName} disabled={disabled} />
          ))}
          {linkEntries.map((l, i) => (
            <WorkingLinkItem key={i} url={l.url} label={l.label} />
          ))}
        </div>
      )}
    </div>
  );
}
