import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../lib/api-error";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import {
  SECTIONS,
  SECTION_KEYS,
  type ClientInfoHeaderResponse,
  type ClientInfoSections,
  type InfoSectionKey,
} from "../../../../../types/client-info";
import { hydrateSectionUids } from "../../../../../lib/hydrate-sections";

export { SECTIONS };

type SectionLoadStatus = "idle" | "loading" | "loaded" | "error";

function buildSectionRefs() {
  return Object.fromEntries(
    SECTIONS.map((s) => [s.key, { current: null }]),
  ) as Record<InfoSectionKey, React.RefObject<HTMLDivElement | null>>;
}

interface EditClientProfileContextType {
  clientId: string;
  header: ClientInfoHeaderResponse | null;
  sections: Partial<ClientInfoSections>;
  sectionLoadStatus: Record<InfoSectionKey, SectionLoadStatus>;
  isLoading: boolean;
  error: string | null;
  retryLoad: () => void;
  loadSection: (key: InfoSectionKey) => void;
  expandedSections: Set<InfoSectionKey>;
  sectionRefs: Record<InfoSectionKey, React.RefObject<HTMLDivElement | null>>;
  updateSection: <K extends InfoSectionKey>(
    key: K,
    data: ClientInfoSections[K] | ((prev: ClientInfoSections[K]) => ClientInfoSections[K]),
  ) => void;
  toggleSection: (key: InfoSectionKey) => void;
  scrollToSection: (key: InfoSectionKey) => void;
  submitUpdate: (comment?: string) => Promise<void>;
  isSubmitting: boolean;
}

const EditClientProfileContext = createContext<EditClientProfileContextType | null>(null);

export function EditClientProfileProvider({
  clientId,
  children,
}: {
  clientId: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [header, setHeader] = useState<ClientInfoHeaderResponse | null>(null);
  const [sections, setSections] = useState<Partial<ClientInfoSections>>({});
  const [sectionLoadStatus, setSectionLoadStatus] = useState<Record<InfoSectionKey, SectionLoadStatus>>(
    Object.fromEntries(SECTION_KEYS.map((k) => [k, "idle"])) as Record<InfoSectionKey, SectionLoadStatus>,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<InfoSectionKey>>(
    new Set(["mainDetails"]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRefs = useRef(buildSectionRefs()).current;
  const loadingRef = useRef<Set<InfoSectionKey>>(new Set());

  const retryLoad = useCallback(() => setVersion((v) => v + 1), []);

  // Fetch header only on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setSections({});
    setSectionLoadStatus(
      Object.fromEntries(SECTION_KEYS.map((k) => [k, "idle"])) as Record<InfoSectionKey, SectionLoadStatus>,
    );
    loadingRef.current.clear();

    async function fetch() {
      try {
        const hdr = await clientAPI.getClientInfoHeader(clientId);
        if (!cancelled) setHeader(hdr);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load client data."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [clientId, version]);

  // Lazy-load a single section on demand
  const loadSection = useCallback(
    async (key: InfoSectionKey) => {
      if (loadingRef.current.has(key)) return;
      loadingRef.current.add(key);

      setSectionLoadStatus((prev) => {
        if (prev[key] === "loaded") return prev;
        return { ...prev, [key]: "loading" };
      });

      try {
        const raw = await clientAPI.getClientInfoSection(clientId, key);
        const data = hydrateSectionUids(key, raw);
        setSections((prev) => ({ ...prev, [key]: data }));
        setSectionLoadStatus((prev) => ({ ...prev, [key]: "loaded" }));
      } catch (err) {
        loadingRef.current.delete(key);
        setSectionLoadStatus((prev) => ({ ...prev, [key]: "error" }));
        console.error(`Failed to load section "${key}":`, err);
      }
    },
    [clientId],
  );

  const updateSection = useCallback(
    <K extends InfoSectionKey>(
      key: K,
      data: ClientInfoSections[K] | ((prev: ClientInfoSections[K]) => ClientInfoSections[K]),
    ) => {
      setSections((prev) => {
        const current = prev[key];
        if (!current) return prev;
        const next = typeof data === "function" ? data(current) : data;
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  const toggleSection = useCallback((key: InfoSectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scrollToSection = useCallback(
    (key: InfoSectionKey) => {
      setExpandedSections((prev) => new Set([...prev, key]));
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const el = sectionRefs[key]?.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 50);
    },
    [sectionRefs],
  );

  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  const submitUpdate = useCallback(
    async (comment?: string) => {
      setIsSubmitting(true);
      try {
        // Start with whatever is already loaded in state
        const merged: Partial<ClientInfoSections> = { ...sectionsRef.current };

        // Fetch any sections the user never opened
        const unloaded = SECTION_KEYS.filter((k) => !merged[k]);
        if (unloaded.length > 0) {
          const fetched = await Promise.all(
            unloaded.map(async (k) => [k, await clientAPI.getClientInfoSection(clientId, k)] as const),
          );
          fetched.forEach(([k, data]) => {
            (merged as Record<string, unknown>)[k] = data;
            setSections((prev) => ({ ...prev, [k]: data }));
            setSectionLoadStatus((prev) => ({ ...prev, [k]: "loaded" as const }));
            loadingRef.current.add(k);
          });
        }

        await clientAPI.submitProfileUpdate(clientId, {
          comment: comment || null,
          mainDetails: merged.mainDetails!,
          clientInformation: merged.clientInformation!,
          corporateOfficerInformation: merged.corporateOfficerInformation!,
          accessCredentials: merged.accessCredentials!,
          scopeOfEngagement: merged.scopeOfEngagement!,
          professionalFees: merged.professionalFees!,
          onboardingDetails: merged.onboardingDetails!,
        });
        toastSuccess("Submitted for review", "The profile update has been submitted for review.");
        const prefix = getRolePrefix(user?.roleKey ?? "");
        navigate(`/${prefix}/client-details/${clientId}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [clientId, user, navigate, toastSuccess],
  );

  const value = useMemo(
    () => ({
      clientId,
      header,
      sections,
      sectionLoadStatus,
      isLoading,
      error,
      retryLoad,
      loadSection,
      expandedSections,
      sectionRefs,
      updateSection,
      toggleSection,
      scrollToSection,
      submitUpdate,
      isSubmitting,
    }),
    [
      clientId, header, sections, sectionLoadStatus, isLoading, error, retryLoad,
      loadSection, expandedSections, sectionRefs, updateSection, toggleSection,
      scrollToSection, submitUpdate, isSubmitting,
    ],
  );

  return (
    <EditClientProfileContext.Provider value={value}>
      {children}
    </EditClientProfileContext.Provider>
  );
}

export function useEditClientProfile() {
  const ctx = useContext(EditClientProfileContext);
  if (!ctx) throw new Error("useEditClientProfile must be used within EditClientProfileProvider");
  return ctx;
}
