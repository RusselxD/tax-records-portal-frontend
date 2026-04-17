import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../../../lib/formatters";
import { getNotificationHref } from "../../../../../lib/notification-helpers";
import { notificationTypeConfig } from "../../../../../lib/notification-type-config";
import { notificationAPI } from "../../../../../api/notification";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNotifications } from "../../../../../contexts/NotificationsContext";
import type { NotificationListItemResponse } from "../../../../../types/notification";

interface Props {
  notification: NotificationListItemResponse;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAfterClick?: () => void;
  /** "list" = subtle blue unread bg (default). "toast" = navy bg + gold border, no hover, no unread dot. */
  variant?: "list" | "toast";
}

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
  onAfterClick,
  variant = "list",
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decrementUnread } = useNotifications();
  const config = notificationTypeConfig[notification.type];
  const Icon = config.icon;
  const isToast = variant === "toast";

  const handleClick = () => {
    if (!notification.isRead) {
      onRead?.(notification.id);
      decrementUnread();
      notificationAPI.markNotificationAsRead(notification.id).catch(() => {
        console.warn("Failed to mark notification as read");
      });
    }
    if (user) {
      const href = getNotificationHref(notification, user.roleKey);
      if (href) navigate(href);
    }
    onAfterClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  const containerClass = notification.isRead
    ? `border-gray-200 bg-white ${isToast ? "" : "hover:bg-gray-50"}`
    : isToast
      ? "border-accent bg-primary"
      : "border-blue-200 bg-blue-50 hover:bg-blue-100";

  const messageClass =
    isToast && !notification.isRead
      ? "font-semibold text-white"
      : notification.isRead
        ? "font-normal text-primary"
        : "font-semibold text-primary";

  const timestampClass =
    isToast && !notification.isRead ? "text-white/60" : "text-gray-400";

  return (
    <div
      onClick={handleClick}
      className={`group relative flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${containerClass}`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${config.bg}`}
      >
        <Icon className={`h-4 w-4 ${config.color}`} strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${messageClass}`}>{notification.message}</p>
          {!notification.isRead && !isToast && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent group-hover:opacity-0 transition-opacity" />
          )}
        </div>
        <p className={`mt-1 text-xs ${timestampClass}`}>
          {formatDateTime(notification.createdAt)}
        </p>
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
