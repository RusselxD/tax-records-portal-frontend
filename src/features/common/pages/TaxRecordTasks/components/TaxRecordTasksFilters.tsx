import { Plus, Upload } from "lucide-react";
import Button from "../../../../../components/common/Button";
import SearchInput from "../../../../../components/common/SearchInput";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { useTaxRecordTasks } from "../context/TaxRecordTasksContext";

interface TaxRecordTasksFiltersProps {
  onNewTask?: () => void;
  onImport?: () => void;
}

export default function TaxRecordTasksFilters({ onNewTask, onImport }: TaxRecordTasksFiltersProps) {
  const { user } = useAuth();
  const { filters, setSearch } = useTaxRecordTasks();
  const canManageTasks = hasPermission(user?.permissions, Permission.TASK_CREATE);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
      <SearchInput
        placeholder="Search by task name or client..."
        value={filters.search || ""}
        onChange={setSearch}
        className="w-full sm:w-auto"
      />
      {canManageTasks && (
        <div className="flex items-center gap-3">
          {onImport && (
            <Button variant="secondary" onClick={onImport}>
              <Upload className="w-4 h-4" />
              Import
            </Button>
          )}
          {onNewTask && (
            <Button onClick={onNewTask}>
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
