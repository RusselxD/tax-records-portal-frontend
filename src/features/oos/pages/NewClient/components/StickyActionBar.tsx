import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/common";
import JumpToSectionDropdown from "../../../../../components/common/JumpToSectionDropdown";
import { useNewClient, SECTIONS } from "../context/NewClientContext";
import ConfirmDiscardModal from "./ConfirmDiscardModal";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

export default function StickyActionBar() {
  const navigate = useNavigate();
  const { scrollToSection, globalSaveStatus, isSubmitting, isDiscarding, isEditMode } = useNewClient();
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const isSaving = globalSaveStatus === "saving";

  return (
    <>
      <div
        className="fixed bottom-0 right-0 left-0 lg:left-60 z-20 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]"
        style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-[1100px] mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowDiscard(true)}
              disabled={isDiscarding}
              className="text-sm font-medium text-status-rejected hover:text-red-700 transition-colors disabled:opacity-60"
            >
              {isDiscarding ? "Deleting..." : isEditMode ? "Delete Client" : "Discard Draft"}
            </button>
            <Button
              variant="secondary"
              onClick={() => navigate("/oos/client-onboarding")}
            >
              Save & Exit
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <JumpToSectionDropdown sections={SECTIONS} onSelect={scrollToSection} />
            <Button
              onClick={() => setShowSubmit(true)}
              disabled={isSaving || isSubmitting}
              isLoading={isSubmitting}
            >
              {isSaving ? "Saving..." : "Submit for Review"}
            </Button>
          </div>
        </div>
      </div>

      {showDiscard && <ConfirmDiscardModal setModalOpen={setShowDiscard} />}
      {showSubmit && <ConfirmSubmitModal setModalOpen={setShowSubmit} />}
    </>
  );
}
