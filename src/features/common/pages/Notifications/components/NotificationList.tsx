import { useEffect, useRef } from "react";
import { Bell, Loader2 } from "lucide-react";
import NotificationItem from "./NotificationItem";
import type { NotificationListItemResponse } from "../../../../../types/notification";

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
        if (entries[0]?.isIntersecting) onLoadMore();
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
