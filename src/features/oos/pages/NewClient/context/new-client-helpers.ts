import {
  SECTIONS,
  type InfoSectionKey,
  type ClientInfoSections,
  type ClientInfoHeaderResponse,
  type AssignedAccountant,
  type RichTextContent,
} from "../../../../../types/client-info";
import type { SaveStatus } from "../../../../../types/client";

export { SECTIONS };

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
  submitForReview: (comment?: RichTextContent | null) => Promise<void>;
  discardDraft: () => Promise<void>;
  retrySection: (key: InfoSectionKey) => void;
  uploadFile: (file: File) => Promise<{ id: string; name: string }>;
  updateHeaderAccountants: (fields: {
    csdOos?: AssignedAccountant[];
    qtd?: AssignedAccountant[];
  }) => void;
  isSubmitting: boolean;
  isDiscarding: boolean;
  isMreCodeValid: boolean;
  setMreCodeValid: (valid: boolean) => void;
}
