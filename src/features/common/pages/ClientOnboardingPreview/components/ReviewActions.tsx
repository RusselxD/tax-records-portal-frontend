import { useState } from "react";
import { Check, X } from "lucide-react";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";
import ConfirmRejectModal from "./ConfirmRejectModal";
import ConfirmApproveModal from "./ConfirmApproveModal";

export default function ReviewActions() {
  const { clientName } = useInfoReview();

  const [remarks, setRemarks] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  return (
    <div className="rounded-lg bg-white border border-gray-200 mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-primary">
          Review Comments / Rejection Reason
        </h2>
      </div>
      <div className="px-6 py-5">
        <div className="relative">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter details regarding approval or specific reasons for rejection..."
            rows={4}
            className="w-full max-w-2xl rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-400 max-w-2xl">
            Optional
          </span>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => setShowRejectModal(true)}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border-2 border-red-400 text-red-500 bg-white hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject Profile
          </button>
          <button
            onClick={() => setShowApproveModal(true)}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Check className="h-4 w-4" />
            Approve Profile
          </button>
        </div>
      </div>
      {showRejectModal && (
        <ConfirmRejectModal
          setModalOpen={setShowRejectModal}
          clientName={clientName}
          remarks={remarks}
          onSuccess={() => setRemarks("")}
        />
      )}
      {showApproveModal && (
        <ConfirmApproveModal
          setModalOpen={setShowApproveModal}
          clientName={clientName}
          remarks={remarks}
          onSuccess={() => setRemarks("")}
        />
      )}
    </div>
  );
}
