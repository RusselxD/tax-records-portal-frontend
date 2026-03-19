import { useEffect, useState, useCallback } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { notificationAPI } from "../../../../api/notification";
import NotificationList from "../../../common/pages/Notifications/components/NotificationList";
import type { NotificationListItemResponse } from "../../../../types/notification";

export default function Notifications() {
  usePageTitle("Notifications");

  const [notifications, setNotifications] = useState<NotificationListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await notificationAPI.getMyNotifications(0);
        setNotifications(data.content);
        setHasMore(data.hasMore);
        setPage(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await notificationAPI.getMyNotifications(nextPage);
      setNotifications((prev) => [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  const handleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  return (
    <div className="space-y-4">
      <NotificationList
        notifications={notifications}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onRead={handleRead}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
