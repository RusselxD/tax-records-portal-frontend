import usePageTitle from "../../../../hooks/usePageTitle";
import useClientNotices from "./hooks/useClientNotices";
import ImportantDates from "./components/ImportantDates";
import PendingDocumentsAndReminders from "./components/PendingDocumentsAndReminders";
import OutstandingBilling from "./components/OutstandingBilling";
import RecentTaxDocuments from "./components/RecentTaxDocuments";
import Highlights from "./components/Highlights";
import ConsultationSummary from "./components/ConsultationSummary";
import ContactUs from "./components/ContactUs";

export default function ClientDashboard() {
  usePageTitle("Dashboard");

  const {
    reminders,
    pendingDocuments,
    highlights,
    isLoading: noticesLoading,
  } = useClientNotices();

  return (
    <div className="space-y-4 pb-12">
      <div className="grid grid-cols-1 auto-rows-[18rem] md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2 xl:gap-4">
        <ImportantDates />
        <ConsultationSummary />
        <OutstandingBilling />
        <RecentTaxDocuments />
        <PendingDocumentsAndReminders
          reminders={reminders}
          pendingDocuments={pendingDocuments}
          isLoading={noticesLoading}
        />
        <Highlights highlights={highlights} isLoading={noticesLoading} />
      </div>
      <ContactUs />
    </div>
  );
}
