import {
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { Modal, Alert, Button, Input } from "../../../../../components/common";
import { usersAPI } from "../../../../../api/users";
import type { ManagedUser } from "../../../../../types/user";
import { useToast } from "../../../../../contexts/ToastContext";

interface ResendActivationModalProps {
  user: ManagedUser;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function ResendActivationModal({
  user,
  setModalOpen,
  onSuccess,
}: ResendActivationModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastSuccess } = useToast();

  const hasChanges =
    firstName.trim() !== user.firstName ||
    lastName.trim() !== user.lastName ||
    email.trim() !== user.email;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await usersAPI.resendActivation(
        user.id,
        hasChanges
          ? {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
            }
          : undefined,
      );
      toastSuccess("Activation email resent successfully.");
      onSuccess();
      setModalOpen(false);
    } catch (err) {
      setSubmitError(
        getErrorMessage(err, "Failed to resend activation. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title="Resend Activation"
      maxWidth="max-w-md"
    >
      {submitError && (
        <Alert variant="error" className="mt-4">
          {submitError}
        </Alert>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Resend the activation email to this user. You can update their details
        below before resending.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Sending..." : "Resend Activation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
