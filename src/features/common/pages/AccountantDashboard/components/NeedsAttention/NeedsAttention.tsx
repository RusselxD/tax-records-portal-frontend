import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, XCircle } from "lucide-react";
import type {
  TaxRecordTaskRejectedItemResponse,
  TaxRecordTaskOverdueItemResponse,
} from "../../../../../../types/tax-record-task";
import { taxRecordTaskAPI } from "../../../../../../api/tax-record-task";
import { getErrorMessage } from "../../../../../../lib/api-error";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../../constants/roles";
import OverdueTable from "./components/OverdueTable";
import RejectedTable from "./components/RejectedTable";

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton h-10 w-full rounded-md"></div>
      <div className="skeleton h-10 w-full rounded-md"></div>
      <div className="skeleton h-10 w-full rounded-md"></div>
      <div className="skeleton h-10 w-full rounded-md"></div>
      <div className="skeleton h-10 w-full rounded-md"></div>
    </div>
  );
}

function ErrorRetry({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-4 bg-white rounded-lg custom-shadow px-4 py-6 text-center">
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

export default function NeedsAttention() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [overDueTasks, setOverDueTasks] = useState<
    TaxRecordTaskOverdueItemResponse[]
  >([]);
  const [overDueTasksIsFetching, setOverDueTasksIsFetching] = useState(true);
  const [overDueTasksError, setOverDueTasksError] = useState<string | null>(
    null,
  );

  const [rejectedTasks, setRejectedTasks] = useState<
    TaxRecordTaskRejectedItemResponse[]
  >([]);
  const [rejectedTasksIsFetching, setRejectedTasksIsFetching] = useState(true);
  const [rejectedTasksError, setRejectedTasksError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchOverdue() {
      try {
        const data = await taxRecordTaskAPI.getOverdueTasks();
        if (!cancelled) setOverDueTasks(data);
      } catch (err) {
        if (!cancelled) setOverDueTasksError(getErrorMessage(err));
      } finally {
        if (!cancelled) setOverDueTasksIsFetching(false);
      }
    }

    async function fetchRejected() {
      try {
        const data = await taxRecordTaskAPI.getRejectedTasks();
        if (!cancelled) setRejectedTasks(data);
      } catch (err) {
        if (!cancelled) setRejectedTasksError(getErrorMessage(err));
      } finally {
        if (!cancelled) setRejectedTasksIsFetching(false);
      }
    }

    fetchOverdue();
    fetchRejected();
    return () => {
      cancelled = true;
    };
  }, []);

  const showOverdue =
    overDueTasksIsFetching || overDueTasksError || overDueTasks.length > 0;
  const showRejected =
    rejectedTasksIsFetching || rejectedTasksError || rejectedTasks.length > 0;

  if (!showOverdue && !showRejected) return null;

  const handleRowClick = (id: string) =>
    navigate(`/${prefix}/tax-record-task/${id}`);

  return (
    <div>
      {overDueTasksIsFetching && (
        <div className="mb-2">
          <TableSkeleton />
        </div>
      )}

      {!overDueTasksIsFetching && overDueTasksError && (
        <>
          <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-600">
            <Clock className="w-4 h-4 text-red-400" />
            Overdue Tasks
          </h3>
          <ErrorRetry
            message={overDueTasksError}
            onRetry={() => {
              setOverDueTasksIsFetching(true);
              setOverDueTasksError(null);
              taxRecordTaskAPI
                .getOverdueTasks()
                .then(setOverDueTasks)
                .catch((err) => setOverDueTasksError(getErrorMessage(err)))
                .finally(() => setOverDueTasksIsFetching(false));
            }}
          />
        </>
      )}

      {!overDueTasksIsFetching &&
        !overDueTasksError &&
        overDueTasks.length > 0 && (
          <OverdueTable tasks={overDueTasks} onRowClick={handleRowClick} />
        )}

      {rejectedTasksIsFetching && <TableSkeleton />}

      {!rejectedTasksIsFetching && rejectedTasksError && (
        <>
          <h3 className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-600">
            <XCircle className="w-4 h-4 text-red-400" />
            Rejected Tasks
          </h3>
          <ErrorRetry
            message={rejectedTasksError}
            onRetry={() => {
              setRejectedTasksIsFetching(true);
              setRejectedTasksError(null);
              taxRecordTaskAPI
                .getRejectedTasks()
                .then(setRejectedTasks)
                .catch((err) => setRejectedTasksError(getErrorMessage(err)))
                .finally(() => setRejectedTasksIsFetching(false));
            }}
          />
        </>
      )}

      {!rejectedTasksIsFetching &&
        !rejectedTasksError &&
        rejectedTasks.length > 0 && (
          <RejectedTable tasks={rejectedTasks} onRowClick={handleRowClick} />
        )}
    </div>
  );
}
