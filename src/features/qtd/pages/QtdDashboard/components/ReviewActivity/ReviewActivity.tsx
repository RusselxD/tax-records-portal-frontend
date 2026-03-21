import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../../constants/roles";
import { taxRecordTaskAPI } from "../../../../../../api/tax-record-task";
import { getErrorMessage } from "../../../../../../lib/api-error";
import type {
  ReviewerQueueItemResponse,
  ReviewerDecidedItemResponse,
} from "../../../../../../types/tax-record-task";
import QueueTable from "./components/QueueTable";
import DecidedTable from "./components/DecidedTable";

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-10 w-full rounded-md" />
      ))}
    </div>
  );
}

function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-lg custom-shadow px-4 py-6 text-center">
      <p className="text-sm text-status-rejected mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm text-accent hover:text-accent-hover font-medium"
      >
        Try again
      </button>
    </div>
  );
}

export default function ReviewActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [queue, setQueue] = useState<ReviewerQueueItemResponse[]>([]);
  const [queueFetching, setQueueFetching] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  const [decided, setDecided] = useState<ReviewerDecidedItemResponse[]>([]);
  const [decidedFetching, setDecidedFetching] = useState(true);
  const [decidedError, setDecidedError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchQueue() {
      try {
        const data = await taxRecordTaskAPI.getReviewerQueue();
        if (!cancelled) setQueue(data);
      } catch (err) {
        if (!cancelled) setQueueError(getErrorMessage(err));
      } finally {
        if (!cancelled) setQueueFetching(false);
      }
    }

    async function fetchDecided() {
      try {
        const data = await taxRecordTaskAPI.getRecentlyDecided();
        if (!cancelled) setDecided(data);
      } catch (err) {
        if (!cancelled) setDecidedError(getErrorMessage(err));
      } finally {
        if (!cancelled) setDecidedFetching(false);
      }
    }

    fetchQueue();
    fetchDecided();
    return () => { cancelled = true; };
  }, []);

  const handleRowClick = (id: string) => navigate(`/${prefix}/tax-record-task/${id}`);

  return (
    <div className="space-y-5">
      {queueFetching ? (
        <TableSkeleton />
      ) : queueError ? (
        <ErrorRetry
          message={queueError}
          onRetry={async () => {
            setQueueFetching(true);
            setQueueError(null);
            try {
              const data = await taxRecordTaskAPI.getReviewerQueue();
              setQueue(data);
            } catch (err) {
              setQueueError(getErrorMessage(err));
            } finally {
              setQueueFetching(false);
            }
          }}
        />
      ) : (
        <QueueTable tasks={queue} onRowClick={handleRowClick} />
      )}

      {decidedFetching ? (
        <TableSkeleton />
      ) : decidedError ? (
        <ErrorRetry
          message={decidedError}
          onRetry={async () => {
            setDecidedFetching(true);
            setDecidedError(null);
            try {
              const data = await taxRecordTaskAPI.getRecentlyDecided();
              setDecided(data);
            } catch (err) {
              setDecidedError(getErrorMessage(err));
            } finally {
              setDecidedFetching(false);
            }
          }}
        />
      ) : decided.length > 0 ? (
        <DecidedTable tasks={decided} onRowClick={handleRowClick} />
      ) : null}
    </div>
  );
}
