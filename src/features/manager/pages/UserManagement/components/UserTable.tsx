import { useState, useCallback, useMemo } from "react";
import { SquarePen, Send, Power } from "lucide-react";
import {
  AccountStatus,
  UserAvatar,
  ResponsiveTable,
  KebabMenu,
  KebabMenuItem,
} from "../../../../../components/common";
import Dropdown from "../../../../../components/common/Dropdown";
import type { CardField } from "../../../../../components/common/ResponsiveTable";
import { useUserManagement } from "../context/UserManagementContext";
import { USER_STATUS, type ManagedUser } from "../../../../../types/user";
import UserFormModal from "./UserFormModal";
import ResendActivationModal from "./ResendActivationModal";
import DeactivateUserModal from "./DeactivateUserModal";

const roleStyles: Record<string, string> = {
  "Client Service Delivery": "bg-blue-50 text-blue-700 border border-blue-200",
  "Quality, Training & Development": "bg-violet-50 text-violet-700 border border-violet-200",
  "Onboarding, Offboarding & Support": "bg-amber-50 text-amber-700 border border-amber-200",
  "Internal Accounting / Billing": "bg-teal-50 text-teal-700 border border-teal-200",
  "Manager": "bg-rose-50 text-rose-700 border border-rose-200",
};

const RoleBadge = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${roleStyles[role] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}
  >
    {role}
  </span>
);

const roleOptions = [
  { label: "All Roles", value: "" },
  { label: "Manager", value: "MANAGER" },
  { label: "Onboarding, Offboarding & Support", value: "OOS" },
  { label: "Quality, Training & Development", value: "QTD" },
  { label: "Client Service Delivery", value: "CSD" },
  { label: "Internal Accounting / Billing", value: "BILLING" },
];

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: USER_STATUS.PENDING },
  { label: "Active", value: USER_STATUS.ACTIVE },
  { label: "Deactivated", value: USER_STATUS.DEACTIVATED },
];

function TableHeader() {
  const {
    roleFilter,
    statusFilter,
    positionFilter,
    positions,
    setRoleFilter,
    setStatusFilter,
    setPositionFilter,
  } = useUserManagement();

  const positionOptions = useMemo(
    () => [
      { label: "All Positions", value: "" },
      ...positions.map((p) => ({ label: p, value: p })),
    ],
    [positions],
  );

  return (
    <thead>
      <tr className="border-b border-gray-200">
        <th className="th-label">Name</th>
        <th className="th-label">Email</th>
        <th className="th-label">
          <Dropdown
            headerStyle
            portal
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="Role"
          />
        </th>
        <th className="th-label">
          <Dropdown
            headerStyle
            portal
            options={positionOptions}
            value={positionFilter}
            onChange={setPositionFilter}
            placeholder="Position"
          />
        </th>
        <th className="th-label">
          <Dropdown
            headerStyle
            portal
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
          />
        </th>
        <th className="th-label">Actions</th>
      </tr>
    </thead>
  );
}

type ModalType = "edit" | "resend" | "deactivate";

