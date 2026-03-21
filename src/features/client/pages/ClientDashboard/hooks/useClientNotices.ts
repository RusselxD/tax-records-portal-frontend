import { useState, useEffect, useCallback, useMemo } from "react";
import { clientAPI } from "../../../../../api/client";
import { NOTICE_TYPE } from "../../../../../types/client";
import type { ClientNoticeResponse } from "../../../../../types/client";

export default function useClientNotices() {
  const [notices, setNotices] = useState<ClientNoticeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clientAPI.getMyNotices();
      setNotices(data);
    } catch {
      // silent — sections show empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

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
