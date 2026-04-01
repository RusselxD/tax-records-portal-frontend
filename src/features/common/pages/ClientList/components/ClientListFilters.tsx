import SearchInput from "../../../../../components/common/SearchInput";
import { useClientList } from "../context/ClientListContext";

export default function ClientListFilters() {
  const { search, setSearch } = useClientList();

  return (
    <div>
      <SearchInput
        placeholder="Search by name..."
        value={search}
        onChange={setSearch}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
