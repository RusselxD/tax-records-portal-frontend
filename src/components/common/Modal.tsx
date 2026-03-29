import type { Dispatch, SetStateAction, ReactNode } from "react";
import { X } from "lucide-react";
import ModalContainer from "./ModalContainer";

export interface ModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  setModalOpen,
  title,
  children,
  actions,
  maxWidth = "max-w-md",
}: ModalProps) {
  return (
    <ModalContainer setModalOpen={setModalOpen}>
      <div
        className={`bg-white rounded-lg w-full ${maxWidth} mx-4 max-h-[90vh] flex flex-col custom-shadow`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {/* Actions — fixed */}
        {actions && (
          <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-100 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
