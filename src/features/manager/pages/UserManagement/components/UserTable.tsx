import { useState } from "react";
import { SquarePen, KeyRound, Power, Send, Loader2, Check } from "lucide-react";
import { UserRole } from "../../../../../constants";
import { AccountStatus, UserAvatar } from "../../../../../components/common";
import { useUserManagement } from "../context/UserManagementContext";
import { useToast } from "../../../../../contexts/ToastContext";
import { usersAPI } from "../../../../../api/users";
import type { ManagedUser } from "../../../../../types/user";

const roleStyles: Record<string, string> = {
  [UserRole.CSD]: "bg-blue-50 text-blue-700 border border-blue-200",
  [UserRole.QTD]: "bg-violet-50 text-violet-700 border border-violet-200",
  [UserRole.OOS]: "bg-amber-50 text-amber-700 border border-amber-200",
  [UserRole.BILLING]: "bg-teal-50 text-teal-700 border border-teal-200",
  [UserRole.MANAGER]: "bg-rose-50 text-rose-700 border border-rose-200",
};

const roleLabels: Record<string, string> = {
  [UserRole.CSD]: "CSD",
  [UserRole.QTD]: "QTD",
  [UserRole.OOS]: "OOS",
  [UserRole.BILLING]: "Billing",
  [UserRole.MANAGER]: "Manager",
};

const RoleBadge = ({ role }: { role: ManagedUser["roleName"] }) => (
  <span
    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${roleStyles[role] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}
  >
    {roleLabels[role] ?? role}
  </span>
);

const COLUMNS = ["Name", "Email", "Role", "Position", "Status", "Actions"];

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200">
      {COLUMNS.map((header) => (
        <th
          key={header}
          className="th-label"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

function ResendActivationButton({ userId }: { userId: string }) {
  const { toastSuccess } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  const handleResend = async () => {
    setState("loading");
    try {
      await usersAPI.resendActivation(userId);
      setState("sent");
      toastSuccess("Activation email resent successfully.");
    } catch {
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <span className="p-1 text-emerald-500">
        <Check className="w-4 h-4" />
      </span>
    );
  }

  return (
    <button
      onClick={handleResend}
      disabled={state === "loading"}
      title="Resend activation email"
      className="p-1 text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
    >
      {state === "loading" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
    </button>
  );
}

const UserRow = ({ user }: { user: ManagedUser }) => (
  <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
    <td className="px-4 py-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={user.name} profileUrl={user.profileUrl} />
        <span className="text-sm font-medium text-primary">{user.name}</span>
      </div>
    </td>
    <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
    <td className="px-4 py-4">
      <RoleBadge role={user.roleName} />
    </td>
    <td className="px-4 py-4 text-sm text-gray-600">
      {user.position}
    </td>
    <td className="px-4 py-4">
      <AccountStatus status={user.status} />
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center gap-2">
        {user.status === "PENDING" && (
          <ResendActivationButton userId={user.id} />
        )}
        <button className="p-1 text-gray-400 hover:text-accent transition-colors">
          <SquarePen className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-accent transition-colors">
          <KeyRound className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-accent transition-colors">
          <Power className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

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
      <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
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
              <UserRow key={user.email} user={user} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
