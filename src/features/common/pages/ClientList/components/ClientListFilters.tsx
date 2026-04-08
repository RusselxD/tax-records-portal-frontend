import SearchInput from "../../../../../components/common/SearchInput";
import Dropdown from "../../../../../components/common/Dropdown";
import { useClientList } from "../context/ClientListContext";
import { CLIENT_STATUS } from "../../../../../types/client";
import type { ClientStatus } from "../../../../../types/client";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Onboarding", value: CLIENT_STATUS.ONBOARDING },
  { label: "Active Client", value: CLIENT_STATUS.ACTIVE_CLIENT },
  { label: "Offboarding", value: CLIENT_STATUS.OFFBOARDING },
  { label: "Inactive", value: CLIENT_STATUS.INACTIVE_CLIENT },
];

export default function ClientListFilters() {
  const { search, setSearch, statusFilter, setStatusFilter } = useClientList();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dropdown
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={(v) => setStatusFilter(v as ClientStatus | "")}
      />
      <SearchInput
        placeholder="Search by name..."
        value={search}
        onChange={setSearch}
        className="w-full sm:w-72"
      />
    </div>
  );
}
