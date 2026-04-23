import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTaskRequests } from "../../../../contexts/TaskRequestsContext";
import { hasPermission, Permission } from "../../../../constants";
import { getRolePrefix } from "../../../../constants/roles";
import { taxRecordTaskRequestAPI } from "../../../../api/tax-record-task-request";
import { getErrorMessage, isNotFoundError } from "../../../../lib/api-error";
import {
  TAX_RECORD_TASK_REQUEST_STATUS,
  type TaxRecordTaskRequestDetailResponse,
} from "../../../../types/tax-record-task-request";
import NotFound from "../../../../pages/NotFound";
import ApproveRequestModal from "./components/ApproveRequestModal";
import RejectRequestModal from "./components/RejectRequestModal";
import RequestHeader from "./components/RequestHeader";
import ProposedTaskCard from "./components/ProposedTaskCard";
import NotesCard from "./components/NotesCard";
import OutcomeCard from "./components/OutcomeCard";
import AuditCard from "./components/AuditCard";
import ReviewActionsCard from "./components/ReviewActionsCard";

export default function TaxRecordTaskRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  usePageTitle("Task Request");
  const { user } = useAuth();
  const { refreshPending } = useTaskRequests();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const canReview = hasPermission(user?.permissions, Permission.TAX_RECORD_TASK_REQUEST_REVIEW);

  const [request, setRequest] = useState<TaxRecordTaskRequestDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const fetchRequest = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxRecordTaskRequestAPI.get(id);
      setRequest(data);
    } catch (err) {
      if (isNotFoundError(err)) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err, "Failed to load request."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  if (notFound) return <NotFound inline />;
  if (!id) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white border border-gray-200 p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button
          onClick={fetchRequest}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!request) return null;

  const isPending = request.status === TAX_RECORD_TASK_REQUEST_STATUS.PENDING;
  const canAct = canReview && isPending;
  const taskLinkPath = request.resultingTaskId
    ? `${prefix}/tax-record-task/${request.resultingTaskId}`
    : "";

  return (
    <div className="space-y-4">
      <RequestHeader request={request} onBack={() => navigate(`${prefix}/task-requests`)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ProposedTaskCard request={request} />
          {request.notes && <NotesCard notes={request.notes} />}
          <OutcomeCard request={request} taskLinkPath={taskLinkPath} />
        </div>

        <div className="space-y-4">
          <AuditCard request={request} />
          {canAct && (
            <ReviewActionsCard
              onApprove={() => setApproveOpen(true)}
              onReject={() => setRejectOpen(true)}
            />
          )}
        </div>
      </div>

      {approveOpen && (
        <ApproveRequestModal
          request={request}
          setModalOpen={setApproveOpen}
          onSuccess={(taskId) => {
            refreshPending();
            navigate(`${prefix}/tax-record-task/${taskId}`);
          }}
        />
      )}

      {rejectOpen && (
        <RejectRequestModal
          requestId={request.id}
          setModalOpen={setRejectOpen}
          onSuccess={() => {
            refreshPending();
            fetchRequest();
          }}
        />
      )}
    </div>
  );
}
