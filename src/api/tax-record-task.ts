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
  ReviewerQueueItemResponse,
  ReviewerDecidedItemResponse,
  TaxTaskNameResponse,
} from "../types/tax-record-task";
import apiClient from "./axios-config";

export const taxRecordTaskAPI = {
  getTasks: async (
    filters: TaxRecordTaskFilters = {},
  ): Promise<TaxRecordTaskPageResponse> => {
    const params: Record<string, string | number> = {};

    if (filters.page != null) params.page = filters.page;
    if (filters.size != null) params.size = filters.size;
    if (filters.search) params.search = filters.search;
    if (filters.clientId) params.clientId = filters.clientId;
    if (filters.categoryId != null) params.categoryId = filters.categoryId;
    if (filters.subCategoryId != null)
      params.subCategoryId = filters.subCategoryId;
    if (filters.taskNameId != null) params.taskNameId = filters.taskNameId;
    if (filters.year != null) params.year = filters.year;
    if (filters.period) params.period = filters.period;
    if (filters.status) params.status = filters.status;
    if (filters.accountantId) params.accountantId = filters.accountantId;

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

  getClientTasks: async (
    clientId: string,
    cursor?: string,
  ): Promise<ClientTaxRecordTaskPageResponse> => {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
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

  submitTask: async (id: string, comment: string): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/submit`, { comment });
  },

  approveTask: async (id: string, comment: string): Promise<void> => {
    await apiClient.post(`/tax-record-tasks/${id}/approve`, { comment });
  },

  rejectTask: async (id: string, comment: string): Promise<void> => {
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

  getTaskNames: async (): Promise<TaxTaskNameResponse[]> => {
    const res = await apiClient.get("/tax-task-names");
    return res.data;
  },
};
