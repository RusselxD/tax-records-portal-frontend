import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/common";
import JumpToSectionDropdown from "../../../../../components/common/JumpToSectionDropdown";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { useEditClientProfile, SECTIONS } from "../context/EditClientProfileContext";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

export default function EditStickyActionBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientId, scrollToSection, isSubmitting } = useEditClientProfile();
  const [showSubmit, setShowSubmit] = useState(false);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  return (
    <>
      <div
        className="fixed bottom-0 right-0 left-0 lg:left-60 z-20 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]"
        style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between max-w-[1100px] mx-auto px-4 sm:px-8 py-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/${prefix}/client-details/${clientId}`)}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <JumpToSectionDropdown sections={SECTIONS} onSelect={scrollToSection} />
            <Button
              onClick={() => setShowSubmit(true)}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Submit for Review
            </Button>
          </div>
        </div>
      </div>

      {showSubmit && <ConfirmSubmitModal setModalOpen={setShowSubmit} />}
    </>
  );
}
