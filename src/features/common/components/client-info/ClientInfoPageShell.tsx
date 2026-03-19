import type { ReactNode } from "react";
import { Button } from "../../../../components/common";
import type { ClientStatus } from "../../../../types/client";
import ClientInfoHeader from "./ClientInfoHeader";

interface ClientInfoPageShellProps {
  clientName: string;
  status?: ClientStatus;
  backLabel: string;
  backTo: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  headerActions?: ReactNode;
  banner?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export default function ClientInfoPageShell({
  clientName,
  status,
  backLabel,
  backTo,
  isLoading,
  error,
  refetch,
  headerActions,
  banner,
  sidebar,
  children,
}: ClientInfoPageShellProps) {
  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <ClientInfoHeader
          clientName={clientName}
          status={status}
          backLabel={backLabel}
          backTo={backTo}
          headerActions={headerActions}
        />
        <div className="flex gap-2 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white custom-shadow p-6">
                <div className="h-5 w-48 rounded skeleton mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-3 w-20 rounded skeleton" />
                    <div className="h-9 w-full rounded skeleton" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded skeleton" />
                    <div className="h-9 w-full rounded skeleton" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded skeleton" />
                    <div className="h-9 w-full rounded skeleton" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded skeleton" />
                    <div className="h-9 w-full rounded skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[21rem] flex-shrink-0 hidden lg:block space-y-3">
            <div className="rounded-lg bg-white custom-shadow p-5 space-y-4">
              <div className="h-4 w-32 rounded skeleton" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-2/3 rounded skeleton" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <ClientInfoHeader
          clientName={clientName}
          status={status}
          backLabel={backLabel}
          backTo={backTo}
          headerActions={headerActions}
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <Button variant="secondary" onClick={refetch}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-12">
      <ClientInfoHeader
        clientName={clientName}
        status={status}
        backLabel={backLabel}
        backTo={backTo}
        headerActions={headerActions}
      >
        {banner}
      </ClientInfoHeader>

      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0 space-y-3">
          {children}
        </div>

        <div className="w-[21rem] flex-shrink-0 hidden lg:block sticky top-6 self-start space-y-3">
          {sidebar}
        </div>
      </div>
    </div>
  );
}
