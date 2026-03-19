import { Search } from "lucide-react";
import Dropdown from "../../../../../components/common/Dropdown";
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
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client or submitter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-4 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20"
          />
        </div>
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
