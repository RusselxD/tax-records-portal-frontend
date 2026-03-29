import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck, Mail, ShieldAlert, Calendar } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { oosClientAPI } from "../../../../api/client";
import { getErrorMessage } from "../../../../lib/api-error";
import { formatDate } from "../../../../lib/formatters";
import { SearchInput, ClientStatusBadge } from "../../../../components/common";
import type { ClientOffboardingListItemResponse } from "../../../../types/client";

const HEADERS = [
  { label: "Client Name", className: "w-[25%] min-w-[180px]" },
  { label: "End of Engagement", className: "w-[15%] min-w-[120px]" },
  { label: "Deactivation", className: "w-[15%] min-w-[120px]" },
  { label: "Letter", className: "w-[10%] min-w-[80px]" },
  { label: "Records", className: "w-[12%] min-w-[90px]" },
  { label: "Status", className: "w-[12%] min-w-[100px]" },
];

function ClientRow({ client }: { client: ClientOffboardingListItemResponse }) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/oos/client-details/${client.id}`, {
        state: { backLabel: "Client Offboarding", backTo: "/oos/client-offboarding" },
      })}
      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
      <td className="px-4 py-4 max-w-0">
        <span className="block truncate text-sm font-medium text-primary" title={client.name}>
          {client.name}
        </span>
        <span className="block truncate text-xs text-gray-400 mt-0.5" title={client.email}>
          {client.email}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {formatDate(client.endOfEngagementDate)}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
        {client.deactivationDate ? formatDate(client.deactivationDate) : (
          <span className="text-gray-400">Not set</span>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {client.endOfEngagementLetterSent ? (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <MailCheck className="w-3.5 h-3.5" />
            Sent
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Mail className="w-3.5 h-3.5" />
            Pending
          </span>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {client.taxRecordsProtected ? (
          <span className="inline-flex items-center gap-1 text-xs text-red-500">
            <ShieldAlert className="w-3.5 h-3.5" />
            Protected
          </span>
        ) : (
          <span className="text-xs text-gray-400">Open</span>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <ClientStatusBadge status={client.status} />
      </td>
    </tr>
  );
}

export default function ClientOffboarding() {
  usePageTitle("Client Offboarding");

  const [allClients, setAllClients] = useState<ClientOffboardingListItemResponse[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await oosClientAPI.getMyOffboardingClients();
      setAllClients(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch clients."));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const clients = useMemo(() => {
    if (!search) return allClients;
    const q = search.toLowerCase();
    return allClients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [allClients, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput
          placeholder="Search by client name or email..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {error ? (
        <div className="rounded-lg bg-white custom-shadow p-8 text-center">
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <button onClick={fetchClients} className="text-sm text-accent hover:text-accent-hover font-medium">
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white custom-shadow">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                {HEADERS.map((h) => (
                  <th key={h.label} className={`th-label ${h.className}`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            {isFetching ? (
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: HEADERS.length }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 w-24 rounded skeleton" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : clients.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={HEADERS.length} className="px-4 py-12 text-center text-sm text-gray-500">
                    No offboarding clients found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {clients.map((c) => <ClientRow key={c.id} client={c} />)}
              </tbody>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
