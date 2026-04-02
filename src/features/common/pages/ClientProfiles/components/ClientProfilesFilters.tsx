import SearchInput from "../../../../../components/common/SearchInput";
import { useClientProfiles } from "../context/ClientProfilesContext";

export default function ClientProfilesFilters() {
  const { search, setSearch } = useClientProfiles();

  return (
    <div>
      <SearchInput
        placeholder="Search by client or submitter..."
        value={search}
        onChange={setSearch}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
