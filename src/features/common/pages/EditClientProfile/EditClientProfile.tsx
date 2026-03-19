import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { Button } from "../../../../components/common";
import { NewClientShimProvider } from "../../../oos/pages/NewClient/context/NewClientContext";
import {
  EditClientProfileProvider,
  useEditClientProfile,
  SECTIONS,
} from "./context/EditClientProfileContext";
import EditClientHeader from "./components/EditClientHeader";
import EditAccordionSection from "./components/EditAccordionSection";
import EditStickyActionBar from "./components/EditStickyActionBar";

function EditClientProfileContent() {
  const { clientId, isLoading, error, retryLoad } = useEditClientProfile();

  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto">
        <div className="h-8 w-48 rounded skeleton mb-2" />
        <div className="h-4 w-32 rounded skeleton mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-white h-14" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
              <div className="px-5 h-full flex items-center">
                <div className="h-4 w-48 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <Button variant="secondary" onClick={retryLoad}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pb-24">
      <EditClientHeader />
      <NewClientShimProvider clientId={clientId}>
        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <EditAccordionSection key={section.key} section={section} />
          ))}
        </div>
      </NewClientShimProvider>
      <EditStickyActionBar />
    </div>
  );
}

export default function EditClientProfile() {
  const { id } = useParams<{ id: string }>();
  usePageTitle("Edit Client Profile");

  if (!id) return null;

  return (
    <EditClientProfileProvider clientId={id}>
      <EditClientProfileContent />
    </EditClientProfileProvider>
  );
}
