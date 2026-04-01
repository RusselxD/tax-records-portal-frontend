import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Pencil, ArrowUpRight, Settings2, FileText, User, MessageSquareText, Users } from "lucide-react";
import { CLIENT_STATUS } from "../../../../types/client";
import usePageTitle from "../../../../hooks/usePageTitle";
import NotFound from "../../../../pages/NotFound";
import { getRolePrefix } from "../../../../constants/roles";
import { Permission, hasPermission } from "../../../../constants";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  ClientInfoPageShell,
  ClientInfoSections,
  ActivityLogs,
} from "../../components/client-info";
import {
  ClientDetailsProvider,
  useClientDetails,
} from "./context/ClientDetailsContext";
import ActivateAccountCard from "../ClientOnboardingPreview/components/ActivateAccountCard";
import ChangeClientStatusModal from "../ClientOnboardingPreview/components/ChangeClientStatusModal";
import ClientAccountsSection from "./components/ClientAccountsSection";
import ClientTasks from "./components/ClientTasks";
import ClientTaxRecords from "./components/ClientTaxRecords";
import ClientBilling from "./components/OutstandingBilling";
import CreateNotice from "./components/CreateNotice";
import SnapshotBanner from "./components/SnapshotBanner";
import OffboardingBanner from "./components/OffboardingBanner";
import SendEngagementLetterModal from "./components/SendEngagementLetterModal";
import ClientConsultations from "./components/ClientConsultations";
import ReassignAccountantsModal from "./components/ReassignAccountantsModal";

interface LocationState {
  backLabel?: string;
  backTo?: string;
}

