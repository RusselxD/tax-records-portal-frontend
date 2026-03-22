import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import Button from "../../../../../components/common/Button";
import Dropdown from "../../../../../components/common/Dropdown";
import SearchInput from "../../../../../components/common/SearchInput";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { usersAPI } from "../../../../../api/users";
import { useTaxRecordTasks } from "../context/TaxRecordTasksContext";

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Approved for Filing", value: "APPROVED_FOR_FILING" },
  { label: "Filed", value: "FILED" },
  { label: "Completed", value: "COMPLETED" },
];

const periodOptions = [
  { label: "All Periods", value: "" },
  { label: "January", value: "JAN" },
  { label: "February", value: "FEB" },
  { label: "March", value: "MAR" },
  { label: "April", value: "APR" },
  { label: "May", value: "MAY" },
  { label: "June", value: "JUN" },
  { label: "July", value: "JUL" },
  { label: "August", value: "AUG" },
  { label: "September", value: "SEP" },
  { label: "October", value: "OCT" },
  { label: "November", value: "NOV" },
  { label: "December", value: "DEC" },
  { label: "Q1", value: "Q1" },
  { label: "Q2", value: "Q2" },
  { label: "Q3", value: "Q3" },
  { label: "Q4", value: "Q4" },
  { label: "Annually", value: "ANNUALLY" },
];

interface TaxRecordTasksFiltersProps {
  onNewTask?: () => void;
  onImport?: () => void;
}

export default function TaxRecordTasksFilters({ onNewTask, onImport }: TaxRecordTasksFiltersProps) {
  const { user } = useAuth();
  const {
    filters,
    setSearch,
    setStatusFilter,
    setPeriodFilter,
    setYearFilter,
    setAccountantFilter,
  } = useTaxRecordTasks();

  const canManageTasks = hasPermission(user?.permissions, Permission.TASK_CREATE);
  const canViewAll = hasPermission(user?.permissions, Permission.TASK_VIEW_ALL);

  const [accountantOptions, setAccountantOptions] = useState<{ label: string; value: string }[]>([
    { label: "All Accountants", value: "" },
  ]);

  useEffect(() => {
    if (!canViewAll) return;
    async function fetchAccountants() {
      try {
        const data = await usersAPI.getAccountants("CSD,OOS");
        setAccountantOptions([
          { label: "All Accountants", value: "" },
          ...data.map((a) => ({ label: a.displayName, value: a.id })),
        ]);
      } catch {}
    }
    fetchAccountants();
  }, [canViewAll]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search by task name or client..."
            value={filters.search || ""}
            onChange={setSearch}
          />
          <Dropdown
            options={statusOptions}
            value={(filters.status as string) || ""}
            onChange={setStatusFilter}
          />
          <Dropdown
            options={periodOptions}
            value={(filters.period as string) || ""}
            onChange={setPeriodFilter}
          />
          <Dropdown
            options={yearOptions()}
            value={filters.year?.toString() || ""}
            onChange={setYearFilter}
          />
          {canViewAll && (
            <Dropdown
              options={accountantOptions}
              value={filters.accountantId || ""}
              onChange={setAccountantFilter}
            />
          )}
        </div>
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
    </div>
  );
}

function yearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  years.push({ label: "All Years", value: "" });
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push({ label: String(y), value: String(y) });
  }
  return years;
}
