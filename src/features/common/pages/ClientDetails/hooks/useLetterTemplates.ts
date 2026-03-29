import { useState, useEffect, useCallback } from "react";
import { clientAPI } from "../../../../../api/client";
import { getErrorMessage, isConflictError } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";
import type { EndOfEngagementLetterTemplateSummary, EndOfEngagementLetterTemplate } from "../../../../../types/client";
import type { RichTextContent } from "../../../../../types/client-info";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

type View = "list" | "preview" | "create" | "edit";

export function useLetterTemplates() {
  const { toastSuccess, toastError } = useToast();

  const [view, setView] = useState<View>("list");
  const [templates, setTemplates] = useState<EndOfEngagementLetterTemplateSummary[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EndOfEngagementLetterTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Editor state (create/edit)
  const [editName, setEditName] = useState("");
  const [editBody, setEditBody] = useState<RichTextContent>(EMPTY_DOC);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await clientAPI.getEndOfEngagementLetterTemplates();
      setTemplates(data);
    } catch {
      // silently fail
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSelectTemplate = useCallback(async (id: string) => {
    setIsLoadingTemplate(true);
    try {
      const data = await clientAPI.getEndOfEngagementLetterTemplate(id);
      setSelectedTemplate(data);
      setView("preview");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to load template."));
    } finally {
      setIsLoadingTemplate(false);
    }
  }, [toastError]);

  const handleSend = useCallback(async (clientId: string, onSuccess: () => void, closeModal: () => void) => {
    if (!selectedTemplate) return;
    setIsSending(true);
    try {
      await clientAPI.sendEndOfEngagementLetter(clientId, selectedTemplate.id);
      toastSuccess("Letter Sent", "The end-of-engagement letter has been emailed to the client.");
      onSuccess();
      closeModal();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to send letter."));
    } finally {
      setIsSending(false);
    }
  }, [selectedTemplate, toastSuccess, toastError]);

  const handleDelete = useCallback(async (id: string) => {
    const prev = templates;
    setTemplates((t) => t.filter((item) => item.id !== id));
    setIsDeleting(id);
    try {
      await clientAPI.deleteEndOfEngagementLetterTemplate(id);
    } catch (err) {
      setTemplates(prev);
      toastError(getErrorMessage(err, "Failed to delete template."));
    } finally {
      setIsDeleting(null);
    }
  }, [templates, toastError]);

  const handleStartCreate = useCallback(() => {
    setEditId(null);
    setEditName("");
    setEditBody(EMPTY_DOC);
    setEditError(null);
    setView("create");
  }, []);

  const handleStartEdit = useCallback(async (id: string) => {
    setIsLoadingTemplate(true);
    try {
      const data = await clientAPI.getEndOfEngagementLetterTemplate(id);
      setEditId(data.id);
      setEditName(data.name);
      setEditBody(data.body);
      setEditError(null);
      setView("edit");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to load template."));
    } finally {
      setIsLoadingTemplate(false);
    }
  }, [toastError]);

  const handleSaveTemplate = useCallback(async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    setEditError(null);
    try {
      if (editId) {
        await clientAPI.updateEndOfEngagementLetterTemplate(editId, { name: editName.trim(), body: editBody });
      } else {
        await clientAPI.createEndOfEngagementLetterTemplate({ name: editName.trim(), body: editBody });
      }
      await fetchTemplates();
      setView("list");
    } catch (err) {
      if (isConflictError(err)) {
        setEditError("A template with this name already exists.");
      } else {
        setEditError(getErrorMessage(err, "Failed to save template."));
      }
    } finally {
      setIsSaving(false);
    }
  }, [editId, editName, editBody, fetchTemplates]);

  const handleBack = useCallback(() => {
    setSelectedTemplate(null);
    setView("list");
  }, []);

  return {
    // View state
    view,
    isEditorView: view === "create" || view === "edit",

    // Template list
    templates,
    isLoadingList,
    isLoadingTemplate,
    isDeleting,

    // Selected template (preview)
    selectedTemplate,
    isSending,

    // Editor state
    editId,
    editName,
    setEditName,
    editBody,
    setEditBody,
    editError,
    setEditError,
    isSaving,

    // Actions
    handleSelectTemplate,
    handleSend,
    handleDelete,
    handleStartCreate,
    handleStartEdit,
    handleSaveTemplate,
    handleBack,
  };
}