type Tab = "profile" | "tax-records" | "consultations";

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
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [taxRecordsMounted, setTaxRecordsMounted] = useState(false);
  const [consultationsMounted, setConsultationsMounted] = useState(false);

  if (notFound) return <NotFound inline />;

  const isSnapshot = mode === "snapshot";
  const isOnboarding = status === CLIENT_STATUS.ONBOARDING;
  const hasPendingUpdate = header?.taskReview?.hasActiveTask;
  const isAssignedAccountant =
    header?.accountants?.csdOos?.some((a) => a.id === user?.id) ?? false;
  const canEditProfile =
    !isOnboarding && !isSnapshot && isAssignedAccountant && !hasPendingUpdate;

  const canReview = hasPermission(
    user?.permissions,
    Permission.CLIENT_INFO_REVIEW,
  );
  const canManageStatus =
    !isSnapshot && hasPermission(user?.permissions, Permission.CLIENT_MANAGE);
  const canReassign =
    !isSnapshot && !isOnboarding && hasPermission(user?.permissions, Permission.CLIENT_REASSIGN);
  const canPostNotice =
    !isSnapshot &&
    !isOnboarding &&
    hasPermission(user?.permissions, Permission.REMINDER_CREATE);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const backLabel =
    state.backLabel || (isSnapshot ? "Client Onboarding" : "Client List");
  const backTo = state.backTo || "..";

  const isOffboarding = status === CLIENT_STATUS.OFFBOARDING;

  const banner =
    isSnapshot && snapshotDate ? (
      <SnapshotBanner snapshotDate={snapshotDate} />
    ) : isOffboarding && header ? (
      <OffboardingBanner
        clientId={clientId}
        header={header}
        onSendLetter={() => setLetterModalOpen(true)}
        onProtectionChange={() => refetch()}
      />
    ) : undefined;

  // Show tabs only in live mode for non-onboarding clients
  const showTabs = !isSnapshot && !isOnboarding && !isLoading && !error;

  const sidebar = (
    <>
      {isSnapshot || isOnboarding ? (
        <ActivityLogs taskId={header?.taskReview?.activeTaskId ?? null} />
      ) : (
        <>
          <ClientTasks />
          <ClientBilling clientId={clientId} />
        </>
      )}
    </>
  );

  const mainDetailsAction = canEditProfile ? (
    <button
      onClick={() => navigate(`/${prefix}/client-edit/${clientId}`)}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors"
    >
      <Pencil className="w-3.5 h-3.5" />
      Edit Profile
    </button>
  ) : hasPendingUpdate &&
    header?.taskReview?.activeTaskId &&
    (canReview || isAssignedAccountant) ? (
    <button
      onClick={() =>
        navigate(`/${prefix}/profile-update-review/${header.taskReview?.activeTaskId}`)
      }
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors"
    >
      <ArrowUpRight className="w-3.5 h-3.5" />
      View Pending Update
    </button>
  ) : undefined;

  const reassignAction = canReassign ? (
    <button
      onClick={() => setReassignModalOpen(true)}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors"
    >
      <Users className="w-3.5 h-3.5" />
      Reassign
    </button>
  ) : undefined;

  const changeStatusButton =
    canManageStatus && status ? (
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
        {/* Tabs */}
        {showTabs && (
          <div className="flex items-center gap-2 mb-4 bg-white py-2 px-3 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-accent text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => { setActiveTab("tax-records"); setTaxRecordsMounted(true); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "tax-records"
                  ? "bg-accent text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Tax Records
            </button>
            <button
              onClick={() => { setActiveTab("consultations"); setConsultationsMounted(true); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "consultations"
                  ? "bg-accent text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              Consultations
            </button>
          </div>
        )}

        {/* Profile tab (default) */}
        <div className={`space-y-3 ${activeTab === "profile" || !showTabs ? "" : "hidden"}`}>
          {!isSnapshot && isAssignedAccountant &&
            (header?.isProfileApproved ?? false) &&
            clientAccounts.length === 0 && (
              <ActivateAccountCard
                clientId={clientId}
                pocEmail={header?.pocEmail ?? null}
                onSuccess={refetch}
              />
            )}

          {clientAccounts.length > 0 && (
            <ClientAccountsSection
              clientId={clientId}
              accounts={clientAccounts}
              onRefresh={refetch}
            />
          )}

          {header && (
            <ClientInfoSections
              getSection={getSection}
              fetchSection={fetchSection}
              classification={header.taxpayerClassification}
              assignedCsdOos={header.accountants?.csdOos ?? []}
              assignedQtd={header.accountants?.qtd ?? []}
              mainDetailsAction={
                (mainDetailsAction || reassignAction) ? (
                  <div className="flex items-center gap-3">
                    {reassignAction}
                    {mainDetailsAction}
                  </div>
                ) : undefined
              }
            />
          )}

          {canPostNotice && <CreateNotice clientId={clientId} />}
        </div>

        {/* Tax Records tab — mount on first switch, hide/show via CSS */}
        {showTabs && taxRecordsMounted && (
          <div className={activeTab === "tax-records" ? "" : "hidden"}>
            <ClientTaxRecords clientId={clientId} />
          </div>
        )}

        {/* Consultations tab — mount on first switch, hide/show via CSS */}
        {showTabs && consultationsMounted && (
          <div className={activeTab === "consultations" ? "" : "hidden"}>
            <ClientConsultations clientId={clientId} />
          </div>
        )}
      </ClientInfoPageShell>

      {statusModalOpen && status && (
        <ChangeClientStatusModal
          clientId={clientId}
          currentStatus={status}
          setModalOpen={setStatusModalOpen}
          onSuccess={(newStatus) => { setStatus(newStatus); refetch(); }}
        />
      )}

      {letterModalOpen && (
        <SendEngagementLetterModal
          clientId={clientId}
          setModalOpen={setLetterModalOpen}
          onSuccess={refetch}
        />
      )}

      {reassignModalOpen && header && (
        <ReassignAccountantsModal
          clientId={clientId}
          currentCsdOos={header.accountants?.csdOos ?? []}
          currentQtd={header.accountants?.qtd ?? []}
          setModalOpen={setReassignModalOpen}
          onSuccess={refetch}
        />
      )}
    </>
  );
}

export default function ClientInfoView({
  mode = "live",
}: {
  mode?: "live" | "snapshot";
}) {
  const { id } = useParams<{ id: string }>();
  usePageTitle(mode === "snapshot" ? "Client Snapshot" : "Client Details");

  if (!id) return null;

  return (
    <ClientDetailsProvider clientId={id} mode={mode}>
      <ClientDetailsContent />
    </ClientDetailsProvider>
  );
}
