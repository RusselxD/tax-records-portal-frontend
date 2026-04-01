import { useState, useEffect, useCallback } from "react";
import { Send, Loader2, Trash2, Megaphone, FileWarning, Sparkles } from "lucide-react";
import { Dropdown, Button } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { NOTICE_TYPE } from "../../../../../types/client";
import type { NoticeType, ClientNoticeResponse } from "../../../../../types/client";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";

const noticeTypeOptions = [
  { label: "Reminder", value: NOTICE_TYPE.REMINDER },
  { label: "Pending Document", value: NOTICE_TYPE.PENDING_DOCUMENT },
  { label: "Highlight", value: NOTICE_TYPE.HIGHLIGHT },
];

const noticeTypeLabels: Record<NoticeType, string> = {
  [NOTICE_TYPE.REMINDER]: "Reminder",
  [NOTICE_TYPE.PENDING_DOCUMENT]: "Pending Document",
  [NOTICE_TYPE.HIGHLIGHT]: "Highlight",
};

const noticeTypeIcons: Record<NoticeType, typeof Megaphone> = {
  [NOTICE_TYPE.REMINDER]: Megaphone,
  [NOTICE_TYPE.PENDING_DOCUMENT]: FileWarning,
  [NOTICE_TYPE.HIGHLIGHT]: Sparkles,
};

const noticeTypeColors: Record<NoticeType, string> = {
  [NOTICE_TYPE.REMINDER]: "text-amber-500",
  [NOTICE_TYPE.PENDING_DOCUMENT]: "text-blue-500",
  [NOTICE_TYPE.HIGHLIGHT]: "text-emerald-500",
};

interface CreateNoticeProps {
  clientId: string;
}

export default function CreateNotice({ clientId }: CreateNoticeProps) {
  const { toastSuccess, toastError } = useToast();
  const [notices, setNotices] = useState<ClientNoticeResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [type, setType] = useState<NoticeType>(NOTICE_TYPE.REMINDER);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    clientAPI.getNotices(clientId).then((data) => {
      if (!cancelled) setNotices(data);
    }).catch((err) => {
      if (!cancelled) toastError(getErrorMessage(err, "Failed to load notices"));
    }).finally(() => {
      if (!cancelled) setIsLoadingList(false);
    });
    return () => { cancelled = true; };
  }, [clientId]);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      const created = await clientAPI.createNotice(clientId, { type, content: trimmed });
      setNotices((prev) => [created, ...prev]);
      toastSuccess(`${noticeTypeLabels[type]} posted`);
      setContent("");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to post notice"));
    } finally {
      setIsSubmitting(false);
    }
  }, [clientId, type, content, toastSuccess, toastError]);

  const handleDelete = useCallback(async (noticeId: number) => {
    setDeletingId(noticeId);
    try {
      await clientAPI.deleteNotice(clientId, noticeId);
      setNotices((prev) => prev.filter((n) => n.id !== noticeId));
      toastSuccess("Notice removed");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to remove notice"));
    } finally {
      setDeletingId(null);
    }
  }, [clientId, toastSuccess, toastError]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <Send className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-primary">Client Notices</h3>
      </div>

      {/* Create form */}
      <div className="px-5 py-4 space-y-3 border-b border-gray-100">
        <Dropdown
          label="Notice Type"
          options={noticeTypeOptions}
          value={type}
          onChange={(v) => setType(v as NoticeType)}
          fullWidth
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a notice for the client..."
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Post Notice"
            )}
          </Button>
        </div>
      </div>

      {/* Notices list */}
      <div className="max-h-80 overflow-y-auto">
        {isLoadingList && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoadingList && notices.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">No notices posted yet</p>
          </div>
        )}

        {!isLoadingList && notices.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notices.map((notice) => {
              const Icon = noticeTypeIcons[notice.type];
              const color = noticeTypeColors[notice.type];
              const isDeleting = deletingId === notice.id;

              return (
                <div key={notice.id} className="flex items-start gap-3 px-5 py-3 group">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      {noticeTypeLabels[notice.type]}
                    </p>
                    <p className="text-sm text-primary leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    disabled={isDeleting}
                    className="shrink-0 p-2 rounded text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Remove notice"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
