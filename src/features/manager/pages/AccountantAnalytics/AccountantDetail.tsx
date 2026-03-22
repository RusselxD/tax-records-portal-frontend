import { useParams, useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { AccountantAnalyticsProvider } from "../../../common/pages/AccountantAnalytics/context/AccountantAnalyticsContext";
import { AccountantAnalyticsContent } from "../../../common/pages/AccountantAnalytics/AccountantAnalytics";

interface LocationState {
  roleKey?: string;
  name?: string;
}

export default function AccountantDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  usePageTitle("Accountant Analytics");

  if (!id) return null;

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          to="/manager/analytics"
          className="hover:text-primary transition-colors"
        >
          Accountant Analytics
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-medium">
          {state?.name ?? "Performance"}
        </span>
      </nav>

      <AccountantAnalyticsProvider userId={id}>
        <AccountantAnalyticsContent userId={id} roleKey={state?.roleKey} />
      </AccountantAnalyticsProvider>
    </div>
  );
}
