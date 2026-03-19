import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "../../../../../components/common";
import { useNewClient } from "../context/NewClientContext";
import { SECTIONS } from "../context/NewClientContext";
import ConfirmDiscardModal from "./ConfirmDiscardModal";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

function JumpToSectionDropdown() {
  const { scrollToSection } = useNewClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary hover:bg-gray-50 transition-colors"
      >
        Jump to section
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-30 py-1">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                scrollToSection(section.key);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StickyActionBar() {
  const navigate = useNavigate();
  const { globalSaveStatus, isSubmitting, isDiscarding, isEditMode } = useNewClient();
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const isSaving = globalSaveStatus === "saving";

  return (
    <>
      <div
        className="fixed bottom-0 right-0 left-0 lg:left-60 z-20 bg-white border-t border-gray-200"
        style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between max-w-[1100px] mx-auto px-8 py-3">
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
            <JumpToSectionDropdown />
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
