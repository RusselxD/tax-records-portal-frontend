import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import {
  statusStyles,
  statusDotColors,
  statusLabels,
} from "../../../../../constants/tax-record-task";

export default function TaskHeader() {
  const { task } = useTaxRecordTaskDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  if (!task) return null;

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
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shrink-0 ${statusStyles[task.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[task.status]}`} />
          {statusLabels[task.status]}
        </span>
      </div>
    </div>
  );
}
