import usePageTitle from "../../../../hooks/usePageTitle";
import useClientNotices from "./hooks/useClientNotices";
import ImportantDates from "./components/ImportantDates";
import PendingDocumentsAndReminders from "./components/PendingDocumentsAndReminders";
import OutstandingBilling from "./components/OutstandingBilling";
import RecentTaxDocuments from "./components/RecentTaxDocuments";
import Highlights from "./components/Highlights";

export default function ClientDashboard() {
  usePageTitle("Dashboard");

  const { reminders, pendingDocuments, highlights, isLoading: noticesLoading } = useClientNotices();

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ImportantDates />
        <PendingDocumentsAndReminders
          reminders={reminders}
          pendingDocuments={pendingDocuments}
          isLoading={noticesLoading}
        />
        <OutstandingBilling />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5">
          <RecentTaxDocuments />
        </div>
        <div className="lg:w-2/5">
          <Highlights highlights={highlights} isLoading={noticesLoading} />
        </div>
      </div>
    </div>
  );
}
