import { useState } from "react";
import { UserX, ShieldAlert, ShieldCheck, Mail, MailCheck, Loader2 } from "lucide-react";
import { clientAPI } from "../../../../../api/client";
import { formatDate } from "../../../../../lib/formatters";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants";
import type { ClientInfoHeaderResponse } from "../../../../../types/client-info";

interface OffboardingBannerProps {
  clientId: string;
  header: ClientInfoHeaderResponse;
  onSendLetter: () => void;
  onProtectionChange: (value: boolean) => void;
}

export default function OffboardingBanner({
  clientId,
  header,
  onSendLetter,
  onProtectionChange,
}: OffboardingBannerProps) {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const canManage = hasPermission(user?.permissions, Permission.CLIENT_MANAGE);
  const [isToggling, setIsToggling] = useState(false);

  const isAssignedOos = header.offboarding?.accountantName && user?.name === header.offboarding?.accountantName;
  const canSendLetter = canManage || isAssignedOos;

  const handleToggleProtection = async () => {
    const newValue = !header.offboarding?.taxRecordsProtected;
    setIsToggling(true);
    try {
      await clientAPI.toggleTaxRecordsProtection(clientId, newValue);
      onProtectionChange(newValue);
      toastSuccess(
        newValue ? "Tax Records Protected" : "Tax Records Unprotected",
        newValue
          ? "Client can no longer download tax record files."
          : "Client can now download tax record files.",
      );
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to update protection."));
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3 mb-4">
        <UserX className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            This client is being offboarded.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
            Assigned OOS
          </p>
          <p className="text-sm text-amber-900 font-medium">
            {header.offboarding?.accountantName ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
            End of Engagement
          </p>
          <p className="text-sm text-amber-900 font-medium">
            {header.offboarding?.endOfEngagementDate ? formatDate(header.offboarding?.endOfEngagementDate) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
            Deactivation Date
          </p>
          <p className="text-sm text-amber-900 font-medium">
            {header.offboarding?.deactivationDate ? formatDate(header.offboarding?.deactivationDate) : "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
            End of Engagement Letter
          </p>
          <p className="text-sm text-amber-900 font-medium flex items-center gap-1.5">
            {header.offboarding?.endOfEngagementLetterSent ? (
              <><MailCheck className="w-3.5 h-3.5 text-emerald-600" /> Sent</>
            ) : (
              <><Mail className="w-3.5 h-3.5 text-gray-400" /> Not sent</>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-amber-200 pt-4">
        {canSendLetter && (
          <button
            onClick={onSendLetter}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {header.offboarding?.endOfEngagementLetterSent ? "Resend Letter" : "Send End of Engagement Letter"}
          </button>
        )}

        {canManage && (
          <button
            onClick={handleToggleProtection}
            disabled={isToggling}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
              header.offboarding?.taxRecordsProtected
                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : header.offboarding?.taxRecordsProtected ? (
              <ShieldAlert className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {header.offboarding?.taxRecordsProtected ? "Records Protected" : "Protect Tax Records"}
          </button>
        )}
      </div>
    </div>
  );
}
