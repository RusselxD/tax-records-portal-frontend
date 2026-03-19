import type {
  InfoSectionKey,
  InfoSectionMeta,
  ClientInfoSections,
  ClientInfoHeaderResponse,
  AssignedAccountant,
} from "../../../../../types/client-info";
import type { SaveStatus } from "../../../../../types/client";

export const SECTIONS: InfoSectionMeta[] = [
  { key: "mainDetails", label: "Main Details" },
  { key: "clientInformation", label: "Client Information" },
  { key: "corporateOfficerInformation", label: "Corporate Officers & Point of Contact" },
  { key: "accessCredentials", label: "Access & Credentials" },
  { key: "scopeOfEngagement", label: "Scope of Engagement" },
  { key: "professionalFees", label: "Professional Fees" },
  { key: "onboardingDetails", label: "Onboarding Details" },
];

export const DEBOUNCE_MS = 800;

export function buildSaveStatus(): Record<InfoSectionKey, SaveStatus> {
  return Object.fromEntries(
    SECTIONS.map((s) => [s.key, "idle" as const]),
  ) as Record<InfoSectionKey, SaveStatus>;
}

export function deriveGlobalStatus(
  statuses: Record<InfoSectionKey, SaveStatus>,
): SaveStatus {
  const values = Object.values(statuses);
  if (values.some((s) => s === "error")) return "error";
  if (values.some((s) => s === "saving")) return "saving";
  if (values.some((s) => s === "saved")) return "saved";
  return "idle";
}

export function buildSectionRefs() {
  return Object.fromEntries(
    SECTIONS.map((s) => [s.key, { current: null }]),
  ) as Record<InfoSectionKey, React.RefObject<HTMLDivElement | null>>;
}

export interface NewClientContextType {
  header: ClientInfoHeaderResponse | null;
  sections: Partial<ClientInfoSections>;
  isLoading: boolean;
  fetchError: string | null;
  clientId: string | null;
  isEditMode: boolean;
  sectionSaveStatus: Record<InfoSectionKey, SaveStatus>;
  globalSaveStatus: SaveStatus;
  expandedSections: Set<InfoSectionKey>;
  sectionRefs: Record<InfoSectionKey, React.RefObject<HTMLDivElement | null>>;
  sectionLoadStatus: Record<InfoSectionKey, "idle" | "loading" | "loaded" | "error">;
  loadSection: (key: InfoSectionKey) => void;
  updateSection: <K extends InfoSectionKey>(
    key: K,
    data: ClientInfoSections[K] | ((prev: ClientInfoSections[K]) => ClientInfoSections[K]),
  ) => void;
  toggleSection: (key: InfoSectionKey) => void;
  scrollToSection: (key: InfoSectionKey) => void;
  submitForReview: (comment?: string) => Promise<void>;
  discardDraft: () => Promise<void>;
  retrySection: (key: InfoSectionKey) => void;
  uploadFile: (file: File) => Promise<{ id: string; name: string }>;
  updateHeaderAccountants: (fields: {
    assignedCsdOosAccountants?: AssignedAccountant[];
    assignedQtdAccountants?: AssignedAccountant[];
  }) => void;
  isSubmitting: boolean;
  isDiscarding: boolean;
}
