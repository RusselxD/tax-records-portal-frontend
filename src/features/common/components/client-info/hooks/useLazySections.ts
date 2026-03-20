import { useState, useCallback, useRef } from "react";
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

export type SectionFetcher = <K extends InfoSectionKey>(key: K) => Promise<ClientInfoSections[K]>;

export default function useLazySections(
  clientId: string | null,
  customFetcher?: SectionFetcher,
) {
  const [sections, setSections] = useState<SectionsMap>({ ...INITIAL_STATE });
  const inFlight = useRef<Set<InfoSectionKey>>(new Set());

  const fetchSection = useCallback(
    async <K extends InfoSectionKey>(key: K) => {
      if (!customFetcher && !clientId) return;
      if (inFlight.current.has(key)) return; // deduplicate in-flight requests
      inFlight.current.add(key);

      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "loading" },
      }));

      try {
        const data = customFetcher
          ? await customFetcher(key)
          : await clientAPI.getClientInfoSection(clientId!, key);
        setSections((prev) => ({
          ...prev,
          [key]: { data, status: "loaded" },
        }));
      } catch {
        setSections((prev) => ({
          ...prev,
          [key]: { ...prev[key], status: "error" },
        }));
      } finally {
        inFlight.current.delete(key);
      }
    },
    [clientId, customFetcher],
  );

  const getSection = useCallback(
    <K extends InfoSectionKey>(key: K): SectionState<K> => {
      return sections[key] as SectionState<K>;
    },
    [sections],
  );

  const resetSections = useCallback(() => {
    setSections({ ...INITIAL_STATE });
    inFlight.current.clear();
  }, []);

  return { sections, fetchSection, getSection, resetSections };
}
