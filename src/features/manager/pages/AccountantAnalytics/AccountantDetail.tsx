import { useParams, useLocation, useNavigate } from "react-router-dom";
import usePageTitle from "../../../../hooks/usePageTitle";
import { AccountantAnalyticsProvider } from "../../../common/pages/AccountantAnalytics/context/AccountantAnalyticsContext";
import { AccountantAnalyticsContent } from "../../../common/pages/AccountantAnalytics/AccountantAnalytics";
import BreadcrumbNav from "../../../../components/common/BreadcrumbNav";

interface LocationState {
  roleKey?: string;
  name?: string;
}

export default function AccountantDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  usePageTitle("Accountant Analytics");

  if (!id) return null;

  return (
    <div className="space-y-5">
      <BreadcrumbNav
        items={[
          { label: "Accountant Analytics", onClick: () => navigate("/manager/analytics") },
          { label: state?.name ?? "Performance" },
        ]}
      />

      <AccountantAnalyticsProvider userId={id}>
        <AccountantAnalyticsContent userId={id} roleKey={state?.roleKey} />
      </AccountantAnalyticsProvider>
    </div>
  );
}
