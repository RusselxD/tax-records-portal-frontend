import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getErrorMessage, isNotFoundError } from "../../../../../lib/api-error";
import { clientAPI } from "../../../../../api/client";
import type {
  ClientInfoHeaderResponse,
  ClientInfoSections,
  InfoSectionKey,
  ClientStatusType,
} from "../../../../../types/client-info";
import { CLIENT_STATUS } from "../../../../../types/client";
import type { ArchiveSnapshotResponse, ClientAccountResponse } from "../../../../../types/client";
import useLazySections from "../../../components/client-info/hooks/useLazySections";

type ViewMode = "live" | "snapshot";
type SectionStatus = "idle" | "loading" | "loaded" | "error";

interface ClientDetailsContextType {
  clientId: string;
  mode: ViewMode;
  header: ClientInfoHeaderResponse | null;
  clientName: string;
  status: ClientStatusType | null;
  snapshotDate: string | null;
  clientAccounts: ClientAccountResponse[];
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
  setStatus: (status: ClientStatusType) => void;
  getSection: <K extends InfoSectionKey>(key: K) => {
    data: ClientInfoSections[K] | null;
    status: SectionStatus;
  };
  fetchSection: (key: InfoSectionKey) => void;
}

// For snapshot mode: pre-populate all sections from the snapshot response
function snapshotToSections(snapshot: ArchiveSnapshotResponse): Record<InfoSectionKey, { data: unknown; status: SectionStatus }> {
  return {
    mainDetails: { data: snapshot.mainDetails, status: "loaded" },
    clientInformation: { data: snapshot.clientInformation, status: "loaded" },
    corporateOfficerInformation: { data: snapshot.corporateOfficerInformation, status: "loaded" },
    accessCredentials: { data: snapshot.accessCredentials, status: "loaded" },
    scopeOfEngagement: { data: snapshot.scopeOfEngagement, status: "loaded" },
    professionalFees: { data: snapshot.professionalFees, status: "loaded" },
    onboardingDetails: { data: snapshot.onboardingDetails, status: "loaded" },
  };
}

function snapshotToHeader(snapshot: ArchiveSnapshotResponse): ClientInfoHeaderResponse {
  return {
    displayName: snapshot.clientDisplayName,
    taxpayerClassification: snapshot.taxpayerClassification,
    status: CLIENT_STATUS.ACTIVE_CLIENT,
    pocEmail: null,
    isProfileApproved: true,
    handedOff: true,
    creatorId: null,
    accountants: {
      csdOos: snapshot.assignedCsdOosAccountants,
      qtd: snapshot.assignedQtdAccountants,
    },
    taskReview: {
      hasActiveTask: false,
      activeTaskId: null,
      activeTaskType: null,
      lastReviewStatus: null,
    },
    offboarding: {
      accountantName: null,
      endOfEngagementDate: null,
      deactivationDate: null,
      taxRecordsProtected: false,
      endOfEngagementLetterSent: false,
    },
  };
}

const ClientDetailsContext =
  createContext<ClientDetailsContextType | null>(null);

export function ClientDetailsProvider({
  clientId,
  mode = "live",
  children,
}: {
  clientId: string;
  mode?: ViewMode;
  children: ReactNode;
}) {
  const [header, setHeader] = useState<ClientInfoHeaderResponse | null>(null);
  const [statusOverride, setStatusOverride] = useState<ClientStatusType | null>(null);
  const [clientAccounts, setClientAccounts] = useState<ClientAccountResponse[]>([]);
  const [snapshotDate, setSnapshotDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // For snapshot mode, we pre-load all sections from the snapshot
  const [snapshotSections, setSnapshotSections] = useState<Record<InfoSectionKey, { data: unknown; status: SectionStatus }> | null>(null);

  // For live mode, lazy section loading
  const lazy = useLazySections(mode === "live" ? clientId : null);

  const [version, setVersion] = useState(0);
  const refetchData = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    const fetchData = async () => {
      try {
        if (mode === "snapshot") {
          const snapshot = await clientAPI.getArchiveSnapshot(clientId);
          if (cancelled) return;
          setHeader(snapshotToHeader(snapshot));
          setSnapshotSections(snapshotToSections(snapshot));
          setSnapshotDate(snapshot.submittedAt);
        } else {
          const [data, accounts] = await Promise.all([
            clientAPI.getClientInfoHeader(clientId),
            clientAPI.getClientAccounts(clientId).catch(() => []),
          ]);
          if (cancelled) return;
          setHeader(data);
          setClientAccounts(accounts);
        }
      } catch (err) {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          setNotFound(true);
        } else {
          setError(
            getErrorMessage(
              err,
              mode === "snapshot"
                ? "Failed to load snapshot. Try again."
                : "Failed to load client details. Try again.",
            ),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();

    return () => { cancelled = true; };
  }, [clientId, mode, version]);

  const clientName = header?.displayName ?? "";
  const status = statusOverride ?? header?.status ?? null;

  const setStatus = useCallback((newStatus: ClientStatusType) => {
    setStatusOverride(newStatus);
  }, []);

  // Unified getSection/fetchSection that delegates to snapshot or lazy
  const getSection = useCallback(
    <K extends InfoSectionKey>(key: K) => {
      if (snapshotSections) {
        const s = snapshotSections[key];
        return { data: s.data as ClientInfoSections[K], status: s.status };
      }
      return lazy.getSection(key);
    },
    [snapshotSections, lazy],
  );

  const fetchSection = useCallback(
    (key: InfoSectionKey) => {
      // Snapshot sections are already loaded — no-op
      if (snapshotSections) return;
      lazy.fetchSection(key);
    },
    [snapshotSections, lazy],
  );

  const value = useMemo(
    () => ({
      clientId,
      mode,
      header,
      clientName,
      status,
      clientAccounts,
      snapshotDate,
      isLoading,
      error,
      notFound,
      refetch: refetchData,
      setStatus,
      getSection,
      fetchSection,
    }),
    [clientId, mode, header, clientName, status, clientAccounts, snapshotDate, isLoading, error, notFound, refetchData, setStatus, getSection, fetchSection],
  );

  return (
    <ClientDetailsContext.Provider value={value}>
      {children}
    </ClientDetailsContext.Provider>
  );
}

export function useClientDetails() {
  const context = useContext(ClientDetailsContext);
  if (!context) {
    throw new Error(
      "useClientDetails must be used within a ClientDetailsProvider",
    );
  }
  return context;
}
