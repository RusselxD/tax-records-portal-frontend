import { useState } from "react";
import { UserCircle, Plus } from "lucide-react";
import { Input, Button, Alert } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { ClientAccountResponse } from "../../../../../types/client";
import { AccountRow } from "../../ClientOnboardingPreview/components/ClientAccountCard";

interface ClientAccountsSectionProps {
  clientId: string;
  accounts: ClientAccountResponse[];
  canEdit: boolean;
  onRefresh: () => void;
}

export default function ClientAccountsSection({
  clientId,
  accounts,
  canEdit,
  onRefresh,
}: ClientAccountsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-200">
        <UserCircle className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Client Accounts</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {accounts.map((account) => (
          <AccountRow key={account.id} clientAccount={account} canEdit={canEdit} />
        ))}
      </div>

      {showAddForm ? (
        <AddAccountForm
          clientId={clientId}
          onSuccess={() => { setShowAddForm(false); onRefresh(); }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Another Account
          </button>
        </div>
      )}
    </div>
  );
}

function AddAccountForm({
  clientId,
  onSuccess,
  onCancel,
}: {
  clientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { toastSuccess } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = firstName.trim() && lastName.trim() && email.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await clientAPI.activateAccount(clientId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      toastSuccess(
        "Activation Email Sent",
        "The client will receive an email to set up their account.",
      );
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create account."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 space-y-3">
      {error && <Alert variant="error" className="mb-1">{error}</Alert>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
          Send Activation Email
        </Button>
      </div>
    </div>
  );
}
