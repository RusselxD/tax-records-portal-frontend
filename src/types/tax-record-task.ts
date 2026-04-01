export const TAX_RECORD_TASK_STATUS = {
  OPEN: "OPEN",
  SUBMITTED: "SUBMITTED",
  REJECTED: "REJECTED",
  APPROVED_FOR_FILING: "APPROVED_FOR_FILING",
  FILED: "FILED",
  COMPLETED: "COMPLETED",
} as const;

export type TaxRecordTaskStatus =
  (typeof TAX_RECORD_TASK_STATUS)[keyof typeof TAX_RECORD_TASK_STATUS];

export const PERIOD = {
  JAN: "JAN",
  FEB: "FEB",
  MAR: "MAR",
  APR: "APR",
  MAY: "MAY",
  JUN: "JUN",
  JUL: "JUL",
  AUG: "AUG",
  SEP: "SEP",
  OCT: "OCT",
  NOV: "NOV",
  DEC: "DEC",
  Q1: "Q1",
  Q2: "Q2",
  Q3: "Q3",
  Q4: "Q4",
  ANNUALLY: "ANNUALLY",
} as const;

export type Period = (typeof PERIOD)[keyof typeof PERIOD];

export interface TaxRecordTaskListItem {
  id: string;
  clientDisplayName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  status: TaxRecordTaskStatus;
  deadline: string;
  isOverdue: boolean;
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
}

export interface TaxRecordTaskPageResponse {
  content: TaxRecordTaskListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type SortBy =
  | "clientDisplayName"
  | "taskName"
  | "categoryName"
  | "period"
  | "status"
  | "deadline"
  | "createdAt";

export type SortDirection = "ASC" | "DESC";

export interface TaxRecordTaskFilters {
  page?: number;
  size?: number;
  search?: string;
  clientId?: string;
  taskNameId?: number;
  period?: Period;
  status?: TaxRecordTaskStatus;
  accountantId?: string;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

export interface LookupResponse {
  id: string;
  displayName: string;
}

export interface TaxRecordLookupResponse {
  id: number;
  name: string;
}

export interface CreateTaxRecordTaskRequest {
  clientId: string;
  categoryId: number;
  subCategoryId: number;
  taskNameId: number;
  year: number;
  period: Period;
  deadline: string;
  description: string | null;
  assignedToIds: string[];
}

export interface CreateTaxRecordTaskResponse {
  id: string;
}

export interface BulkImportItem {
  clientId: string;
  category: string;
  subCategory: string;
  taskName: string;
  year: number;
  period: string;
  deadline: string;
  description: string;
  assignedToId: string;
}

export interface BulkImportResponse {
  created: number;
  failed: number;
  errors: { index: number; message: string }[];
}

export interface TaskActions {
  canEdit: boolean;
  canSubmit: boolean;
  canRecall: boolean;
  canApprove: boolean;
  canReject: boolean;
  canMarkFiled: boolean;
  canMarkCompleted: boolean;
  canUploadWorkingFiles: boolean;
  canUploadOutput: boolean;
  canUploadProof: boolean;
  canDelete: boolean;
}

export interface TaxRecordTaskDetailResponse {
  id: string;
  clientId: string;
  clientDisplayName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  status: TaxRecordTaskStatus;
  deadline: string;
  description: string;
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  actions?: TaskActions;
}

export interface WorkingFileItem {
  type: "file" | "link";
  fileId: string;
  fileName: string;
  url: string;
  label: string;
}

export interface FileItem {
  id: string;
  name: string;
}

export interface TaxRecordTaskFilesResponse {
  workingFiles: WorkingFileItem[];
  outputFile: FileItem | null;
  proofOfFilingFile: FileItem | null;
}

export const TAX_RECORD_TASK_LOG_ACTION = {
  CREATED: "CREATED",
  SUBMITTED: "SUBMITTED",
  RECALLED: "RECALLED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  APPROVED_FOR_FILING: "APPROVED_FOR_FILING",
  FILED: "FILED",
  COMPLETED: "COMPLETED",
} as const;

export type TaxRecordTaskLogAction =
  (typeof TAX_RECORD_TASK_LOG_ACTION)[keyof typeof TAX_RECORD_TASK_LOG_ACTION];

export interface ClientTaxRecordTaskItem {
  id: string;
  taskName: string;
  categoryName: string;
  period: Period;
  year: number;
  status: TaxRecordTaskStatus;
  deadline: string;
  isOverdue: boolean;
  assignedTo: string[];
}

export interface ClientTaxRecordTaskPageResponse {
  tasks: ClientTaxRecordTaskItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface TaxRecordTaskLogResponse {
  id: string;
  action: TaxRecordTaskLogAction;
  hasComment: boolean;
  performedBy: string;
  performedAt: string;
}

export interface TaxRecordTaskOverdueItemResponse {
  id: string;
  clientName: string;
  taskName: string;
  categoryName: string;
  subCategoryName: string;
  period: Period;
  year: number;
  status: TaxRecordTaskStatus;
  deadline: string;
  createdAt: string;
  createdBy: string;
}

export interface TaxRecordTaskOverduePageResponse {
  content: TaxRecordTaskOverdueItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TaxRecordTaskRejectedItemResponse {
  id: string;
  clientName: string;
  taskName: string;
  categoryName: string;
  subCategoryName: string;
  period: Period;
  year: number;
  deadline: string;
  isOverdue: boolean;
  createdAt: string;
  createdBy: string;
}

export interface TaxRecordTaskRejectedPageResponse {
  content: TaxRecordTaskRejectedItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ReviewerQueueItemResponse {
  id: string;
  clientName: string;
  taskName: string;
  categoryName: string;
  subCategoryName: string;
  year: number;
  period: Period;
  deadline: string;
  isOverdue: boolean;
  assignedTo: string[];
  submittedAt: string;
}

export interface TaxTaskNameResponse {
  id: number;
  name: string;
}

export interface ReviewerDecidedItemResponse {
  id: string;
  clientName: string;
  taskName: string;
  categoryName: string;
  subCategoryName: string;
  year: number;
  period: Period;
  deadline: string;
  isOverdue: boolean;
  assignedTo: string[];
  decision: "APPROVED_FOR_FILING" | "REJECTED";
  decidedAt: string;
}

export interface TaxRecordTaskProgressListItemResponse {
  id: string;
  clientName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  deadline: string;
  createdBy: string;
  createdAt: string;
}

export interface TaxRecordTaskProgressPageResponse {
  content: TaxRecordTaskProgressListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TaxRecordTaskTodoListPageResponse {
  content: TaxRecordTaskTodoListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TaxRecordTaskTodoListItemResponse {
  id: string;
  clientName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  status: TaxRecordTaskStatus;
  deadline: string;
  isOverdue: boolean;
  createdBy: string;
  createdAt: string;
}
