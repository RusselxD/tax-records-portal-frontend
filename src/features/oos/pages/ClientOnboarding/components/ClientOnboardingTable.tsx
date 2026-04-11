import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import { ClientStatusBadge, ResponsiveTable } from "../../../../../components/common";
import type { CardField } from "../../../../../components/common/ResponsiveTable";
import { useClientOnboarding } from "../context/ClientOnboardingContext";
import type { ClientOnboardingListItemResponse } from "../../../../../types/client";

const BASE_HEADERS = [
  { label: "Client Name", className: "w-[30%] min-w-[200px]" },
  { label: "Email", className: "w-[20%] min-w-[180px]" },
  { label: "Status", className: "w-[12%] min-w-[130px]" },
  { label: "Date Created", className: "w-[12%] min-w-[100px]" },
  { label: "Last Updated", className: "w-[12%] min-w-[100px]" },
];
const ACTIONS_HEADER = { label: "Actions", className: "w-[10%] min-w-[80px]" };

const getHeaders = (showActions: boolean) =>
  showActions ? [...BASE_HEADERS, ACTIONS_HEADER] : BASE_HEADERS;

const TableHeader = ({ showActions }: { showActions: boolean }) => (
  <thead>
    <tr className="border-b border-gray-200">
      {getHeaders(showActions).map((header) => (
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

function StatusCell({ client }: { client: ClientOnboardingListItemResponse }) {
  if (client.handedOff) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        Handed Off
      </span>
    );
  }
  return <ClientStatusBadge status={client.status} />;
}

function getRowNavPath(client: ClientOnboardingListItemResponse): string | null {
  if (client.handedOff) {
    return `/oos/client-snapshot/${client.id}`;
  }
  if (client.hasActiveTask) {
    const taskId = client.activeTaskId ?? client.lastTaskId;
    return taskId
      ? `/oos/client-preview/${taskId}`
      : `/oos/client-details/${client.id}`;
  }
  return null;
}

function ActionButtons({
  client,
  rowClickable,
}: {
  client: ClientOnboardingListItemResponse;
  rowClickable: boolean;
}) {
  const navigate = useNavigate();

  // Row handles navigation (desktop single-button cases) — no icon needed.
  if (rowClickable) return null;

  // Row is not clickable — buttons own their navigation.
  if (client.handedOff) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            navigate(`/oos/client-snapshot/${client.id}`, { state: reviewState })
          }
          className="p-2 text-gray-400 hover:text-accent transition-colors"
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
          const taskId = client.activeTaskId ?? client.lastTaskId;
          taskId
            ? navigate(`/oos/client-preview/${taskId}`, { state: reviewState })
            : navigate(`/oos/client-details/${client.id}`, { state: reviewState });
        }}
        className="p-2 text-gray-400 hover:text-accent transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      {!client.hasActiveTask && (
        <button
          onClick={() => navigate(`/oos/new-client/${client.id}`)}
          className="p-2 text-gray-400 hover:text-accent transition-colors"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

const ClientRow = ({
  client,
  showActions,
}: {
  client: ClientOnboardingListItemResponse;
  showActions: boolean;
}) => {
  const navigate = useNavigate();
  const rowNav = getRowNavPath(client);
  const handleRowClick = rowNav
    ? () => navigate(rowNav, { state: reviewState })
    : undefined;

  return (
    <tr
      onClick={handleRowClick}
      className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors ${
        handleRowClick ? "cursor-pointer" : ""
      }`}
    >
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
        <StatusCell client={client} />
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(client.createdAt)}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(client.updatedAt)}
      </td>
      {showActions && (
        <td className="px-4 py-4 whitespace-nowrap">
          <ActionButtons client={client} rowClickable={!!handleRowClick} />
        </td>
      )}
    </tr>
  );
};

const TableSkeleton = ({ showActions }: { showActions: boolean }) => {
  const columnCount = getHeaders(showActions).length;
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: columnCount }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 w-24 rounded skeleton" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const EmptyState = ({ showActions }: { showActions: boolean }) => (
  <tbody>
    <tr>
      <td
        colSpan={getHeaders(showActions).length}
        className="px-4 py-12 text-center text-sm text-gray-500"
      >
        No clients found.
      </td>
    </tr>
  </tbody>
);

export default function ClientOnboardingTable() {
  const { clients, isFetching, error, refetch } = useClientOnboarding();

  const primaryFields = useCallback(
    (client: ClientOnboardingListItemResponse): CardField[] => [
      {
        label: "Client Name",
        value: client.name || (
          <span className="text-gray-400 italic">Unnamed Client</span>
        ),
      },
      {
        label: "Status",
        value: <StatusCell client={client} />,
      },
      {
        label: "Date Created",
        value: formatDate(client.createdAt),
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (client: ClientOnboardingListItemResponse): CardField[] => [
      {
        label: "Email",
        value: client.email || (
          <span className="text-gray-400 italic">No email</span>
        ),
      },
      {
        label: "Last Updated",
        value: formatDate(client.updatedAt),
      },
    ],
    [],
  );

  const renderActions = useCallback(
    (client: ClientOnboardingListItemResponse) => (
      <ActionButtons client={client} rowClickable={false} />
    ),
    [],
  );

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

  const showActions = clients.some((c) => getRowNavPath(c) === null);

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <ResponsiveTable
        data={clients}
        keyExtractor={(client) => client.id}
        primaryFields={primaryFields}
        secondaryFields={secondaryFields}
        actions={renderActions}
        isLoading={isFetching}
        emptyMessage="No clients found."
      >
        <table className="w-full table-fixed">
          <TableHeader showActions={showActions} />
          {isFetching ? (
            <TableSkeleton showActions={showActions} />
          ) : clients.length === 0 ? (
            <EmptyState showActions={showActions} />
          ) : (
            <tbody>
              {clients.map((client) => (
                <ClientRow key={client.id} client={client} showActions={showActions} />
              ))}
            </tbody>
          )}
        </table>
      </ResponsiveTable>
    </div>
  );
}
