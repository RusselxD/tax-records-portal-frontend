import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { Mail } from "lucide-react";
import { Input, Button, Alert } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const validate = (
  firstName: string,
  lastName: string,
  email: string,
): FormErrors => {
  const errors: FormErrors = {};
  if (!firstName.trim()) errors.firstName = "First name is required.";
  if (!lastName.trim()) errors.lastName = "Last name is required.";
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
};

export default function ActivateAccountCard({ clientId, pocEmail, onSuccess }: { clientId: string; pocEmail: string | null; onSuccess: () => void }) {
  const { toastSuccess } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(pocEmail ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(firstName, lastName, email);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

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
      setSubmitError(getErrorMessage(err, "Failed to send activation email. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-accent/30 bg-accent/5">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-accent/20">
        <Mail className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">
          Activate Client Account
        </h2>
      </div>

      <div className="px-6 py-5">
        <p className="text-sm text-gray-600 mb-4">
          Send an activation email to the client so they can set up their
          password and log in to the portal.
        </p>

        {submitError && (
          <Alert variant="error" className="mb-4">
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="activate-firstName"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              error={errors.firstName}
            />
            <Input
              id="activate-lastName"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              error={errors.lastName}
            />
          </div>

          <div className="mt-4">
            <Input
              id="activate-email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter client email"
              error={errors.email}
            />
          </div>

          <div className="flex justify-end mt-5">
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Activation Email"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
