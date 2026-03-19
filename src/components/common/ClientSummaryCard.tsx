import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { clientAPI } from "../../api/client";
import ClientStatusBadge from "./ClientStatusBadge";
import type { ClientSummaryResponse } from "../../types/client";

function ClientSummarySkeleton() {
  return (
    <div className="rounded-lg bg-white border border-gray-200 px-4 py-4 space-y-3">
      <div className="h-4 w-24 rounded skeleton" />
      <div className="h-4 w-36 rounded skeleton" />
      <div className="h-5 w-16 rounded skeleton" />
      <div className="h-4 w-28 rounded skeleton" />
    </div>
  );
}

interface ClientSummaryCardProps {
  clientId: string | undefined;
  linkTo: string;
}

export default function ClientSummaryCard({
  clientId,
  linkTo,
}: ClientSummaryCardProps) {
  const [client, setClient] = useState<ClientSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!clientId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientAPI.getClientSummary(clientId);
      setClient(data);
    } catch {
      setError("Failed to load client details.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (!clientId || isLoading) return <ClientSummarySkeleton />;

  if (error) {
    return (
      <div className="rounded-lg bg-white border border-gray-200 p-5 text-center">
        <p className="text-xs text-status-rejected mb-2">{error}</p>
        <button
          onClick={fetchClient}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!client) return null;

  const hasDetails =
    client.taxpayerClassification ||
    client.assignedCsdOosAccountants.length > 0 ||
    client.assignedQtdAccountants.length > 0;

  return (
    <Link
      to={linkTo}
      className="block rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-primary leading-relaxed">
            {client.name}
          </p>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ClientStatusBadge status={client.status} />
          {client.mreCode && (
            <span className="text-sm text-gray-500 font-mono">
              {client.mreCode}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      {hasDetails && (
        <div className="px-4 pb-3 pt-2 border-t border-gray-100 space-y-3">
          {client.taxpayerClassification && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Classification</span>
              <span className="text-sm font-medium text-gray-600">
                {client.taxpayerClassification}
              </span>
            </div>
          )}

          {client.assignedCsdOosAccountants.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Assigned OOS / CSD Accountants
              </p>
              <ul className="space-y-0.5">
                {client.assignedCsdOosAccountants.map((name, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {client.assignedQtdAccountants.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-0.5">
                Assigned QTD Accountant
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {client.assignedQtdAccountants.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
