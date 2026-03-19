import { useState } from "react";
import { usersAPI } from "../../../../../api/users";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import Input from "../../../../../components/common/Input";
import Button from "../../../../../components/common/Button";

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_FORM: FormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordCard() {
  const { toastSuccess, toastError } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.currentPassword) next.currentPassword = "Required.";
    if (!form.newPassword) next.newPassword = "Required.";
    if (form.newPassword && form.newPassword.length < 8)
      next.newPassword = "Must be at least 8 characters.";
    if (!form.confirmPassword) next.confirmPassword = "Required.";
    if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await usersAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toastSuccess("Password updated successfully.");
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      toastError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-sm font-semibold text-primary mb-6">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="currentPassword"
          type="password"
          label="Current Password"
          value={form.currentPassword}
          onChange={set("currentPassword")}
          error={errors.currentPassword}
          autoComplete="current-password"
        />
        <Input
          id="newPassword"
          type="password"
          label="New Password"
          value={form.newPassword}
          onChange={set("newPassword")}
          error={errors.newPassword}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
