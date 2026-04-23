import type { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import TaskRequestForm from "./TaskRequestForm";

interface RequestTaskModalProps {
  /** Pre-selected client. When omitted, the form renders a client picker. */
  clientId?: string;
  clientDisplayName?: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: (requestId: string) => void;
}

export default function RequestTaskModal({
  clientId,
  clientDisplayName,
  setModalOpen,
  onSuccess,
}: RequestTaskModalProps) {
  return (
    <ModalContainer setModalOpen={setModalOpen}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-primary">Request New Task</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Submit a proposed task for QTD review.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <TaskRequestForm
            clientId={clientId}
            clientDisplayName={clientDisplayName}
            onCancel={() => setModalOpen(false)}
            onSuccess={(id) => {
              setModalOpen(false);
              onSuccess?.(id);
            }}
          />
        </div>
      </div>
    </ModalContainer>
  );
}
