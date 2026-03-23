import { useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import ClientStatusBadge from "../../../../../components/common/ClientStatusBadge";
import { useClientOnboarding } from "../context/ClientOnboardingContext";
import type { ClientOnboardingListItemResponse } from "../../../../../types/client";

const HEADERS = [
  { label: "Client Name", className: "w-[30%] min-w-[200px]" },
  { label: "Email", className: "w-[20%] min-w-[180px]" },
  { label: "Status", className: "w-[12%] min-w-[130px]" },
  { label: "Date Created", className: "w-[12%] min-w-[100px]" },
  { label: "Last Updated", className: "w-[12%] min-w-[100px]" },
  { label: "Actions", className: "w-[10%] min-w-[80px]" },
];

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200">
      {HEADERS.map((header) => (
        <th
          key={header.label}
          className={`th-label ${header.className}`}
        >
          {header.label}
        </th>
      ))}
    </tr>
  </thead>
);

const reviewState = {
  backLabel: "Client Onboarding",
  backTo: "/oos/client-onboarding",
};

function ActionButtons({
  clientId,
  isHandedOff,
  hasActiveTask,
  activeTaskId,
  lastTaskId,
}: {
  clientId: string;
  isHandedOff: boolean;
  hasActiveTask: boolean;
  activeTaskId: string | null;
  lastTaskId: string | null;
}) {
  const navigate = useNavigate();

  if (isHandedOff) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            navigate(`/oos/client-snapshot/${clientId}`, { state: reviewState })
          }
          className="p-1 text-gray-400 hover:text-accent transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          const taskId = activeTaskId ?? lastTaskId;
          taskId
            ? navigate(`/oos/client-preview/${taskId}`, { state: reviewState })
            : navigate(`/oos/client-details/${clientId}`, { state: reviewState });
        }}
        className="p-1 text-gray-400 hover:text-accent transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      {!hasActiveTask && (
        <button
          onClick={() => navigate(`/oos/new-client/${clientId}`)}
          className="p-1 text-gray-400 hover:text-accent transition-colors"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

const ClientRow = ({
  client,
}: {
  client: ClientOnboardingListItemResponse;
}) => (
  <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
    <td className="px-4 py-4 text-sm font-medium text-primary max-w-0">
      <span className="block truncate" title={client.name || undefined}>
        {client.name || <span className="text-gray-400 italic">Unnamed Client</span>}
      </span>
    </td>
    <td className="px-4 py-4 text-sm text-gray-600 max-w-0">
      <span className="block truncate" title={client.email || undefined}>
        {client.email || <span className="text-gray-400 italic">No email</span>}
      </span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <ClientStatusBadge status={client.status} />
    </td>
    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
      {formatDate(client.createdAt)}
    </td>
    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
      {formatDate(client.updatedAt)}
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <ActionButtons clientId={client.id} isHandedOff={client.handedOff} hasActiveTask={client.hasActiveTask} activeTaskId={client.activeTaskId} lastTaskId={client.lastTaskId} />
    </td>
  </tr>
);

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        {Array.from({ length: HEADERS.length }).map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 w-24 rounded skeleton" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const EmptyState = () => (
  <tbody>
    <tr>
      <td
        colSpan={HEADERS.length}
        className="px-4 py-12 text-center text-sm text-gray-500"
      >
        No clients found.
      </td>
    </tr>
  </tbody>
);

export default function ClientOnboardingTable() {
  const { clients, isFetching, error, refetch } = useClientOnboarding();

  if (error) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white custom-shadow">
      <table className="w-full table-fixed">
        <TableHeader />
        {isFetching ? (
          <TableSkeleton />
        ) : clients.length === 0 ? (
          <EmptyState />
        ) : (
          <tbody>
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
