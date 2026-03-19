import { useParams } from "react-router-dom";
import usePageTitle from "../../../../hooks/usePageTitle";
import NotFound from "../../../../pages/NotFound";
import {
  TaxRecordTaskDetailsProvider,
  useTaxRecordTaskDetails,
} from "./context/TaxRecordTaskDetailsContext";
import TaskHeader from "./components/TaskHeader";
import TaskStatusBanner from "./components/TaskStatusBanner";
import TaskInfoPanel from "./components/TaskInfoPanel";
import TaskFiles from "./components/TaskFiles";
import TaskActions from "./components/TaskActions";
import ClientSummaryCard from "../../../../components/common/ClientSummaryCard";
import { useAuth } from "../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../constants";
import TaskActivityLogs from "./components/TaskActivityLogs";

function TaxRecordTaskDetailsContent() {
  const { task, isLoading, error, notFound, refetch } = useTaxRecordTaskDetails();
  const { user } = useAuth();
  const prefix = getRolePrefix(user!.roleKey);

  usePageTitle(task?.taskName ?? "Task Details");

  if (notFound) return <NotFound inline />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div>
          <div className="h-4 w-40 rounded skeleton mb-2" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-64 rounded skeleton" />
            <div className="h-6 w-20 rounded-full skeleton" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          <div className="space-y-4">
            {/* Info panel skeleton */}
            <div className="rounded-lg bg-white custom-shadow p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-20 rounded skeleton" />
                    <div className="h-5 w-full rounded skeleton" />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded skeleton" />
                <div className="h-16 w-full rounded skeleton" />
              </div>
            </div>
            {/* Files skeleton */}
            <div className="rounded-lg bg-white custom-shadow p-5 space-y-3">
              <div className="h-5 w-32 rounded skeleton" />
              <div className="space-y-2">
                <div className="h-10 w-full rounded skeleton" />
                <div className="h-10 w-full rounded skeleton" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Client summary skeleton */}
            <div className="rounded-lg bg-white custom-shadow p-5 space-y-4">
              <div className="h-5 w-36 rounded skeleton" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
            </div>
            {/* Activity logs skeleton */}
            <div className="rounded-lg bg-white custom-shadow p-5 space-y-4">
              <div className="h-5 w-28 rounded skeleton" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full skeleton shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-full rounded skeleton" />
                    <div className="h-3 w-2/3 rounded skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">
          {error || "Task not found."}
        </p>
        <button
          onClick={refetch}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskHeader />
      <TaskStatusBanner />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* Main content */}
        <div className="space-y-4">
          <TaskInfoPanel />
          <TaskFiles />
          <TaskActions />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ClientSummaryCard
            clientId={task.clientId}
            linkTo={`${prefix}/client-details/${task.clientId}`}
          />
          <TaskActivityLogs />
        </div>
      </div>
    </div>
  );
}

export default function TaxRecordTaskDetails() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <TaxRecordTaskDetailsProvider taskId={id}>
      <TaxRecordTaskDetailsContent />
    </TaxRecordTaskDetailsProvider>
  );
}
