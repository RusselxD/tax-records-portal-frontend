import { Send, Check, X } from "lucide-react";
import { CommentEditor } from "../../../../../components/common";
import type { RichTextContent } from "../../../../../types/client-info";

interface ActionSectionProps {
  canSubmitLog: boolean;
  canApproveReject: boolean;
  actionComment: RichTextContent;
  onCommentChange: (value: RichTextContent) => void;
  onAction: (action: "submit" | "approve" | "reject") => void;
}

export default function ActionSection({
  canSubmitLog,
  canApproveReject,
  actionComment,
  onCommentChange,
  onAction,
}: ActionSectionProps) {
  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-primary">
          {canApproveReject ? "Review Comments" : "Actions"}
        </h2>
      </div>
      <div className="px-6 py-5">
        <div className="mb-5 max-w-2xl">
          <CommentEditor
            value={actionComment}
            onChange={onCommentChange}
            placeholder={
              canApproveReject
                ? "Enter details regarding approval or reasons for rejection..."
                : "Add a comment (optional)..."
            }
          />
        </div>
        <div className="flex items-center gap-3">
          {canSubmitLog && (
            <button
              onClick={() => onAction("submit")}
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit for Review
            </button>
          )}
          {canApproveReject && (
            <>
              <button
                onClick={() => onAction("reject")}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border-2 border-red-400 text-red-500 bg-white hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => onAction("approve")}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
