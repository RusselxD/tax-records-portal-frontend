import { useState, useRef } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { TaxRecordTasksProvider, useTaxRecordTasks } from "./context/TaxRecordTasksContext";
import TaxRecordTasksFilters from "./components/TaxRecordTasksFilters";
import TaxRecordTasksTable from "./components/TaxRecordTasksTable";
import ImportTaxRecordTasksForm from "./components/ImportTaxRecordTasksForm";

type View = "table" | "import";

function TaxRecordTasksContent() {
  const [view, setView] = useState<View>("table");
  const { refetch } = useTaxRecordTasks();
  const didImportRef = useRef(false);

  const handleBackToTable = () => {
    if (didImportRef.current) refetch();
    didImportRef.current = false;
    setView("table");
  };

  const handleImportSuccess = () => {
    didImportRef.current = true;
  };

  if (view === "import") {
    return (
      <ImportTaxRecordTasksForm
        onCancel={handleBackToTable}
        onSuccess={handleImportSuccess}
      />
    );
  }

  return (
    <div className="space-y-4">
      <TaxRecordTasksFilters onImport={() => setView("import")} />
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
