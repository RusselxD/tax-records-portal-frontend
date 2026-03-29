import { Paperclip } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import { CommentPreview } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import { billableLabels, billableStyles } from "../../../../../constants/consultation";
import type { ConsultationLogDetail } from "../../../../../types/consultation";

interface LogDetailsCardProps {
  log: ConsultationLogDetail;
  onPreviewFile: (file: { id: string; name: string }) => void;
}

export default function LogDetailsCard({ log, onPreviewFile }: LogDetailsCardProps) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Subject</p>
        <p className="text-sm font-medium text-primary">{log.subject}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Client</p>
          <p className="text-sm font-medium text-primary">{log.clientDisplayName}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Platform</p>
          <p className="text-sm text-gray-700">{log.platform}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Date</p>
          <p className="text-sm text-gray-700">{formatDate(log.date)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Time</p>
          <p className="text-sm text-gray-700">{log.startTime} – {log.endTime} ({log.hours.toFixed(2)}h)</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Billable Type</p>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${billableStyles[log.billableType]}`}>
            {billableLabels[log.billableType]}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Created By</p>
          <p className="text-sm text-gray-700">{log.createdByName}</p>
        </div>
      </div>

      {log.notes && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</p>
          <div className="bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
            <CommentPreview content={log.notes} className="text-sm" />
          </div>
        </div>
      )}

      {log.attachments.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            Attachments
          </p>
          <div className="space-y-1.5">
            {log.attachments.map((file) => (
              <FileRow key={file.id} name={file.name} onClick={() => onPreviewFile(file)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
