import Dropdown from "../../../../../components/common/Dropdown";
import SearchInput from "../../../../../components/common/SearchInput";
import { useClientProfiles } from "../context/ClientProfilesContext";

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Onboarding", value: "ONBOARDING" },
  { label: "Profile Update", value: "PROFILE_UPDATE" },
];

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function ClientProfilesFilters() {
  const { search, typeFilter, statusFilter, setSearch, setTypeFilter, setStatusFilter } =
    useClientProfiles();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search by client or submitter..."
          value={search}
          onChange={setSearch}
        />
        <Dropdown
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <Dropdown
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>
    </div>
  );
}
