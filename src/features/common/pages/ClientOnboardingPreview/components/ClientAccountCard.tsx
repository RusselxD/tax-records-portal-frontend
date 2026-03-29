import { useState } from "react";
import { UserCircle, Send, Check, UserX } from "lucide-react";
import { AccountStatus, Input, Button, ConfirmActionModal } from "../../../../../components/common";
import { getAvatarColor } from "../../../../../lib/avatar-colors";
import { getInitials, resolveAssetUrl } from "../../../../../lib/formatters";
import { usersAPI } from "../../../../../api/users";
import { useToast } from "../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { ClientAccountResponse } from "../../../../../types/client";

interface ResendResult {
  firstName: string;
  lastName: string;
  email: string;
}

function ResendForm({
  clientAccount,
  onClose,
  onSuccess,
}: {
  clientAccount: ClientAccountResponse;
  onClose: () => void;
  onSuccess: (updated?: ResendResult) => void;
}) {
  const { toastSuccess, toastError } = useToast();
  const [firstName, setFirstName] = useState(clientAccount.firstName);
  const [lastName, setLastName] = useState(clientAccount.lastName);
  const [email, setEmail] = useState(clientAccount.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges =
    firstName.trim() !== clientAccount.firstName ||
    lastName.trim() !== clientAccount.lastName ||
    email.trim() !== clientAccount.email;

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await usersAPI.resendActivation(
        clientAccount.id,
        hasChanges
          ? {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
            }
          : undefined,
      );
      toastSuccess("Activation email resent successfully.");
      onSuccess(
        hasChanges
          ? { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }
          : undefined,
      );
    } catch {
      toastError("Failed to resend activation email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!email.trim()}>
          Resend Activation
        </Button>
      </div>
    </div>
  );
}

/** Standalone card — used when rendering a single account (e.g. from ActivateAccountCard flow) */
export default function ClientAccountCard({ clientAccount }: { clientAccount: ClientAccountResponse }) {
  return (
    <div className="rounded-lg bg-white custom-shadow">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-200">
        <UserCircle className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Client Account</h2>
      </div>
      <AccountRow clientAccount={clientAccount} />
    </div>
  );
}

/** Row without card wrapper — used inside ClientAccountsSection */
export function AccountRow({
  clientAccount,
  onDeactivated,
}: {
  clientAccount: ClientAccountResponse;
  onDeactivated?: () => void;
}) {
  const { user } = useAuth();
  const canDeactivate = hasPermission(user?.permissions, Permission.USER_CREATE);
  const { toastSuccess, toastError } = useToast();
  const [displayData, setDisplayData] = useState({
    firstName: clientAccount.firstName,
    lastName: clientAccount.lastName,
    email: clientAccount.email,
  });
  const { profileUrl, status } = clientAccount;
  const fullName = `${displayData.firstName} ${displayData.lastName}`;
  const [showResendForm, setShowResendForm] = useState(false);
  const [resent, setResent] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(status === "DEACTIVATED");

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4">
        {profileUrl ? (
          <img
            src={resolveAssetUrl(profileUrl) ?? profileUrl}
            alt={fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 ${getAvatarColor(fullName).bg} rounded-full flex items-center justify-center`}>
            <span className={`text-sm ${getAvatarColor(fullName).text} font-medium`}>
              {getInitials(`${displayData.firstName} ${displayData.lastName}`)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {fullName}
          </p>
          <p className="text-sm text-gray-500 truncate">{displayData.email}</p>
        </div>

        <div className="flex items-center gap-2">
          {status === "PENDING" && !showResendForm && (
            resent ? (
              <span className="p-1 text-emerald-500">
                <Check className="w-4 h-4" />
              </span>
            ) : (
              <button
                onClick={() => setShowResendForm(true)}
                title="Resend activation email"
                className="p-1 text-gray-400 hover:text-accent transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            )
          )}
          {canDeactivate && (status === "ACTIVE" || status === "PENDING") && !isDeactivated && (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              title="Deactivate account"
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <UserX className="w-4 h-4" />
            </button>
          )}
          <AccountStatus status={isDeactivated ? "DEACTIVATED" : status} />
        </div>
      </div>

      {showResendForm && (
        <ResendForm
          clientAccount={clientAccount}
          onClose={() => setShowResendForm(false)}
          onSuccess={(updated) => {
            if (updated) setDisplayData(updated);
            setShowResendForm(false);
            setResent(true);
          }}
        />
      )}

      {showDeactivateConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowDeactivateConfirm}
          onConfirm={() => usersAPI.changeUserStatus(clientAccount.id, "DEACTIVATED")}
          title="Deactivate Account?"
          description={`This will deactivate the portal account for ${fullName} (${displayData.email}). They will no longer be able to log in.`}
          confirmLabel="Deactivate"
          loadingLabel="Deactivating..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onSuccess={() => {
            setIsDeactivated(true);
            setShowDeactivateConfirm(false);
            toastSuccess("Account Deactivated", `${fullName}'s account has been deactivated.`);
            onDeactivated?.();
          }}
          onError={(err) => {
            toastError(getErrorMessage(err, "Failed to deactivate account."));
          }}
        />
      )}
    </>
  );
}
