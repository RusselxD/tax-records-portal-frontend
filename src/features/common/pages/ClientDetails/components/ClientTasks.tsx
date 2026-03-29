import { useState, useEffect, useCallback, useRef } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { SidebarCard } from "../../../components/client-info";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { useClientDetails } from "../context/ClientDetailsContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Permission, hasPermission } from "../../../../../constants";
import type { ClientTaxRecordTaskItem } from "../../../../../types/tax-record-task";
import ClientTaskItem from "./ClientTaskItem";

function TasksSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-4 py-3 space-y-2">
          <div className="h-4 w-3/4 rounded skeleton" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full skeleton" />
            <div className="h-4 w-20 rounded skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-6 text-center">
      <ClipboardList className="h-5 w-5 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-400">No tasks yet</p>
    </div>
  );
}

export default function ClientTasks() {
  const { clientId } = useClientDetails();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ClientTaxRecordTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const showAssignees = hasPermission(user?.permissions, Permission.TASK_VIEW_ALL);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxRecordTaskAPI.getClientTasks(clientId);
      setTasks(data.tasks);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const data = await taxRecordTaskAPI.getClientTasks(clientId, nextCursor);
      setTasks((prev) => [...prev, ...data.tasks]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      setError("Failed to load more tasks.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [clientId, nextCursor, isLoadingMore]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <SidebarCard title="Tasks">
      {isLoading ? (
        <TasksSkeleton />
      ) : error ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-status-rejected mb-2">{error}</p>
          <button
            onClick={fetchTasks}
            className="text-sm text-accent hover:text-accent-hover font-medium"
          >
            Try again
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="max-h-[60dvh] overflow-y-auto">
          {tasks.map((task) => (
            <ClientTaskItem
              key={task.id}
              task={task}
              showAssignees={showAssignees}
            />
          ))}
          {hasMore && (
            <div ref={sentinelRef} className="px-4 py-3 text-center">
              {isLoadingMore && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 mx-auto" />
              )}
            </div>
          )}
        </div>
      )}
    </SidebarCard>
  );
}
