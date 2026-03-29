import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trash2 } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useToast } from "../../../../../contexts/ToastContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { TAX_RECORD_TASK_STATUS } from "../../../../../types/tax-record-task";
import { getErrorMessage } from "../../../../../lib/api-error";
import { ConfirmActionModal } from "../../../../../components/common";
import {
  statusStyles,
  statusDotColors,
  statusLabels,
} from "../../../../../constants/tax-record-task";

export default function TaskHeader() {
  const { task } = useTaxRecordTaskDetails();
  const { user } = useAuth();
  const { toastError } = useToast();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const canDelete = task.status === TAX_RECORD_TASK_STATUS.OPEN;

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
        <button
          onClick={() => navigate(`/${prefix}/tasks`)}
          className="hover:text-primary transition-colors"
        >
          Tasks
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-medium truncate">{task.taskName}</span>
      </nav>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary truncate">
          {task.taskName}
        </h1>
        <div className="flex items-center gap-3 shrink-0">
          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete Task"
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[task.status]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[task.status]}`} />
            {statusLabels[task.status]}
          </span>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowDeleteConfirm}
          onConfirm={() => taxRecordTaskAPI.deleteTask(task.id)}
          title="Delete Task?"
          description={`This will permanently delete "${task.taskName}". This action cannot be undone.`}
          confirmLabel="Delete"
          loadingLabel="Deleting..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onSuccess={() => navigate(`/${prefix}/tasks`)}
          onError={(err) => toastError(getErrorMessage(err, "Cannot delete this task."))}
        />
      )}
    </div>
  );
}
