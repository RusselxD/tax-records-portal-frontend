import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, isConflictError } from "../../../../../lib/api-error";
import { ArrowRightLeft } from "lucide-react";
import { Button, Alert, ConfirmActionModal } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useToast } from "../../../../../contexts/ToastContext";
import { getRolePrefix } from "../../../../../constants";

export default function HandoffCard({ clientId, onSuccess }: { clientId: string; onSuccess: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess } = useToast();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <div className="rounded-lg border-2 border-accent/30 bg-accent/5 px-6 py-5">
      <div className="flex items-center gap-2.5 mb-3">
        <ArrowRightLeft className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Hand Off Client</h2>
      </div>

      <p className="text-sm text-gray-600 mb-1.5">
        Transition this client to active status. Accountants must already be
        assigned via the Main Details section.
      </p>
      <p className="text-sm text-gray-500 italic mb-4">
        Once handed off, you will no longer be able to edit this client unless you are assigned as an accountant.
      </p>

      {submitError && (
        <Alert variant="error" className="mb-4">
          {submitError}
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setShowConfirm(true)}>
          Hand Off Client
        </Button>
      </div>

      {showConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowConfirm}
          onConfirm={async () => {
            setSubmitError(null);
            try {
              await clientAPI.handoffClient(clientId);
              toastSuccess(
                "Client Handed Off",
                "The client has been successfully handed off.",
              );
              navigate(`${prefix}/client-onboarding`);
            } catch (err) {
              if (isConflictError(err)) onSuccess();
              setSubmitError(getErrorMessage(err, "Failed to hand off client. Please try again."));
              throw err;
            }
          }}
          title="Hand Off Client"
          description="This will create an archive snapshot, assign accountants, and transition the client to active status. This action cannot be undone."
          confirmLabel="Hand Off Client"
          loadingLabel="Handing Off..."
        />
      )}
    </div>
  );
}
