import { useState, useCallback } from "react";
import { clientAPI } from "../../../../../api/client";
import type {
  InfoSectionKey,
  ClientInfoSections,
} from "../../../../../types/client-info";

type SectionStatus = "idle" | "loading" | "loaded" | "error";

interface SectionState<K extends InfoSectionKey> {
  data: ClientInfoSections[K] | null;
  status: SectionStatus;
}

type SectionsMap = {
  [K in InfoSectionKey]: SectionState<K>;
};

const INITIAL_STATE: SectionsMap = {
  mainDetails: { data: null, status: "idle" },
  clientInformation: { data: null, status: "idle" },
  corporateOfficerInformation: { data: null, status: "idle" },
  accessCredentials: { data: null, status: "idle" },
  scopeOfEngagement: { data: null, status: "idle" },
  professionalFees: { data: null, status: "idle" },
  onboardingDetails: { data: null, status: "idle" },
};

export default function useLazySections(clientId: string | null) {
  const [sections, setSections] = useState<SectionsMap>({ ...INITIAL_STATE });

  const fetchSection = useCallback(
    async <K extends InfoSectionKey>(key: K) => {
      if (!clientId) return;

      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "loading" },
      }));

      try {
        const data = await clientAPI.getClientInfoSection(clientId, key);
        setSections((prev) => ({
          ...prev,
          [key]: { data, status: "loaded" },
        }));
      } catch {
        setSections((prev) => ({
          ...prev,
          [key]: { ...prev[key], status: "error" },
        }));
      }
    },
    [clientId],
  );

  const getSection = useCallback(
    <K extends InfoSectionKey>(key: K): SectionState<K> => {
      return sections[key] as SectionState<K>;
    },
    [sections],
  );

  const resetSections = useCallback(() => {
    setSections({ ...INITIAL_STATE });
  }, []);

  return { sections, fetchSection, getSection, resetSections };
}
