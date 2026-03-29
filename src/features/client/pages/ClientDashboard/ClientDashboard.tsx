import usePageTitle from "../../../../hooks/usePageTitle";
import useClientNotices from "./hooks/useClientNotices";
import ImportantDates from "./components/ImportantDates";
import PendingDocumentsAndReminders from "./components/PendingDocumentsAndReminders";
import OutstandingBilling from "./components/OutstandingBilling";
import RecentTaxDocuments from "./components/RecentTaxDocuments";
import Highlights from "./components/Highlights";
import ConsultationSummary from "./components/ConsultationSummary";

export default function ClientDashboard() {
  usePageTitle("Dashboard");

  const { reminders, pendingDocuments, highlights, isLoading: noticesLoading } = useClientNotices();

  return (
    <div className="space-y-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ImportantDates />
        <PendingDocumentsAndReminders
          reminders={reminders}
          pendingDocuments={pendingDocuments}
          isLoading={noticesLoading}
        />
        <OutstandingBilling />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentTaxDocuments />
        <ConsultationSummary />
        <Highlights highlights={highlights} isLoading={noticesLoading} />
      </div>
    </div>
  );
}
