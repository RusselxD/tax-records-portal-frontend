import { type Dispatch, type SetStateAction } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { ConfirmActionModal } from "../../../../../components/common";
import { usersAPI } from "../../../../../api/users";
import { USER_STATUS, type ManagedUser } from "../../../../../types/user";
import { useToast } from "../../../../../contexts/ToastContext";

interface DeactivateUserModalProps {
  user: ManagedUser;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: (updated: ManagedUser) => void;
}

export default function DeactivateUserModal({
  user,
  setModalOpen,
  onSuccess,
}: DeactivateUserModalProps) {
  const isDeactivating = user.status === USER_STATUS.ACTIVE;
  const newStatus = isDeactivating ? USER_STATUS.DEACTIVATED : USER_STATUS.ACTIVE;
  const { toastSuccess } = useToast();

  const handleConfirm = async () => {
    try {
      await usersAPI.changeUserStatus(user.id, newStatus);
      onSuccess({ ...user, status: newStatus });
      toastSuccess(
        isDeactivating ? "User deactivated." : "User reactivated.",
      );
      setModalOpen(false);
    } catch (err) {
      throw new Error(
        getErrorMessage(
          err,
          `Failed to ${isDeactivating ? "deactivate" : "reactivate"} user.`,
        ),
      );
    }
  };

  return (
    <ConfirmActionModal
      setModalOpen={setModalOpen}
      onConfirm={handleConfirm}
      title={isDeactivating ? "Deactivate User" : "Reactivate User"}
      description={
        isDeactivating ? (
          <>
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-primary">{user.name}</span>?
            They will no longer be able to log in.
          </>
        ) : (
          <>
            Reactivate{" "}
            <span className="font-semibold text-primary">{user.name}</span>?
            They will be able to log in again.
          </>
        )
      }
      confirmLabel={isDeactivating ? "Deactivate" : "Reactivate"}
      loadingLabel={isDeactivating ? "Deactivating..." : "Reactivating..."}
      confirmClassName={isDeactivating ? "!bg-red-600 hover:!bg-red-700" : ""}
    />
  );
}
