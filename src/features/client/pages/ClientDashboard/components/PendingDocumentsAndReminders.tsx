import { Loader2, ClipboardList, Megaphone, FileWarning } from "lucide-react";
import type { ClientNoticeResponse } from "../../../../../types/client";

interface PendingDocumentsAndRemindersProps {
  reminders: ClientNoticeResponse[];
  pendingDocuments: ClientNoticeResponse[];
  isLoading: boolean;
}

export default function PendingDocumentsAndReminders({
  reminders,
  pendingDocuments,
  isLoading,
}: PendingDocumentsAndRemindersProps) {
  const isEmpty = reminders.length === 0 && pendingDocuments.length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <ClipboardList className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-primary">
          Pending Documents & Reminders
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        {isLoading && (
          <div className="flex items-center justify-center px-5 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center h-full px-5 text-center -mt-4">
            <ClipboardList className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">All clear</p>
            <p className="text-sm text-gray-400 mt-0.5">
              No pending documents or reminders
            </p>
          </div>
        )}

        {!isLoading && !isEmpty && (
          <div className="divide-y divide-gray-100">
            {reminders.map((notice) => (
              <div key={notice.id} className="flex items-start gap-3 px-5 py-3">
                <Megaphone className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                <p className="text-sm text-primary leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
            {pendingDocuments.map((notice) => (
              <div key={notice.id} className="flex items-start gap-3 px-5 py-3">
                <FileWarning className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                <p className="text-sm text-primary leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
