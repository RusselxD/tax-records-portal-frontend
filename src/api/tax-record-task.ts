import type {
  TaxRecordTaskPageResponse,
  TaxRecordTaskFilters,
  BulkImportItem,
  BulkImportResponse,
  TaxRecordTaskDetailResponse,
  TaxRecordTaskFilesResponse,
  WorkingFileItem,
  TaxRecordTaskLogResponse,
  ClientTaxRecordTaskPageResponse,
  TaxRecordTaskOverdueItemResponse,
  TaxRecordTaskRejectedItemResponse,
  TaxRecordTaskTodoListPageResponse,
  TaxRecordTaskProgressPageResponse,
  ReviewerQueueItemResponse,
  ReviewerDecidedItemResponse,
  TaxTaskNameResponse,
  TaxRecordLookupResponse,
  CreateTaxRecordTaskRequest,
  CreateTaxRecordTaskResponse,
} from "../types/tax-record-task";
import type { LogCommentResponse } from "../types/client";
import type { RichTextContent } from "../types/client-info";
import apiClient from "./axios-config";
import { buildParams } from "./api-utils";

export const taxRecordTaskAPI = {
  getTasks: async (
    filters: TaxRecordTaskFilters = {},
  ): Promise<TaxRecordTaskPageResponse> => {
    const params = buildParams(filters);
    const res = await apiClient.get("/tax-record-tasks", { params });
    return res.data;
  },

  getOverdueTasks: async (): Promise<TaxRecordTaskOverdueItemResponse[]> => {
    const res = await apiClient.get("/tax-record-tasks/overdue");
    return res.data;
  },

  getRejectedTasks: async (): Promise<TaxRecordTaskRejectedItemResponse[]> => {
    const res = await apiClient.get("/tax-record-tasks/rejected");
    return res.data;
  },

  getReviewerQueue: async (): Promise<ReviewerQueueItemResponse[]> => {
    const res = await apiClient.get("/tax-record-tasks/reviewer-queue");
    return res.data;
  },

  getRecentlyDecided: async (): Promise<ReviewerDecidedItemResponse[]> => {
    const res = await apiClient.get("/tax-record-tasks/recently-decided");
    return res.data;
  },

  getTodoTasks: async (
    page: number = 0,
    size: number = 10,
  ): Promise<TaxRecordTaskTodoListPageResponse> => {
    const res = await apiClient.get("/tax-record-tasks/todo", {
      params: { page, size },
    });
    return res.data;
  },

  getSubmittedTasks: async (
    page: number = 0,
    size: number = 10,
  ): Promise<TaxRecordTaskProgressPageResponse> => {
    const res = await apiClient.get("/tax-record-tasks/submitted", {
      params: { page, size },
    });
    return res.data;
  },

  getForFilingTasks: async (
    page: number = 0,
    size: number = 10,
  ): Promise<TaxRecordTaskProgressPageResponse> => {
    const res = await apiClient.get("/tax-record-tasks/for-filing", {
      params: { page, size },
    });
    return res.data;
  },

  getFiledTasks: async (
    page: number = 0,
    size: number = 10,
  ): Promise<TaxRecordTaskProgressPageResponse> => {
    const res = await apiClient.get("/tax-record-tasks/filed", {
      params: { page, size },
    });
    return res.data;
  },

  downloadBulkTemplate: async (): Promise<void> => {
    const res = await apiClient.get("/tax-record-tasks/bulk-template", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tax-record-task-template.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  },

  bulkImport: async (items: BulkImportItem[]): Promise<BulkImportResponse> => {
    const res = await apiClient.post("/tax-record-tasks/bulk", items);
    return res.data;
  },

  createTask: async (payload: CreateTaxRecordTaskRequest): Promise<CreateTaxRecordTaskResponse> => {
    const res = await apiClient.post("/tax-record-tasks", payload);
    return res.data;
  },

  // ── Lookup hierarchy (categories → sub-categories → task names) ──

  getCategories: async (): Promise<TaxRecordLookupResponse[]> => {
    const res = await apiClient.get("/tax-record-categories");
    return res.data;
  },

  createCategory: async (name: string): Promise<TaxRecordLookupResponse> => {
    const res = await apiClient.post("/tax-record-categories", { name });
    return res.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/tax-record-categories/${id}`);
  },

  getSubCategories: async (categoryId: number): Promise<TaxRecordLookupResponse[]> => {
    const res = await apiClient.get(`/tax-record-categories/${categoryId}/sub-categories`);
    return res.data;
  },

  createSubCategory: async (categoryId: number, name: string): Promise<TaxRecordLookupResponse> => {
    const res = await apiClient.post(`/tax-record-categories/${categoryId}/sub-categories`, { name });
    return res.data;
  },

  deleteSubCategory: async (categoryId: number, subCategoryId: number): Promise<void> => {
    await apiClient.delete(`/tax-record-categories/${categoryId}/sub-categories/${subCategoryId}`);
  },

  getTaskNamesForSubCategory: async (subCategoryId: number): Promise<TaxRecordLookupResponse[]> => {
    const res = await apiClient.get(`/tax-record-sub-categories/${subCategoryId}/task-names`);
    return res.data;
  },

  createTaskName: async (subCategoryId: number, name: string): Promise<TaxRecordLookupResponse> => {
    const res = await apiClient.post(`/tax-record-sub-categories/${subCategoryId}/task-names`, { name });
    return res.data;
  },

  deleteTaskName: async (subCategoryId: number, taskNameId: number): Promise<void> => {
    await apiClient.delete(`/tax-record-sub-categories/${subCategoryId}/task-names/${taskNameId}`);
  },

  getClientTasks: async (
    clientId: string,
    cursor?: string,
  ): Promise<ClientTaxRecordTaskPageResponse> => {
    const params = buildParams({ cursor: cursor ?? "" });
    const res = await apiClient.get(`/tax-record-tasks/client/${clientId}`, {
      params,
    });
    return res.data;
  },

  getTask: async (id: string): Promise<TaxRecordTaskDetailResponse> => {
    const res = await apiClient.get(`/tax-record-tasks/${id}`);
    return res.data;
  },

  getTaskFiles: async (id: string): Promise<TaxRecordTaskFilesResponse> => {
    const res = await apiClient.get(`/tax-record-tasks/${id}/files`);
    return res.data;
  },

  // Working files
  uploadWorkingFile: async (
    id: string,
    file: File,
  ): Promise<WorkingFileItem> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post(
      `/tax-record-tasks/${id}/working-files`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },

  addWorkingLink: async (
    id: string,
    url: string,
    label: string,
  ): Promise<WorkingFileItem> => {
    const res = await apiClient.post(`/tax-record-tasks/${id}/working-links`, {
      url,
      label,
    });
    return res.data;
  },

  deleteWorkingFile: async (
    taskId: string,
    workingFileId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/tax-record-tasks/${taskId}/working-files/${workingFileId}`,
    );
  },

  // Output file (single)
  uploadOutputFile: async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    await apiClient.put(`/tax-record-tasks/${id}/output-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteOutputFile: async (id: string): Promise<void> => {
    await apiClient.delete(`/tax-record-tasks/${id}/output-file`);
  },

  // Proof of filing (single)
  uploadProofOfFiling: async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    await apiClient.put(`/tax-record-tasks/${id}/proof-of-filing`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProofOfFiling: async (id: string): Promise<void> => {
    await apiClient.delete(`/tax-record-tasks/${id}/proof-of-filing`);
  },

  getTaskLogs: async (id: string): Promise<TaxRecordTaskLogResponse[]> => {
    const res = await apiClient.get(`/tax-record-tasks/${id}/logs`);
    return res.data;
  },

  getTaskLogComment: async (taskId: string, logId: string): Promise<LogCommentResponse> => {
    const res = await apiClient.get(`/tax-record-tasks/${taskId}/logs/${logId}/comment`);
    return res.data;
  },

  submitTask: async (id: string, comment: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/submit`, { comment });
  },

  approveTask: async (id: string, comment: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/approve`, { comment });
  },

  rejectTask: async (id: string, comment: RichTextContent | null): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/reject`, { comment });
  },

  markFiled: async (id: string): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/mark-filed`);
  },

  markCompleted: async (id: string): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/mark-completed`);
  },

  recallTask: async (id: string): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/recall`);
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tax-record-tasks/${id}`);
  },

  getTaskNames: async (): Promise<TaxTaskNameResponse[]> => {
    const res = await apiClient.get("/tax-task-names");
    return res.data;
  },
};
