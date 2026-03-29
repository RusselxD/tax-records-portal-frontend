import { Plus } from "lucide-react";
import Button from "../../../../../components/common/Button";
import SearchInput from "../../../../../components/common/SearchInput";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { useConsultationLogs } from "../context/ConsultationLogsContext";

interface ConsultationLogsFiltersProps {
  onNewLog?: () => void;
}

export default function ConsultationLogsFilters({ onNewLog }: ConsultationLogsFiltersProps) {
  const { user } = useAuth();
  const { filters, setSearch } = useConsultationLogs();
  const canCreate = hasPermission(user?.permissions, Permission.CONSULTATION_CREATE);

  return (
    <div className="flex items-center justify-between">
      <SearchInput
        placeholder="Search by subject or platform..."
        value={filters.search || ""}
        onChange={setSearch}
      />
      {canCreate && onNewLog && (
        <Button onClick={onNewLog}>
          <Plus className="w-4 h-4" />
          New Consultation
        </Button>
      )}
    </div>
  );
}
