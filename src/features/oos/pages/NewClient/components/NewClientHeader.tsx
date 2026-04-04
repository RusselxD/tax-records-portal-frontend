import { useNavigate } from "react-router-dom";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { useNewClient } from "../context/NewClientContext";
import type { SaveStatus } from "../../../../../types/client";
import { deriveClientDisplayName } from "../../../../../lib/formatters";
import ClientStatusBadge from "../../../../../components/common/ClientStatusBadge";
import BackButton from "../../../../../components/common/BackButton";

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
  const derived = deriveClientDisplayName(
    sections.clientInformation?.registeredName,
    sections.clientInformation?.tradeName,
  );
  return derived || header?.displayName || "";
}

export default function NewClientHeader() {
  const navigate = useNavigate();
  const { globalSaveStatus, header } = useNewClient();
  const clientName = useClientDisplayName();

  const title = "New Client";

  return (
    <div className="mb-8">
      <BackButton label="Client Onboarding" onClick={() => navigate("/oos/client-onboarding")} className="mb-2" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          {clientName || title}
        </h1>
        <GlobalSaveIndicator status={globalSaveStatus} />
      </div>

      {header?.status && (
        <div className="mt-3">
          <ClientStatusBadge status={header.status} />
        </div>
      )}
    </div>
  );
}
