import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import usePageTitle from "../../../../hooks/usePageTitle";
import NotFound from "../../../../pages/NotFound";
import { useAuth } from "../../../../contexts/AuthContext";
import { Permission, hasPermission } from "../../../../constants";
import { CLIENT_STATUS } from "../../../../types/client";
import { ClientInfoPageShell, ClientInfoSections, ActivityLogs } from "../../components/client-info";
import {
  ClientInfoReviewProvider,
  useInfoReview,
} from "./context/ClientOnboardingPreviewContext";
import StatusBanner from "./components/StatusBanner";
import ReviewActions from "./components/ReviewActions";
import ActivateAccountCard from "./components/ActivateAccountCard";
import ClientAccountsSection from "../ClientDetails/components/ClientAccountsSection";
import HandoffCard from "./components/HandoffCard";
import ChangeClientStatusModal from "./components/ChangeClientStatusModal";

interface LocationState {
  backLabel?: string;
  backTo?: string;
}

function InfoReviewContent() {
  const { user } = useAuth();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const {
    taskId,
    clientId,
    header,
    clientName,
    status,
    hasActiveTask,
    lastReviewStatus,
    clientAccounts,
    isLoading,
    error,
    notFound,
    refetch,
    logsVersion,
    getSection,
    fetchSection,
    setStatus,
  } = useInfoReview();

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const perms = user?.permissions;
  const canManageOnboarding = hasPermission(perms, Permission.CLIENT_INFO_CREATE);
  const isReviewer = hasPermission(perms, Permission.CLIENT_INFO_REVIEW);
  const canManageStatus = hasPermission(perms, Permission.CLIENT_MANAGE);

  if (notFound) return <NotFound inline />;

  const backLabel = state.backLabel || "Client List";
  const backTo = state.backTo || "..";

  const changeStatusButton = canManageStatus && status ? (
    <button
      onClick={() => setStatusModalOpen(true)}
      className="text-sm font-medium text-gray-500 hover:text-accent transition-colors border border-gray-200 rounded-md px-3 py-1.5 hover:border-accent"
    >
      Change Status
    </button>
  ) : undefined;

  return (
    <>
    <ClientInfoPageShell
      clientName={clientName}
      status={status || undefined}
      backLabel={backLabel}
      backTo={backTo}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      headerActions={changeStatusButton}
      banner={<StatusBanner status={status || undefined} isReviewer={isReviewer} hasActiveTask={hasActiveTask} lastReviewStatus={lastReviewStatus} clientId={clientId} />}
      sidebar={<ActivityLogs taskId={taskId} refetchSignal={logsVersion} />}
    >
      {canManageOnboarding && (header?.isProfileApproved ?? false) && clientAccounts.length === 0 && (
        <ActivateAccountCard clientId={clientId} pocEmail={header?.pocEmail ?? null} onSuccess={refetch} />
      )}

      {clientAccounts.length > 0 && (
        <ClientAccountsSection clientId={clientId} accounts={clientAccounts} onRefresh={refetch} />
      )}

      {canManageOnboarding && (header?.isProfileApproved ?? false) && !(header?.handedOff) && (
        <HandoffCard
          clientId={clientId}
          creatorId={header?.creatorId ?? null}
          currentQtdId={header?.accountants?.qtd?.[0]?.id ?? null}
          onSuccess={refetch}
        />
      )}

      {header && (
        <ClientInfoSections
          getSection={getSection}
          fetchSection={fetchSection}
          classification={header.taxpayerClassification}
          assignedCsdOos={header.accountants?.csdOos ?? []}
          assignedQtd={header.accountants?.qtd ?? []}
        />
      )}

      {isReviewer && hasActiveTask && status === CLIENT_STATUS.ONBOARDING && (
        <ReviewActions />
      )}
    </ClientInfoPageShell>

    {statusModalOpen && status && (
      <ChangeClientStatusModal
        clientId={clientId}
        currentStatus={status}
        setModalOpen={setStatusModalOpen}
        onSuccess={(newStatus) => setStatus(newStatus)}
      />
    )}
    </>
  );
}

export default function ClientInfoReview() {
  const { id } = useParams<{ id: string }>();
  usePageTitle("Client Details");

  if (!id) return null;

  return (
    <ClientInfoReviewProvider taskId={id}>
      <InfoReviewContent />
    </ClientInfoReviewProvider>
  );
}
