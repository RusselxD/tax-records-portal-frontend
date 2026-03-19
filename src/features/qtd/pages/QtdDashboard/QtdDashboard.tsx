import usePageTitle from "../../../../hooks/usePageTitle";
import ReviewActivity from "./components/ReviewActivity";
import ReviewerStats from "./components/ReviewerStats";

export default function QtdDashboard() {
  usePageTitle("Dashboard");

  return (
    <div className="space-y-5">
      <ReviewerStats />
      <ReviewActivity />
    </div>
  );
}
