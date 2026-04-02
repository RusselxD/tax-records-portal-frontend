import { useNavigate } from "react-router-dom";
import type { ClientStatus } from "../../../../types/client";
import ClientStatusBadge from "../../../../components/common/ClientStatusBadge";
import BreadcrumbNav from "../../../../components/common/BreadcrumbNav";

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
    <div className="mb-4">
      {/* Breadcrumb */}
      <BreadcrumbNav
        items={[
          { label: backLabel, onClick: () => navigate(backTo) },
          { label: clientName || "Client Details" },
        ]}
        className="mb-2"
      />

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

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
