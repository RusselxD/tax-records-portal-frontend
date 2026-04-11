import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "../../../../../components/common";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useToast } from "../../../../../contexts/ToastContext";
import { getRolePrefix } from "../../../../../constants";
import HandoffModal from "./HandoffModal";

interface HandoffCardProps {
  clientId: string;
  creatorId: string | null;
  currentQtdId: string | null;
  onSuccess: () => void;
}

export default function HandoffCard({
  clientId,
  creatorId,
  currentQtdId,
  onSuccess,
}: HandoffCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess } = useToast();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="rounded-lg border-2 border-accent/30 bg-accent/5 px-6 py-5">
      <div className="flex items-center gap-2.5 mb-3">
        <ArrowRightLeft className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Hand Off Client</h2>
      </div>

      <p className="text-sm text-gray-600 mb-1.5">
        Pick the accountants who will take over and transition this client to active status.
      </p>
      <p className="text-sm text-gray-500 italic mb-4">
        Once handed off, you will no longer be able to edit this client unless you are one of the chosen accountants.
      </p>

      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)}>
          Hand Off Client
        </Button>
      </div>

      {showModal && (
        <HandoffModal
          clientId={clientId}
          creatorId={creatorId}
          currentQtdId={currentQtdId}
          setModalOpen={setShowModal}
          onSuccess={() => {
            toastSuccess(
              "Client Handed Off",
              "The client has been successfully handed off.",
            );
            navigate(`${prefix}/client-onboarding`);
          }}
          onConflict={onSuccess}
        />
      )}
    </div>
  );
}
