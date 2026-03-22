import { useEffect, useState, useCallback } from "react";
import { CheckCheck } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { notificationAPI } from "../../../../api/notification";
import { useNotifications } from "../../../../contexts/NotificationsContext";
import { useToast } from "../../../../contexts/ToastContext";
import NotificationList from "./components/NotificationList";
import type { NotificationListItemResponse } from "../../../../types/notification";

type FilterTab = "all" | "unread";

export default function Notifications() {
  usePageTitle("Notifications");
  const { refetchUnreadCount } = useNotifications();
  const { toastError } = useToast();

  const [notifications, setNotifications] = useState<NotificationListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");

  const hasUnread = notifications.some((n) => !n.isRead);

  const fetchInitial = useCallback(async (tab: FilterTab) => {
    setLoading(true);
    try {
      const data = await notificationAPI.getMyNotifications(0, tab === "unread");
      setNotifications(data.content);
      setHasMore(data.hasMore);
      setPage(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitial(filter);
  }, [filter, fetchInitial]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await notificationAPI.getMyNotifications(nextPage, filter === "unread");
      setNotifications((prev) => [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, filter]);

  const handleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // Optimistic: remove immediately, revert on failure
    let snapshot: NotificationListItemResponse[] = [];
    setNotifications((prev) => {
      snapshot = prev;
      return prev.filter((n) => n.id !== id);
    });

    try {
      await notificationAPI.deleteNotification(id);
      refetchUnreadCount();
    } catch {
      setNotifications(snapshot);
      toastError("Failed to delete notification.");
    }
  }, [refetchUnreadCount, toastError]);

  const handleMarkAllRead = useCallback(async () => {
    // Optimistic: mark all read immediately, revert on failure
    let snapshot: NotificationListItemResponse[] = [];
    setNotifications((prev) => {
      snapshot = prev;
      return prev.map((n) => ({ ...n, isRead: true }));
    });

    try {
      await notificationAPI.markAllAsRead();
      refetchUnreadCount();
    } catch {
      setNotifications(snapshot);
      toastError("Failed to mark all as read.");
    }
  }, [refetchUnreadCount, toastError]);

  const handleFilterChange = (tab: FilterTab) => {
    if (tab === filter) return;
    setFilter(tab);
  };

  return (
    <div className="space-y-4 -mt-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("unread")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Mark all read */}
        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onRead={handleRead}
        onDelete={handleDelete}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
