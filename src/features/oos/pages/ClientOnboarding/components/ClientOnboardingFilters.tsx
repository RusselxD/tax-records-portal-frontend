import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../../../../../components/common/Button";
import Dropdown from "../../../../../components/common/Dropdown";
import SearchInput from "../../../../../components/common/SearchInput";
import { useClientOnboarding } from "../context/ClientOnboardingContext";

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Onboarding", value: "ONBOARDING" },
  { label: "Active Client", value: "ACTIVE_CLIENT" },
  { label: "Offboarding", value: "OFFBOARDING" },
  { label: "Inactive Client", value: "INACTIVE_CLIENT" },
];

export default function ClientOnboardingFilters() {
  const navigate = useNavigate();
  const { search, statusFilter, setSearch, setStatusFilter } =
    useClientOnboarding();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search by name or email..."
          value={search}
          onChange={setSearch}
        />
        <Dropdown
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>
      <Button onClick={() => navigate("/oos/new-client")}>
        <Plus className="w-4 h-4" />
        Add Client
      </Button>
    </div>
  );
}
