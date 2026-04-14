import {
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { getErrorMessage } from "../../../../../lib/api-error";
import {
  Modal,
  Alert,
  Button,
  Input,
  Dropdown,
  TitlesEditor,
} from "../../../../../components/common";
import { usersAPI } from "../../../../../api/users";
import type { ManagedUser, UserTitle } from "../../../../../types/user";
import { useToast } from "../../../../../contexts/ToastContext";
import PositionInlineCreate from "./AddUserModal/components/PositionInlineCreate";
import useFormOptions from "./AddUserModal/hooks/useFormOptions";
import { validate, type FormErrors } from "./AddUserModal/utils/validation";

interface UserFormModalProps {
  user?: ManagedUser;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: (user: ManagedUser) => void;
}

export default function UserFormModal({
  user,
  setModalOpen,
  onSuccess,
}: UserFormModalProps) {
  const isEdit = !!user;

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [roleId, setRoleId] = useState(
    user?.roleId != null ? String(user.roleId) : "",
  );
  const [positionId, setPositionId] = useState(
    user?.positionId != null ? String(user.positionId) : "",
  );
  const [titles, setTitles] = useState<UserTitle[]>(user?.titles ?? []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);
  const { toastSuccess } = useToast();

  const {
    roles,
    positions,
    rolesLoading,
    positionsLoading,
    error: optionsError,
    addPosition,
  } = useFormOptions();

  // VIEWER is a shared read-only role with no position requirement.
  // Matches backend's display name for the Viewer role.
  const selectedRoleName = roles.find((r) => String(r.id) === roleId)?.name;
  const isViewerRole = selectedRoleName === "Viewer";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(
      firstName,
      lastName,
      email,
      roleId,
      positionId,
      !isViewerRole,
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const cleanTitles = titles.filter((t) => t.title.trim());
    const submittedPositionId = isViewerRole
      ? null
      : positionId
        ? Number(positionId)
        : null;

    setIsSubmitting(true);
    try {
      let result: ManagedUser;

      if (isEdit) {
        result = await usersAPI.updateUser(user.id, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          roleId: Number(roleId),
          positionId: submittedPositionId,
          titles: cleanTitles,
        });
        toastSuccess("User Updated", "The user's details have been saved.");
      } else {
        result = await usersAPI.createUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          roleId: Number(roleId),
          positionId: submittedPositionId,
          titles: cleanTitles.length > 0 ? cleanTitles : undefined,
        });
        toastSuccess(
          "User Created",
          "The account has been created successfully.",
        );
      }

      onSuccess(result);
      setModalOpen(false);
    } catch (err) {
      setSubmitError(
        getErrorMessage(
          err,
          isEdit
            ? "Failed to update user. Please try again."
            : "Failed to create user. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title={isEdit ? "Edit User" : "Add User"}
      maxWidth="max-w-lg"
    >
      {(submitError || optionsError) && (
        <Alert variant="error" className="mt-4">
          {submitError || optionsError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={isEdit ? undefined : "John"}
            error={errors.firstName}
          />
          <Input
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={isEdit ? undefined : "Doe"}
            error={errors.lastName}
          />
        </div>

        <div>
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEdit ? undefined : "john.doe@company.com"}
            error={errors.email}
          />
          {isEdit && email.trim() !== user?.email && (
            <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                The employee will log in with the new email after saving. Make
                sure they're aware of the change.
              </span>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-4 ${isViewerRole ? "" : "sm:grid-cols-2"}`}>
          <Dropdown
            portal
            label="Role"
            options={roles.map((r) => ({ label: r.name, value: String(r.id) }))}
            value={roleId}
            onChange={setRoleId}
            placeholder="Select a role"
            disabled={rolesLoading}
            error={errors.roleId}
            fullWidth
          />
          {!isViewerRole && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-primary">
                  Position
                </label>
                {!isCreatingPosition && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingPosition(true)}
                    className="flex items-center gap-0.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                )}
              </div>
              <Dropdown
                portal
                options={positions.map((p) => ({
                  label: p.name,
                  value: String(p.id),
                }))}
                value={positionId}
                onChange={setPositionId}
                placeholder="Select a position"
                disabled={positionsLoading || isCreatingPosition}
                error={errors.positionId}
                fullWidth
              />
            </div>
          )}
        </div>

        {!isViewerRole && isCreatingPosition && (
          <PositionInlineCreate
            onCreated={(created) => {
              addPosition(created);
              setPositionId(String(created.id));
              setIsCreatingPosition(false);
            }}
            onCancel={() => setIsCreatingPosition(false)}
          />
        )}

        <TitlesEditor titles={titles} onChange={setTitles} />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
