import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { UserRole } from "../constants";
import { notificationAPI } from "../api/notification";

interface NotificationsContextType {
  unreadCount: number;
  decrementUnread: () => void;
  refetchUnreadCount: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { unread } = await notificationAPI.countUnreadNotifications();
      setUnreadCount(unread);
    } catch {
      // fail silently — badge is non-critical
    }
  }, []);

  useEffect(() => {
    if (!user || user.roleKey === UserRole.CLIENT || user.roleKey === UserRole.VIEWER) return;
    let cancelled = false;

    (async () => {
      try {
        const { unread } = await notificationAPI.countUnreadNotifications();
        if (!cancelled) setUnreadCount(unread);
      } catch {
        // fail silently — badge is non-critical
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  const decrementUnread = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({ unreadCount, decrementUnread, refetchUnreadCount: fetchUnreadCount }),
    [unreadCount, decrementUnread, fetchUnreadCount],
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
