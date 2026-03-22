import { useState } from "react";
import { SquarePen, Send, Power } from "lucide-react";
import { AccountStatus, UserAvatar } from "../../../../../components/common";
import { useUserManagement } from "../context/UserManagementContext";
import type { ManagedUser } from "../../../../../types/user";
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

const COLUMNS = ["Name", "Email", "Role", "Position", "Status", "Actions"];

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200">
      {COLUMNS.map((header) => (
        <th key={header} className="th-label">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

type ModalType = "edit" | "resend" | "deactivate";

function UserActions({
  user,
  onOpenModal,
}: {
  user: ManagedUser;
  onOpenModal: (type: ModalType) => void;
}) {
  const isPending = user.status === "PENDING";
  const isActive = user.status === "ACTIVE";
  const isDeactivated = user.status === "DEACTIVATED";

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
  const { users, isFetching, error, refetch } = useUserManagement();

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
    <div className="overflow-x-auto rounded-lg bg-white custom-shadow">
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
    </div>
  );
}
