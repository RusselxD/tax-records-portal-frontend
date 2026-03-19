import {
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getErrorMessage } from "../../../../../../lib/api-error";
import { Plus } from "lucide-react";
import { Modal, Alert, Button, Input, Dropdown } from "../../../../../../components/common";
import { usersAPI } from "../../../../../../api/users";
import type { ManagedUser, UserTitle } from "../../../../../../types/user";
import { useToast } from "../../../../../../contexts/ToastContext";
import TitleEntry from "./components/TitleEntry";
import PositionInlineCreate from "./components/PositionInlineCreate";
import useFormOptions from "./hooks/useFormOptions";
import { validate, type FormErrors } from "./utils/validation";

interface AddUserModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: (user: ManagedUser) => void;
}

export default function AddUserModal({
  setModalOpen,
  onSuccess,
}: AddUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [titles, setTitles] = useState<UserTitle[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);
  const { toastSuccess } = useToast();

  const {
    roles, positions, rolesLoading, positionsLoading,
    error: optionsError, addPosition,
  } = useFormOptions();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(firstName, lastName, email, roleId, positionId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const cleanTitles = titles.filter((t) => t.title.trim());

    setIsSubmitting(true);
    try {
      const createdUser = await usersAPI.createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        roleId: Number(roleId),
        positionId: Number(positionId),
        titles: cleanTitles.length > 0 ? cleanTitles : undefined,
      });
      onSuccess(createdUser);
      toastSuccess("User Created", "The account has been created successfully.");
      setModalOpen(false);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Failed to create user. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal setModalOpen={setModalOpen} title="Add User" maxWidth="max-w-lg">
      {(submitError || optionsError) && (
        <Alert variant="error" className="mt-4">
          {submitError || optionsError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            error={errors.firstName}
          />
          <Input
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            error={errors.lastName}
          />
        </div>

        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@company.com"
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Role"
            options={roles.map((r) => ({ label: r.name, value: String(r.id) }))}
            value={roleId}
            onChange={setRoleId}
            placeholder="Select a role"
            disabled={rolesLoading}
            error={errors.roleId}
            fullWidth
          />
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
              options={positions.map((p) => ({ label: p.name, value: String(p.id) }))}
              value={positionId}
              onChange={setPositionId}
              placeholder="Select a position"
              disabled={positionsLoading || isCreatingPosition}
              error={errors.positionId}
              fullWidth
            />
          </div>
        </div>

        {isCreatingPosition && (
          <PositionInlineCreate
            onCreated={(created) => {
              addPosition(created);
              setPositionId(String(created.id));
              setIsCreatingPosition(false);
            }}
            onCancel={() => setIsCreatingPosition(false)}
          />
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-primary">
              Titles
              <span className="ml-1 text-xs text-gray-400">(optional)</span>
            </label>
            <button
              type="button"
              onClick={() => setTitles((prev) => [...prev, { prefix: true, title: "" }])}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Title
            </button>
          </div>
          {titles.length === 0 ? (
            <p className="text-xs text-gray-400">No titles added.</p>
          ) : (
            <div className="space-y-2">
              {titles.map((title, index) => (
                <TitleEntry
                  key={index}
                  title={title}
                  onUpdate={(updated) =>
                    setTitles((prev) => prev.map((t, i) => (i === index ? updated : t)))
                  }
                  onRemove={() =>
                    setTitles((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
