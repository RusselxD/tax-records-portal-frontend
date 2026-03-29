import { Plus, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { Modal, Button, Input, CommentEditor, CommentPreview } from "../../../../../components/common";
import { useLetterTemplates } from "../hooks/useLetterTemplates";
import type { Dispatch, SetStateAction } from "react";

interface SendEngagementLetterModalProps {
  clientId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function SendEngagementLetterModal({
  clientId,
  setModalOpen,
  onSuccess,
}: SendEngagementLetterModalProps) {
  const {
    view,
    isEditorView,
    templates,
    isLoadingList,
    isLoadingTemplate,
    isDeleting,
    selectedTemplate,
    isSending,
    editId,
    editName,
    setEditName,
    editBody,
    setEditBody,
    editError,
    setEditError,
    isSaving,
    handleSelectTemplate,
    handleSend,
    handleDelete,
    handleStartCreate,
    handleStartEdit,
    handleSaveTemplate,
    handleBack,
  } = useLetterTemplates();

  // ── Render views ──

  const renderList = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Select a template to send as the end-of-engagement letter.
        </p>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {isLoadingList ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : templates.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 mb-3">No templates yet.</p>
          <Button onClick={handleStartCreate}>
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <button
                onClick={() => handleSelectTemplate(t.id)}
                disabled={isLoadingTemplate}
                className="flex-1 min-w-0 px-4 py-3 text-left"
              >
                <p className="text-sm font-medium text-primary truncate">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">by {t.createdBy}</p>
              </button>
              <div className="flex items-center gap-1 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleStartEdit(t.id)}
                  className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={isDeleting === t.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  {isDeleting === t.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderPreview = () => (
    <>
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to templates
        </button>
        <p className="text-sm font-medium text-primary">{selectedTemplate?.name}</p>
      </div>

      <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 max-h-72 overflow-y-auto">
        {selectedTemplate && <CommentPreview content={selectedTemplate.body} />}
      </div>
    </>
  );

  const renderEditor = () => (
    <>
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to templates
        </button>
        <p className="text-sm font-medium text-primary">
          {editId ? "Edit Template" : "New Template"}
        </p>
      </div>

      <div className="space-y-3">
        <Input
          label="Template Name"
          value={editName}
          onChange={(e) => { setEditName(e.target.value); setEditError(null); }}
          placeholder="e.g. Standard End of Engagement"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Letter Body
          </label>
          <CommentEditor
            value={editBody}
            onChange={setEditBody}
            placeholder="Write the engagement letter content..."
            minHeight="150px"
          />
        </div>
        {editError && <p className="text-sm text-red-600">{editError}</p>}
      </div>
    </>
  );

  return (
    <Modal
      title="End of Engagement Letter"
      setModalOpen={setModalOpen}
      maxWidth="max-w-3xl"
      actions={
        view === "preview" ? (
          <>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={() => handleSend(clientId, onSuccess, () => setModalOpen(false))} isLoading={isSending}>
              Send Letter
            </Button>
          </>
        ) : isEditorView ? (
          <>
            <Button variant="secondary" onClick={handleBack} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} isLoading={isSaving} disabled={!editName.trim()}>
              {editId ? "Save Changes" : "Create Template"}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        )
      }
    >
      <div className="mt-4">
        {view === "list" && renderList()}
        {view === "preview" && renderPreview()}
        {isEditorView && renderEditor()}
      </div>
    </Modal>
  );
}
