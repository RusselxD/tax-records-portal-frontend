import { useState, useRef } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { ConsultationLogsProvider, useConsultationLogs } from "./context/ConsultationLogsContext";
import ConsultationLogsFilters from "./components/ConsultationLogsFilters";
import ConsultationLogsTable from "./components/ConsultationLogsTable";
import CreateConsultationLogForm from "./components/CreateConsultationLogForm";

type View = "table" | "create";

function ConsultationLogsContent() {
  const [view, setView] = useState<View>("table");
  const { refetch } = useConsultationLogs();
  const didChangeRef = useRef(false);

  const handleBackToTable = () => {
    if (didChangeRef.current) refetch();
    didChangeRef.current = false;
    setView("table");
  };

  if (view === "create") {
    return (
      <CreateConsultationLogForm
        onCancel={handleBackToTable}
        onSuccess={() => {
          didChangeRef.current = true;
          handleBackToTable();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ConsultationLogsFilters onNewLog={() => setView("create")} />
      <ConsultationLogsTable />
    </div>
  );
}

export default function ConsultationLogs({ title = "Consultation Logs" }: { title?: string }) {
  usePageTitle(title);

  return (
    <ConsultationLogsProvider>
      <ConsultationLogsContent />
    </ConsultationLogsProvider>
  );
}
