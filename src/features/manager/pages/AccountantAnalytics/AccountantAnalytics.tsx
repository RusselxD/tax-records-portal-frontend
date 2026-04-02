import { useCallback, useEffect, useState } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { systemAnalyticsAPI } from "../../../../api/systemAnalytics";
import { getErrorMessage } from "../../../../lib/api-error";
import SearchInput from "../../../../components/common/SearchInput";
import type { AccountantOverviewItem } from "../../../../types/analytics";
import AccountantCard from "./components/AccountantCard";

export default function AccountantAnalytics() {
  usePageTitle("Accountant Analytics");

  const [accountants, setAccountants] = useState<AccountantOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await systemAnalyticsAPI.getAccountantOverview();
      setAccountants(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load accountants."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const query = search.toLowerCase();
  const filtered = accountants.filter(
    (a) =>
      !query ||
      a.name.toLowerCase().includes(query) ||
      a.position?.toLowerCase().includes(query),
  );

  return (
    <div className="space-y-5">
      <SearchInput
        placeholder="Search by name or position..."
        value={search}
        onChange={setSearch}
      />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton rounded-lg h-40" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-center rounded-lg bg-red-50 p-8 text-sm text-status-rejected">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="ml-2 underline hover:no-underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          {search
            ? "No accountants match your search."
            : "No accountants found."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AccountantCard key={a.id} accountant={a} />
          ))}
        </div>
      )}
    </div>
  );
}