function UserActions({
  user,
  onOpenModal,
}: {
  user: ManagedUser;
  onOpenModal: (type: ModalType) => void;
}) {
  const isPending = user.status === USER_STATUS.PENDING;
  const isActive = user.status === USER_STATUS.ACTIVE;
  const isDeactivated = user.status === USER_STATUS.DEACTIVATED;

  return (
    <div className="flex items-center gap-1">
      {/* Resend Activation — PENDING only */}
      {isPending && (
        <button
          onClick={() => onOpenModal("resend")}
          title="Resend activation email"
          className="p-1.5 text-gray-400 hover:text-accent transition-colors rounded hover:bg-gray-100"
        >
          <Send className="w-4 h-4" />
        </button>
      )}

      {/* Edit — ACTIVE or DEACTIVATED */}
      {(isActive || isDeactivated) && (
        <button
          onClick={() => onOpenModal("edit")}
          title="Edit user"
          className="p-1.5 text-gray-400 hover:text-accent transition-colors rounded hover:bg-gray-100"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      )}

      {/* Deactivate/Reactivate — ACTIVE or DEACTIVATED */}
      {(isActive || isDeactivated) && (
        <button
          onClick={() => onOpenModal("deactivate")}
          title={isActive ? "Deactivate user" : "Reactivate user"}
          className={`p-1.5 transition-colors rounded hover:bg-gray-100 ${
            isDeactivated
              ? "text-emerald-400 hover:text-emerald-600"
              : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Power className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function MobileUserActions({
  user,
  onOpenModal,
}: {
  user: ManagedUser;
  onOpenModal: (type: ModalType) => void;
}) {
  const isPending = user.status === USER_STATUS.PENDING;
  const isActive = user.status === USER_STATUS.ACTIVE;
  const isDeactivated = user.status === USER_STATUS.DEACTIVATED;

  const hasActions = isPending || isActive || isDeactivated;
  if (!hasActions) return null;

  return (
    <KebabMenu>
      {isPending && (
        <KebabMenuItem onClick={() => onOpenModal("resend")}>
          Resend Activation
        </KebabMenuItem>
      )}
      {(isActive || isDeactivated) && (
        <KebabMenuItem onClick={() => onOpenModal("edit")}>
          Edit User
        </KebabMenuItem>
      )}
      {(isActive || isDeactivated) && (
        <KebabMenuItem
          onClick={() => onOpenModal("deactivate")}
          variant={isActive ? "danger" : "default"}
        >
          {isActive ? "Deactivate" : "Reactivate"}
        </KebabMenuItem>
      )}
    </KebabMenu>
  );
}

function UserRow({ user }: { user: ManagedUser }) {
  const { updateUser, refetch } = useUserManagement();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} profileUrl={user.profileUrl} />
            <span className="text-sm font-medium text-primary">
              {user.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
        <td className="px-4 py-4">
          <RoleBadge role={user.roleName} />
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">{user.position}</td>
        <td className="px-4 py-4">
          <AccountStatus status={user.status} />
        </td>
        <td className="px-4 py-4">
          <UserActions
            user={user}
            onOpenModal={(type) => setActiveModal(type)}
          />
        </td>
      </tr>

      {activeModal === "edit" && (
        <UserFormModal
          user={user}
          setModalOpen={(open) => {
            if (!open) closeModal();
          }}
          onSuccess={(updated) => updateUser(updated)}
        />
      )}

      {activeModal === "resend" && (
        <ResendActivationModal
          user={user}
          setModalOpen={(open) => {
            if (!open) closeModal();
          }}
          onSuccess={() => refetch()}
        />
      )}

      {activeModal === "deactivate" && (
        <DeactivateUserModal
          user={user}
          setModalOpen={(open) => {
            if (!open) closeModal();
          }}
          onSuccess={(updated) => updateUser(updated)}
        />
      )}
    </>
  );
}

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full skeleton shrink-0" />
            <div className="h-4 w-32 rounded skeleton" />
          </div>
        </td>
        {Array.from({ length: 5 }).map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 w-24 rounded skeleton" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const EmptyState = () => (
  <tbody>
    <tr>
      <td
        colSpan={6}
        className="px-4 py-12 text-center text-sm text-gray-500"
      >
        No users found.
      </td>
    </tr>
  </tbody>
);

export default function UserTable() {
  const {
    users,
    isFetching,
    error,
    refetch,
    roleFilter,
    statusFilter,
    positionFilter,
    positions,
    setRoleFilter,
    setStatusFilter,
    setPositionFilter,
  } = useUserManagement();

  const positionOptions = useMemo(
    () => [
      { label: "All Positions", value: "" },
      ...positions.map((p) => ({ label: p, value: p })),
    ],
    [positions],
  );

  const keyExtractor = useCallback((user: ManagedUser) => user.id, []);

  const primaryFields = useCallback(
    (user: ManagedUser): CardField[] => [
      {
        label: "Name",
        value: (
          <div className="flex items-center gap-2">
            <UserAvatar name={user.name} profileUrl={user.profileUrl} size="sm" />
            <span>{user.name}</span>
          </div>
        ),
      },
      { label: "Role", value: <RoleBadge role={user.roleName} /> },
      { label: "Status", value: <AccountStatus status={user.status} /> },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (user: ManagedUser): CardField[] => [
      { label: "Email", value: user.email },
      { label: "Position", value: user.position },
    ],
    [],
  );

  const renderActions = useCallback(
    (user: ManagedUser) => <MobileCardActions user={user} />,
    [],
  );

  if (error) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
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
    <div className="rounded-lg bg-white custom-shadow">
      <ResponsiveTable
        data={users}
        keyExtractor={keyExtractor}
        primaryFields={primaryFields}
        secondaryFields={secondaryFields}
        actions={renderActions}
        isLoading={isFetching}
        emptyMessage="No users found."
        mobileFilters={
          <>
            <Dropdown
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Role"
              className="flex-1 min-w-0"
            />
            <Dropdown
              options={positionOptions}
              value={positionFilter}
              onChange={setPositionFilter}
              placeholder="Position"
              className="flex-1 min-w-0"
            />
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
              className="flex-1 min-w-0"
            />
          </>
        }
      >
        <table className="w-full">
          <TableHeader />
          {isFetching ? (
            <TableSkeleton />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          )}
        </table>
      </ResponsiveTable>
    </div>
  );
}

/** Wrapper so each mobile card gets its own modal state */
function MobileCardActions({ user }: { user: ManagedUser }) {
  const { updateUser, refetch } = useUserManagement();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <MobileUserActions user={user} onOpenModal={(type) => setActiveModal(type)} />

      {activeModal === "edit" && (
        <UserFormModal
          user={user}
          setModalOpen={(open) => { if (!open) closeModal(); }}
          onSuccess={(updated) => updateUser(updated)}
        />
      )}
      {activeModal === "resend" && (
        <ResendActivationModal
          user={user}
          setModalOpen={(open) => { if (!open) closeModal(); }}
          onSuccess={() => refetch()}
        />
      )}
      {activeModal === "deactivate" && (
        <DeactivateUserModal
          user={user}
          setModalOpen={(open) => { if (!open) closeModal(); }}
          onSuccess={(updated) => updateUser(updated)}
        />
      )}
    </>
  );
}
