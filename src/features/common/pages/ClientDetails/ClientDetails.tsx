import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Pencil, ArrowUpRight, Settings2 } from "lucide-react";
import { CLIENT_STATUS } from "../../../../types/client";
import usePageTitle from "../../../../hooks/usePageTitle";
import NotFound from "../../../../pages/NotFound";
import { getRolePrefix } from "../../../../constants/roles";
import { Permission, hasPermission } from "../../../../constants";
import { useAuth } from "../../../../contexts/AuthContext";
import { ClientInfoPageShell, ClientInfoSections, ActivityLogs } from "../../components/client-info";
import {
  ClientDetailsProvider,
  useClientDetails,
} from "./context/ClientDetailsContext";
import ActivateAccountCard from "../ClientOnboardingPreview/components/ActivateAccountCard";
import ChangeClientStatusModal from "../ClientOnboardingPreview/components/ChangeClientStatusModal";
import ClientAccountsSection from "./components/ClientAccountsSection";
import ClientTasks from "./components/ClientTasks";
import CreateNotice from "./components/CreateNotice";
import SnapshotBanner from "./components/SnapshotBanner";

interface LocationState {
  backLabel?: string;
  backTo?: string;
}

function ClientDetailsContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = (location.state as LocationState) ?? {};
  const {
    clientId,
    mode,
    header,
    clientName,
    status,
    clientAccounts,
    snapshotDate,
    isLoading,
    error,
    notFound,
    refetch,
    setStatus,
    getSection,
    fetchSection,
  } = useClientDetails();

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  if (notFound) return <NotFound inline />;

  const isSnapshot = mode === "snapshot";
  const isOnboarding = status === CLIENT_STATUS.ONBOARDING;
  const hasPendingUpdate = header?.hasActiveTask;
  const isAssignedAccountant =
    header?.assignedCsdOosAccountants?.some((a) => a.id === user?.id) ?? false;
  const canEditProfile = !isOnboarding && !isSnapshot && isAssignedAccountant && !hasPendingUpdate;

  const canReview = hasPermission(user?.permissions, Permission.CLIENT_INFO_REVIEW);
  const canManageStatus = !isSnapshot && hasPermission(user?.permissions, Permission.CLIENT_MANAGE);
  const canPostNotice = !isSnapshot && !isOnboarding && hasPermission(user?.permissions, Permission.REMINDER_CREATE);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const backLabel = state.backLabel || (isSnapshot ? "Client Onboarding" : "Client List");
  const backTo = state.backTo || "..";

  const banner = isSnapshot && snapshotDate
    ? <SnapshotBanner snapshotDate={snapshotDate} />
    : undefined;

  const sidebar = isSnapshot || isOnboarding
    ? <ActivityLogs taskId={header?.activeTaskId ?? null} />
    : <ClientTasks />;

  const mainDetailsAction = canEditProfile ? (
    <button
      onClick={() => navigate(`/${prefix}/client-edit/${clientId}`)}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors"
    >
      <Pencil className="w-3.5 h-3.5" />
      Edit Profile
    </button>
  ) : hasPendingUpdate && header?.activeTaskId && (canReview || isAssignedAccountant) ? (
    <button
      onClick={() => navigate(`/${prefix}/profile-update-review/${header.activeTaskId}`)}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors"
    >
      <ArrowUpRight className="w-3.5 h-3.5" />
      View Pending Update
    </button>
  ) : undefined;

  const changeStatusButton = canManageStatus && status ? (
    <button
      onClick={() => setStatusModalOpen(true)}
      title="Change Status"
      className="p-1.5 rounded-md text-gray-400 hover:text-accent transition-colors border border-gray-200 hover:border-accent"
    >
      <Settings2 className="w-4 h-4" />
    </button>
  ) : undefined;

  return (
    <>
      <ClientInfoPageShell
        clientName={clientName}
        status={isSnapshot ? undefined : status || undefined}
        backLabel={backLabel}
        backTo={backTo}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        headerActions={changeStatusButton}
        banner={banner}
        sidebar={sidebar}
      >
        {isAssignedAccountant && (header?.isProfileApproved ?? false) && clientAccounts.length === 0 && (
          <ActivateAccountCard clientId={clientId} pocEmail={header?.pocEmail ?? null} onSuccess={refetch} />
        )}

        {clientAccounts.length > 0 && (
          <ClientAccountsSection clientId={clientId} accounts={clientAccounts} onRefresh={refetch} />
        )}

        {header && (
          <ClientInfoSections
            getSection={getSection}
            fetchSection={fetchSection}
            classification={header.taxpayerClassification}
            assignedCsdOos={header.assignedCsdOosAccountants}
            assignedQtd={header.assignedQtdAccountants}
            mainDetailsAction={mainDetailsAction}
          />
        )}

        {canPostNotice && <CreateNotice clientId={clientId} />}
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

export default function ClientInfoView({ mode = "live" }: { mode?: "live" | "snapshot" }) {
  const { id } = useParams<{ id: string }>();
  usePageTitle(mode === "snapshot" ? "Client Snapshot" : "Client Details");

  if (!id) return null;

  return (
    <ClientDetailsProvider clientId={id} mode={mode}>
      <ClientDetailsContent />
    </ClientDetailsProvider>
  );
}
