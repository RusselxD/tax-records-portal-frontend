import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { oosClientAPI } from "../../../../../api/client";
import { fileAPI } from "../../../../../api/file";
import { useToast } from "../../../../../contexts/ToastContext";
import { isConflictError, getErrorMessage } from "../../../../../lib/api-error";
import type {
  ClientInfoSections,
  InfoSectionKey,
  RichTextContent,
} from "../../../../../types/client-info";
import type { SaveStatus } from "../../../../../types/client";
import { DEBOUNCE_MS } from "./new-client-helpers";

export interface UseNewClientActionsParams {
  clientIdRef: React.MutableRefObject<string | null>;
  sectionsRef: React.MutableRefObject<Partial<ClientInfoSections>>;
  creatingClientRef: React.MutableRefObject<Promise<string> | null>;
  isEditMode: boolean;
  setClientId: (id: string | null) => void;
  setSections: React.Dispatch<
    React.SetStateAction<Partial<ClientInfoSections>>
  >;
  setSectionSaveStatus: React.Dispatch<
    React.SetStateAction<Record<InfoSectionKey, SaveStatus>>
  >;
  setIsSubmitting: (v: boolean) => void;
  setIsDiscarding: (v: boolean) => void;
}

export default function useNewClientActions({
  clientIdRef,
  sectionsRef,
  creatingClientRef,
  isEditMode,
  setClientId,
  setSections,
  setSectionSaveStatus,
  setIsSubmitting,
  setIsDiscarding,
}: UseNewClientActionsParams) {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const ensureClientId = useCallback(async (): Promise<string> => {
    if (clientIdRef.current) return clientIdRef.current;
    if (creatingClientRef.current) return creatingClientRef.current;

    const promise = (async () => {
      try {
        const res = await oosClientAPI.createClient();
        clientIdRef.current = res.id;
        setClientId(res.id);
        return res.id;
      } catch (err) {
        // Clear so next attempt can retry instead of reusing a rejected promise
        creatingClientRef.current = null;
        throw err;
      }
    })();

    creatingClientRef.current = promise;
    return promise;
  }, [clientIdRef, creatingClientRef, setClientId]);

  const saveSection = useCallback(
    async (sectionKey: InfoSectionKey) => {
      const sectionData = sectionsRef.current[sectionKey];
      if (!sectionData) return; // Don't save if section hasn't been loaded

      setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "saving" }));
      try {
        const id = await ensureClientId();
        await oosClientAPI.updateSection(id, sectionKey, sectionData);
        setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "saved" }));
        const resetTimer = setTimeout(() => {
          setSectionSaveStatus((prev) =>
            prev[sectionKey] === "saved"
              ? { ...prev, [sectionKey]: "idle" }
              : prev,
          );
        }, 3000);
        debounceTimers.current[`${sectionKey}_reset`] = resetTimer;
      } catch (err) {
        setSectionSaveStatus((prev) => ({
          ...prev,
          [sectionKey]: "error",
        }));
        if (isConflictError(err)) {
          toastError("Conflict", getErrorMessage(err));
        }
      }
    },
    [ensureClientId, sectionsRef, setSectionSaveStatus],
  );

  const debounceSave = useCallback(
    (sectionKey: InfoSectionKey) => {
      if (debounceTimers.current[sectionKey]) {
        clearTimeout(debounceTimers.current[sectionKey]);
      }
      debounceTimers.current[sectionKey] = setTimeout(() => {
        saveSection(sectionKey);
      }, DEBOUNCE_MS);
    },
    [saveSection],
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
      debounceSave(key);
    },
    [setSections, debounceSave],
  );

  const submitForReview = useCallback(
    async (comment?: RichTextContent | null) => {
      if (!clientIdRef.current) return;
      setIsSubmitting(true);
      try {
        await oosClientAPI.submitForReview(clientIdRef.current, comment);
        toastSuccess(
          "Submitted for review",
          "The client has been submitted for review.",
        );
        navigate("/oos/client-onboarding");
      } finally {
        setIsSubmitting(false);
      }
    },
    [clientIdRef, navigate, setIsSubmitting, toastSuccess],
  );

  const discardDraft = useCallback(async () => {
    if (clientIdRef.current) {
      setIsDiscarding(true);
      try {
        await oosClientAPI.deleteClient(clientIdRef.current);
        toastSuccess(
          isEditMode ? "Client deleted" : "Draft discarded",
          isEditMode
            ? "The client has been permanently deleted."
            : "The draft has been discarded.",
        );
        navigate("/oos/client-onboarding");
      } catch (err) {
        toastError(
          isEditMode ? "Failed to delete client" : "Failed to discard draft",
          getErrorMessage(err, "Something went wrong. Please try again."),
        );
      } finally {
        setIsDiscarding(false);
      }
    } else {
      navigate("/oos/client-onboarding");
    }
  }, [
    clientIdRef,
    navigate,
    isEditMode,
    setIsDiscarding,
    toastSuccess,
    toastError,
  ]);

  const retrySection = useCallback(
    (sectionKey: InfoSectionKey) => saveSection(sectionKey),
    [saveSection],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const id = await ensureClientId();
      return fileAPI.upload(id, file);
    },
    [ensureClientId],
  );

  const clearTimers = useCallback(() => {
    Object.values(debounceTimers.current).forEach(clearTimeout);
  }, []);

  return {
    updateSection,
    submitForReview,
    discardDraft,
    retrySection,
    uploadFile,
    clearTimers,
  };
}
