import { useParams } from "react-router-dom";
import usePageTitle from "../../../../hooks/usePageTitle";
import { Button } from "../../../../components/common";
import { NewClientProvider, useNewClient, SECTIONS } from "./context/NewClientContext";
import NewClientHeader from "./components/NewClientHeader";
import AccordionSection from "./components/AccordionSection";
import StickyActionBar from "./components/StickyActionBar";

function NewClientContent() {
  const { isLoading, fetchError } = useNewClient();

  if (isLoading) {
    return (
      <div className="max-w-[1100px] mx-auto">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-4 w-32 rounded skeleton mb-2" />
          <div className="h-7 w-56 rounded skeleton" />
        </div>
        {/* Accordion section skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white custom-shadow h-14 flex items-center px-5"
            >
              <div className="h-4 w-48 rounded skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-status-rejected mb-3">{fetchError}</p>
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto pb-24">
      <NewClientHeader />
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <AccordionSection key={section.key} section={section} />
        ))}
      </div>
      <StickyActionBar />
    </div>
  );
}

export default function NewClient() {
  const { id } = useParams<{ id: string }>();
  usePageTitle(id ? "Edit Client" : "New Client");

  return (
    <NewClientProvider editClientId={id}>
      <NewClientContent />
    </NewClientProvider>
  );
}
