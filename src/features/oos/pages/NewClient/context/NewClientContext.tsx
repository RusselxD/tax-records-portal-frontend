import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../lib/api-error";
import { clientAPI, oosClientAPI } from "../../../../../api/client";
import { fileAPI } from "../../../../../api/file";
import type {
  ClientInfoHeaderResponse,
  ClientInfoSections,
  InfoSectionKey,
  AssignedAccountant,
} from "../../../../../types/client-info";
import {
  SECTIONS,
  buildSaveStatus,
  buildSectionRefs,
  deriveGlobalStatus,
  type NewClientContextType,
} from "./new-client-helpers";
import { hydrateSectionUids } from "../../../../../lib/hydrate-sections";
import useNewClientActions from "./useNewClientActions";

export { SECTIONS } from "./new-client-helpers";

type SectionLoadStatus = "idle" | "loading" | "loaded" | "error";

const NewClientContext = createContext<NewClientContextType | null>(null);

interface NewClientProviderProps {
  children: ReactNode;
  editClientId?: string;
}

export function NewClientProvider({
  children,
  editClientId,
}: NewClientProviderProps) {
  const navigate = useNavigate();
  const isEditMode = Boolean(editClientId);
  const [header, setHeader] = useState<ClientInfoHeaderResponse | null>(null);
  const [sections, setSections] = useState<Partial<ClientInfoSections>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(editClientId ?? null);
  const [sectionSaveStatus, setSectionSaveStatus] = useState(buildSaveStatus());
  const [sectionLoadStatus, setSectionLoadStatus] = useState<Record<InfoSectionKey, SectionLoadStatus>>({
    mainDetails: "idle",
    clientInformation: "idle",
    corporateOfficerInformation: "idle",
    accessCredentials: "idle",
    scopeOfEngagement: "idle",
    professionalFees: "idle",
    onboardingDetails: "idle",
  });
  const [expandedSections, setExpandedSections] = useState<Set<InfoSectionKey>>(
    new Set(["mainDetails"]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const clientIdRef = useRef<string | null>(editClientId ?? null);
  const creatingClientRef = useRef<Promise<string> | null>(null);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const sectionRefs = useRef(buildSectionRefs()).current;

  const globalSaveStatus = deriveGlobalStatus(sectionSaveStatus);

  const {
    updateSection,
    submitForReview,
    discardDraft,
    retrySection,
    uploadFile,
    clearTimers,
  } = useNewClientActions({
    clientIdRef,
    sectionsRef,
    creatingClientRef,
    isEditMode,
    setClientId,
    setSections,
    setSectionSaveStatus,
    setIsSubmitting,
    setIsDiscarding,
  });

  // Track loading status synchronously to prevent duplicate fetches
  const loadingRef = useRef<Set<InfoSectionKey>>(new Set());

  // Lazy-load a single section in edit mode
  const loadSection = useCallback(
    async (sectionKey: InfoSectionKey) => {
      if (!editClientId) return;
      if (loadingRef.current.has(sectionKey)) return;
      loadingRef.current.add(sectionKey);

      setSectionLoadStatus((prev) => {
        if (prev[sectionKey] === "loaded") return prev;
        return { ...prev, [sectionKey]: "loading" };
      });

      try {
        const raw = await clientAPI.getClientInfoSection(editClientId, sectionKey);
        const data = hydrateSectionUids(sectionKey, raw);
        setSections((prev) => ({ ...prev, [sectionKey]: data }));
        setSectionLoadStatus((prev) => ({ ...prev, [sectionKey]: "loaded" }));
      } catch {
        loadingRef.current.delete(sectionKey);
        setSectionLoadStatus((prev) => ({ ...prev, [sectionKey]: "error" }));
      }
    },
    [editClientId],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        if (editClientId) {
          // Edit mode: fetch header only, sections load lazily
          const headerData = await clientAPI.getClientInfoHeader(editClientId);
          if (cancelled) return;

          if (headerData.hasActiveTask) {
            navigate(`/oos/client-preview/${editClientId}`, { replace: true });
            return;
          }

          setHeader(headerData);
          clientIdRef.current = editClientId;
        } else {
          // New mode: template returns everything at once
          const data = await oosClientAPI.getClientInfoTemplate();
          if (cancelled) return;

          setHeader(data);
          setSections({
            mainDetails: hydrateSectionUids("mainDetails", data.mainDetails),
            clientInformation: hydrateSectionUids("clientInformation", data.clientInformation),
            corporateOfficerInformation: hydrateSectionUids("corporateOfficerInformation", data.corporateOfficerInformation),
            accessCredentials: hydrateSectionUids("accessCredentials", data.accessCredentials),
            scopeOfEngagement: hydrateSectionUids("scopeOfEngagement", data.scopeOfEngagement),
            professionalFees: hydrateSectionUids("professionalFees", data.professionalFees),
            onboardingDetails: hydrateSectionUids("onboardingDetails", data.onboardingDetails),
          });
          setSectionLoadStatus({
            mainDetails: "loaded",
            clientInformation: "loaded",
            corporateOfficerInformation: "loaded",
            accessCredentials: "loaded",
            scopeOfEngagement: "loaded",
            professionalFees: "loaded",
            onboardingDetails: "loaded",
          });
        }
      } catch (err) {
        if (cancelled) return;
        setFetchError(getErrorMessage(err, "Failed to load client data. Please refresh the page."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();

    return () => { cancelled = true; };
  }, [editClientId]);

  // Populate accountant IDs into mainDetails once both header and section are loaded
  useEffect(() => {
    if (!header || sectionLoadStatus.mainDetails !== "loaded") return;
    setSections((prev) => {
      if (!prev.mainDetails) return prev;
      const md = { ...prev.mainDetails };
      let changed = false;
      if (header.assignedCsdOosAccountants?.length && !md.csdOosAccountantIds?.length) {
        md.csdOosAccountantIds = header.assignedCsdOosAccountants.map((a) => a.id);
        changed = true;
      }
      if (header.assignedQtdAccountants?.length && !md.qtdAccountantId) {
        md.qtdAccountantId = header.assignedQtdAccountants[0]?.id ?? null;
        changed = true;
      }
      return changed ? { ...prev, mainDetails: md } : prev;
    });
  }, [header, sectionLoadStatus.mainDetails]);

  useEffect(() => clearTimers, [clearTimers]);

  const toggleSection = useCallback((sectionKey: InfoSectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  }, []);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scrollToSection = useCallback(
    (sectionKey: InfoSectionKey) => {
      setExpandedSections((prev) => new Set([...prev, sectionKey]));
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const element = sectionRefs[sectionKey]?.current;
        if (element) {
          const top =
            element.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 50);
    },
    [sectionRefs],
  );

  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  const updateHeaderAccountants = useCallback(
    (fields: Parameters<NewClientContextType["updateHeaderAccountants"]>[0]) => {
      setHeader((prev) => (prev ? { ...prev, ...fields } : prev));
    },
    [],
  );

  const value = useMemo(() => ({
    header,
    sections,
    isLoading,
    fetchError,
    clientId,
    isEditMode,
    sectionSaveStatus,
    globalSaveStatus,
    expandedSections,
    sectionRefs,
    sectionLoadStatus,
    loadSection,
    updateSection,
    toggleSection,
    scrollToSection,
    submitForReview,
    discardDraft,
    retrySection,
    uploadFile,
    updateHeaderAccountants,
    isSubmitting,
    isDiscarding,
  }), [
    header, sections, isLoading, fetchError, clientId, isEditMode,
    sectionSaveStatus, globalSaveStatus, expandedSections, sectionRefs,
    sectionLoadStatus, loadSection, updateSection, toggleSection,
    scrollToSection, submitForReview, discardDraft, retrySection,
    uploadFile, updateHeaderAccountants, isSubmitting, isDiscarding,
  ]);

  return (
    <NewClientContext.Provider value={value}>
      {children}
    </NewClientContext.Provider>
  );
}

export function useNewClient() {
  const context = useContext(NewClientContext);
  if (!context) {
    throw new Error("useNewClient must be used within a NewClientProvider");
  }
  return context;
}

/**
 * Minimal shim for pages that reuse section form components outside of NewClientProvider.
 * Only uploadFile and updateHeaderAccountants are functional — everything else is a no-op stub.
 */
export function NewClientShimProvider({
  clientId,
  onUpdateHeaderAccountants,
  children,
}: {
  clientId: string;
  onUpdateHeaderAccountants?: (fields: {
    assignedCsdOosAccountants?: AssignedAccountant[];
    assignedQtdAccountants?: AssignedAccountant[];
  }) => void;
  children: ReactNode;
}) {
  const uploadFile = useCallback(
    (file: File) => fileAPI.upload(clientId, file),
    [clientId],
  );

  const updateHeaderAccountants = useCallback(
    (fields: { assignedCsdOosAccountants?: AssignedAccountant[]; assignedQtdAccountants?: AssignedAccountant[] }) => {
      onUpdateHeaderAccountants?.(fields);
    },
    [onUpdateHeaderAccountants],
  );

  const value = useMemo(() => ({
    header: null,
    sections: {},
    isLoading: false,
    fetchError: null,
    clientId,
    isEditMode: true,
    sectionSaveStatus: buildSaveStatus(),
    globalSaveStatus: "idle" as const,
    expandedSections: new Set<InfoSectionKey>(),
    sectionRefs: buildSectionRefs(),
    sectionLoadStatus: Object.fromEntries(
      SECTIONS.map((s) => [s.key, "loaded" as const]),
    ) as Record<InfoSectionKey, "idle" | "loading" | "loaded" | "error">,
    loadSection: () => {},
    updateSection: () => {},
    toggleSection: () => {},
    scrollToSection: () => {},
    submitForReview: async () => {},
    discardDraft: async () => {},
    retrySection: () => {},
    uploadFile,
    updateHeaderAccountants,
    isSubmitting: false,
    isDiscarding: false,
  }), [clientId, uploadFile, updateHeaderAccountants]);

  return (
    <NewClientContext.Provider value={value}>
      {children}
    </NewClientContext.Provider>
  );
}
