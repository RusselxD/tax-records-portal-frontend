import { Check, X } from "lucide-react";
import { Button } from "../../../../../components/common";

interface Props {
  onApprove: () => void;
  onReject: () => void;
}

export default function ReviewActionsCard({ onApprove, onReject }: Props) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5 space-y-2">
      <h3 className="text-sm font-bold text-primary">Review Actions</h3>
      <p className="text-xs text-gray-500">
        Approve to create the task or reject with a reason.
      </p>
      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={onApprove}>
          <Check className="w-4 h-4" />
          Approve
        </Button>
        <Button
          variant="secondary"
          onClick={onReject}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}
