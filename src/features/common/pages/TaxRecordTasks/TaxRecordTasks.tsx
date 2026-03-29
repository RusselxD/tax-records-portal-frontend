import { useState, useRef } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { TaxRecordTasksProvider, useTaxRecordTasks } from "./context/TaxRecordTasksContext";
import TaxRecordTasksFilters from "./components/TaxRecordTasksFilters";
import TaxRecordTasksTable from "./components/TaxRecordTasksTable";
import ImportTaxRecordTasksForm from "./components/ImportTaxRecordTasksForm";
import CreateTaxRecordTaskForm from "./components/CreateTaxRecordTaskForm";

type View = "table" | "import" | "create";

function TaxRecordTasksContent() {
  const [view, setView] = useState<View>("table");
  const { refetch } = useTaxRecordTasks();
  const didChangeRef = useRef(false);

  const handleBackToTable = () => {
    if (didChangeRef.current) refetch();
    didChangeRef.current = false;
    setView("table");
  };

  const handleSuccess = () => {
    didChangeRef.current = true;
  };

  if (view === "import") {
    return (
      <ImportTaxRecordTasksForm
        onCancel={handleBackToTable}
        onSuccess={handleSuccess}
      />
    );
  }

  if (view === "create") {
    return (
      <CreateTaxRecordTaskForm
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
      <TaxRecordTasksFilters
        onImport={() => setView("import")}
        onNewTask={() => setView("create")}
      />
      <TaxRecordTasksTable />
    </div>
  );
}

export default function TaxRecordTasks({ title = "Tax Record Tasks" }: { title?: string }) {
  usePageTitle(title);

  return (
    <TaxRecordTasksProvider>
      <TaxRecordTasksContent />
    </TaxRecordTasksProvider>
  );
}
