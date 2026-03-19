import { useState } from "react";
import { UserCircle, Send, Check } from "lucide-react";
import { AccountStatus, Input, Button } from "../../../../../components/common";
import { getAvatarColor } from "../../../../../lib/avatar-colors";
import { usersAPI } from "../../../../../api/users";
import { useToast } from "../../../../../contexts/ToastContext";
import type { ClientAccountResponse } from "../../../../../types/client";

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0);
  const last = lastName.charAt(0);
  return `${first}${last}`.toUpperCase();
};

interface ClientAccountCardProps {
  clientAccount: ClientAccountResponse;
}

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

export default function ClientAccountCard({ clientAccount }: ClientAccountCardProps) {
  const [displayData, setDisplayData] = useState({
    firstName: clientAccount.firstName,
    lastName: clientAccount.lastName,
    email: clientAccount.email,
  });
  const { profileUrl, status } = clientAccount;
  const fullName = `${displayData.firstName} ${displayData.lastName}`;
  const [showResendForm, setShowResendForm] = useState(false);
  const [resent, setResent] = useState(false);

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-200">
        <UserCircle className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Client Account</h2>
      </div>

      <div className="flex items-center gap-4 px-6 py-5">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 ${getAvatarColor(fullName).bg} rounded-full flex items-center justify-center`}>
            <span className={`text-sm ${getAvatarColor(fullName).text} font-medium`}>
              {getInitials(displayData.firstName, displayData.lastName)}
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
          <AccountStatus status={status} />
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
    </div>
  );
}
