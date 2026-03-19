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
        className={`bg-white rounded-lg w-full ${maxWidth} mx-4 custom-shadow`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4 px-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            <button
              onClick={() => setModalOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {children}

          {actions && (
            <div className="flex justify-end gap-3 mt-4">{actions}</div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
