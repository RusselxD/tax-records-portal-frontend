import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useWebSocket, type WebSocketMessage } from "./WebSocketContext";
import type { NotificationListItemResponse } from "../types/notification";

interface LiveNotification {
  /** Unique key for the toast (notification id + enqueuedAt to allow duplicates) */
  key: string;
  notification: NotificationListItemResponse;
}

interface NotificationsContextType {
  unreadCount: number;
  decrementUnread: () => void;
  liveNotifications: LiveNotification[];
  dismissLiveNotification: (key: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const LIVE_QUEUE_CAP = 3;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { subscribe } = useWebSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([]);

  useEffect(() => {
    return subscribe("UNREAD_COUNT_UPDATE", (msg: WebSocketMessage) => {
      if (typeof msg.payload === "number") {
        setUnreadCount(msg.payload);
      }
    });
  }, [subscribe]);

  useEffect(() => {
    return subscribe("NEW_NOTIFICATION", (msg: WebSocketMessage) => {
      const notification = msg.payload as NotificationListItemResponse;
      if (!notification?.id) return;
      const entry: LiveNotification = {
        key: `${notification.id}-${Date.now()}`,
        notification,
      };
      setLiveNotifications((prev) => {
        const next = [...prev, entry];
        return next.length > LIVE_QUEUE_CAP ? next.slice(-LIVE_QUEUE_CAP) : next;
      });
    });
  }, [subscribe]);

  const decrementUnread = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const dismissLiveNotification = useCallback((key: string) => {
    setLiveNotifications((prev) => prev.filter((n) => n.key !== key));
  }, []);

  const value = useMemo(
    () => ({ unreadCount, decrementUnread, liveNotifications, dismissLiveNotification }),
    [unreadCount, decrementUnread, liveNotifications, dismissLiveNotification],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
