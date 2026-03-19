import { useNavigate } from "react-router-dom";
import { Loader2, Check, AlertTriangle, ChevronRight } from "lucide-react";
import { useNewClient } from "../context/NewClientContext";
import type { SaveStatus } from "../../../../../types/client";
import { deriveClientDisplayName } from "../../../../../lib/formatters";
import ClientStatusBadge from "../../../../../components/common/ClientStatusBadge";

function GlobalSaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-status-pending">
        <Loader2 className="h-4 w-4 animate-spin" />
        Saving...
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-status-approved">
        <Check className="h-4 w-4" />
        Saved
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-status-rejected">
        <AlertTriangle className="h-4 w-4" />
        Save failed
      </span>
    );
  }
  return <span className="text-sm text-gray-400">All changes saved</span>;
}

function useClientDisplayName(): string {
  const { header, sections } = useNewClient();
  if (header?.clientDisplayName) return header.clientDisplayName;
  return deriveClientDisplayName(
    sections.clientInformation?.registeredName,
    sections.clientInformation?.tradeName,
  );
}

export default function NewClientHeader() {
  const navigate = useNavigate();
  const { globalSaveStatus, header } = useNewClient();
  const clientName = useClientDisplayName();

  const title = "New Client";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <button
          onClick={() => navigate("/oos/client-onboarding")}
          className="hover:text-accent transition-colors"
        >
          Client Onboarding
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-600">{clientName || title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          {clientName || title}
        </h1>
        <GlobalSaveIndicator status={globalSaveStatus} />
      </div>

      {header?.clientStatus && (
        <div className="mt-3">
          <ClientStatusBadge status={header.clientStatus} />
        </div>
      )}
    </div>
  );
}
