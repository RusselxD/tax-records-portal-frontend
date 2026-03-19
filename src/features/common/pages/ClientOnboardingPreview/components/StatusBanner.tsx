import { useNavigate } from "react-router-dom";
import { Clock, Eye, XCircle, Pencil, type LucideIcon } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants";
import { CLIENT_STATUS, type ClientStatus } from "../../../../../types/client";
import type { ProfileReviewStatus } from "../../../../../types/client-profile";

type BannerVariant = "emerald" | "blue" | "amber" | "red";

interface BannerConfig {
  variant: BannerVariant;
  icon: LucideIcon;
  message: string;
  editAction?: boolean;
}

const variantStyles: Record<BannerVariant, { wrapper: string; icon: string; text: string; button: string }> = {
  emerald: {
    wrapper: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-600",
    text: "text-emerald-800",
    button: "text-emerald-700 border-emerald-300 hover:bg-emerald-100",
  },
  blue: {
    wrapper: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    text: "text-blue-800",
    button: "text-blue-700 border-blue-300 hover:bg-blue-100",
  },
  amber: {
    wrapper: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    text: "text-amber-800",
    button: "text-amber-700 border-amber-300 hover:bg-amber-100",
  },
  red: {
    wrapper: "border-red-200 bg-red-50",
    icon: "text-red-600",
    text: "text-red-800",
    button: "text-red-700 border-red-300 hover:bg-red-100",
  },
};

interface StatusBannerProps {
  status?: ClientStatus;
  isReviewer: boolean;
  hasActiveTask: boolean;
  lastReviewStatus: ProfileReviewStatus | null;
  clientId: string;
}

function resolveBanner(
  status: ClientStatus,
  isReviewer: boolean,
  hasActiveTask: boolean,
  lastReviewStatus: ProfileReviewStatus | null,
): BannerConfig | null {
  if (status === CLIENT_STATUS.ONBOARDING && hasActiveTask) {
    return isReviewer
      ? {
          variant: "blue",
          icon: Eye,
          message: "This client profile is pending your review.",
        }
      : {
          variant: "amber",
          icon: Clock,
          message: "This profile has been submitted and is pending review.",
        };
  }

  if (status === CLIENT_STATUS.ONBOARDING && lastReviewStatus === "REJECTED" && !isReviewer) {
    return {
      variant: "red",
      icon: XCircle,
      message: "This profile was rejected. Please review the feedback and make the necessary changes.",
      editAction: true,
    };
  }

  return null;
}

export default function StatusBanner({
  status,
  isReviewer,
  hasActiveTask,
  lastReviewStatus,
  clientId,
}: StatusBannerProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = user ? getRolePrefix(user.roleKey) : "";

  if (!status) return null;

  const banner = resolveBanner(status, isReviewer, hasActiveTask, lastReviewStatus);
  if (!banner) return null;

  const styles = variantStyles[banner.variant];
  const Icon = banner.icon;

  return (
    <div className={`flex items-center ${banner.editAction ? "justify-between" : "gap-3"} rounded-lg border ${styles.wrapper} px-4 py-3 mt-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${styles.icon}`} />
        <p className={`text-sm ${styles.text}`}>{banner.message}</p>
      </div>
      {banner.editAction && (
        <button
          onClick={() => navigate(`${prefix}/new-client/${clientId}`)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-white border transition-colors flex-shrink-0 ml-4 ${styles.button}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      )}
    </div>
  );
}
