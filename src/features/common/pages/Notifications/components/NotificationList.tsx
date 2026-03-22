import { useEffect, useRef } from "react";
import {
  Send,
  Check,
  X,
  ClipboardList,
  UserCheck,
  UserX,
  ArrowRightLeft,
  Bell,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../../../lib/formatters";
import { getNotificationHref } from "../../../../../lib/notification-helpers";
import { notificationAPI } from "../../../../../api/notification";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNotifications } from "../../../../../contexts/NotificationsContext";
import type { NotificationListItemResponse } from "../../../../../types/notification";

const typeConfig: Record<
  NotificationListItemResponse["type"],
  { icon: typeof Send; color: string; bg: string }
> = {
  TASK_ASSIGNED: { icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
  TASK_SUBMITTED: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  TASK_APPROVED: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  TASK_REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-100" },
  PROFILE_SUBMITTED: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  PROFILE_APPROVED: { icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
  PROFILE_REJECTED: { icon: UserX, color: "text-red-500", bg: "bg-red-100" },
  CLIENT_HANDOFF: { icon: ArrowRightLeft, color: "text-amber-600", bg: "bg-amber-100" },
};

function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: NotificationListItemResponse;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decrementUnread } = useNotifications();
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleClick = async () => {
    if (!notification.isRead) {
      onRead(notification.id);
      decrementUnread();
      notificationAPI.markNotificationAsRead(notification.id).catch(() => {});
    }
    if (user) {
      const href = getNotificationHref(notification, user.roleKey);
      if (href) navigate(href);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
        notification.isRead
          ? "border-gray-200 bg-white"
          : "border-blue-200 bg-blue-50/30"
      }`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${config.bg}`}
      >
        <Icon className={`h-4 w-4 ${config.color}`} strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${notification.isRead ? "font-normal" : "font-semibold"} text-primary`}>
            {notification.message}
          </p>
          {!notification.isRead && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent group-hover:opacity-0 transition-opacity" />
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">{formatDateTime(notification.createdAt)}</p>
      </div>

      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function NotificationList({
  notifications,
  loading,
  loadingMore,
  hasMore,
  onRead,
  onDelete,
  onLoadMore,
}: {
  notifications: NotificationListItemResponse[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onLoadMore: () => void;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-lg bg-white py-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-lg font-semibold text-primary">No notifications yet</p>
        <p className="mt-1 text-sm text-gray-400">
          You'll be notified when something needs your attention.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
        />
      ))}

      <div ref={sentinelRef} className="py-2 flex justify-center">
        {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
      </div>
    </div>
  );
}
