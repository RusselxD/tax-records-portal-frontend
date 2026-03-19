import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ClientStatus } from "../../../../types/client";
import ClientStatusBadge from "../../../../components/common/ClientStatusBadge";

interface ClientInfoHeaderProps {
  clientName: string;
  status?: ClientStatus;
  backLabel: string;
  backTo: string;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ClientInfoHeader({
  clientName,
  status,
  backLabel,
  backTo,
  headerActions,
  children,
}: ClientInfoHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <button
          onClick={() => navigate(backTo)}
          className="hover:text-accent transition-colors"
        >
          {backLabel}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-600">{clientName || "Client Details"}</span>
      </div>

      {/* Title + Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          {clientName || "Client Details"}
        </h1>
        <div className="flex items-center gap-3">
          {headerActions}
          {status && <ClientStatusBadge status={status} />}
        </div>
      </div>

      {children}
    </div>
  );
}
