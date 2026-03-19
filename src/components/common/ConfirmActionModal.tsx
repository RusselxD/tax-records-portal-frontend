import { useState, useEffect, type Dispatch, type SetStateAction, type ReactNode } from "react";
import Modal from "./Modal";
import Button from "./Button";

export interface ConfirmActionModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => Promise<void>;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  loadingLabel?: string;
  confirmClassName?: string;
  comment?: string;
  commentLabel?: string;
  onSuccess?: () => void;
  children?: ReactNode;
}

export default function ConfirmActionModal({
  setModalOpen,
  onConfirm,
  title,
  description,
  confirmLabel,
  loadingLabel,
  confirmClassName,
  comment,
  commentLabel = "Comment",
  children,
}: ConfirmActionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) handleConfirm();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, comment]);

  return (
    <Modal
      setModalOpen={setModalOpen}
      title={title}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className={confirmClassName}
          >
            {isLoading ? (loadingLabel ?? confirmLabel) : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <div className="text-sm text-gray-600">{description}</div>

        {children}

        {comment?.trim() && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{commentLabel}</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              {comment.trim()}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-status-rejected">{error}</p>
        )}
      </div>
    </Modal>
  );
}
