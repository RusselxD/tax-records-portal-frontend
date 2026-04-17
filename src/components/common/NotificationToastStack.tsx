import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationsContext";
import NotificationItem from "../../features/common/pages/Notifications/components/NotificationItem";
import type { NotificationListItemResponse } from "../../types/notification";

const AUTO_DISMISS_MS = 9000;
const EXIT_ANIMATION_MS = 250;

function ToastCard({
  notification,
  onDismiss,
}: {
  notification: NotificationListItemResponse;
  onDismiss: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(AUTO_DISMISS_MS);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const triggerExit = () => {
    if (exiting) return;
    setExiting(true);
    if (dismissTimerRef.current != null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    exitTimerRef.current = window.setTimeout(onDismiss, EXIT_ANIMATION_MS);
  };

  const startDismissTimer = () => {
    startTimeRef.current = Date.now();
    dismissTimerRef.current = window.setTimeout(triggerExit, remainingRef.current);
  };

  const pauseDismissTimer = () => {
    if (dismissTimerRef.current == null) return;
    window.clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = null;
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  useEffect(() => {
    startDismissTimer();
    return () => {
      if (dismissTimerRef.current != null) window.clearTimeout(dismissTimerRef.current);
      if (exitTimerRef.current != null) window.clearTimeout(exitTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerExit();
  };

  const translateClass = exiting
    ? "-translate-x-[120%] opacity-0"
    : entered
      ? "translate-x-0 opacity-100"
      : "-translate-x-[120%] opacity-0";

  return (
    <div
      onMouseEnter={pauseDismissTimer}
      onMouseLeave={startDismissTimer}
      className={`pointer-events-auto relative w-[360px] shadow-lg rounded-lg transition-all duration-[250ms] ease-out ${translateClass}`}
    >
      <NotificationItem
        notification={notification}
        onAfterClick={triggerExit}
        variant="toast"
      />
      <button
        onClick={handleDismissClick}
        className="absolute top-3 right-3 p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all"
        title="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationToastStack() {
  const { liveNotifications, dismissLiveNotification } = useNotifications();

  if (liveNotifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col-reverse gap-2">
      {liveNotifications.map(({ key, notification }) => (
        <ToastCard
          key={key}
          notification={notification}
          onDismiss={() => dismissLiveNotification(key)}
        />
      ))}
    </div>
  );
}
