import { useState, useEffect, useMemo } from "react";
import { clientAPI } from "../../../../../api/client";
import { NOTICE_TYPE } from "../../../../../types/client";
import type { ClientNoticeResponse } from "../../../../../types/client";

export default function useClientNotices() {
  const [notices, setNotices] = useState<ClientNoticeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const data = await clientAPI.getMyNotices();
        if (!cancelled) setNotices(data);
      } catch {
        // silent — sections show empty state
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const reminders = useMemo(
    () => notices.filter((n) => n.type === NOTICE_TYPE.REMINDER),
    [notices]
  );

  const pendingDocuments = useMemo(
    () => notices.filter((n) => n.type === NOTICE_TYPE.PENDING_DOCUMENT),
    [notices]
  );

  const highlights = useMemo(
    () => notices.filter((n) => n.type === NOTICE_TYPE.HIGHLIGHT),
    [notices]
  );

  return { reminders, pendingDocuments, highlights, isLoading };
}
