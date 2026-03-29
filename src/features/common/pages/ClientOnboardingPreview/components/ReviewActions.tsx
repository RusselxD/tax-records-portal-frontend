import { useState } from "react";
import { Check, X } from "lucide-react";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";
import { CommentEditor } from "../../../../../components/common";
import type { RichTextContent } from "../../../../../types/client-info";
import ConfirmReviewModal from "./ConfirmReviewModal";

type ReviewAction = "approve" | "reject";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

export default function ReviewActions() {
  const { clientName } = useInfoReview();

  const [remarks, setRemarks] = useState<RichTextContent>(EMPTY_DOC);
  const [modal, setModal] = useState<ReviewAction | null>(null);

  return (
    <div className="rounded-lg bg-white border border-gray-200 mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-primary">
          Review Comments / Rejection Reason
        </h2>
      </div>
      <div className="px-6 py-5">
        <div className="max-w-2xl">
          <CommentEditor
            value={remarks}
            onChange={setRemarks}
            placeholder="Enter details regarding approval or specific reasons for rejection..."
          />
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => setModal("reject")}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border-2 border-red-400 text-red-500 bg-white hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject Profile
          </button>
          <button
            onClick={() => setModal("approve")}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Check className="h-4 w-4" />
            Approve Profile
          </button>
        </div>
      </div>
      {modal && (
        <ConfirmReviewModal
          action={modal}
          setModalOpen={() => setModal(null)}
          clientName={clientName}
          remarks={remarks}
          onSuccess={() => setRemarks(EMPTY_DOC)}
        />
      )}
    </div>
  );
}
