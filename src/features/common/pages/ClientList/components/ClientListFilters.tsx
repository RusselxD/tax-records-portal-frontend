import SearchInput from "../../../../../components/common/SearchInput";
import { useClientList } from "../context/ClientListContext";

export default function ClientListFilters() {
  const { search, setSearch } = useClientList();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search by name..."
          value={search}
          onChange={setSearch}
        />
      </div>
    </div>
  );
}
