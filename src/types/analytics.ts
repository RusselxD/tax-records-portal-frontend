// Accountant performance analytics
export interface TaskSummaryResponse {
  open: number;
  submitted: number;
  rejected: number;
  approvedForFiling: number;
  filed: number;
  completed: number;
  overdue: number;
  completedThisMonth: number;
}

export interface MonthlyThroughputItem {
  month: string; // "2026-03"
  completed: number;
}

export interface MonthlyThroughputResponse {
  data: MonthlyThroughputItem[];
}

export interface OnTimeRateResponse {
  totalCompleted: number;
  completedOnTime: number;
  completedLate: number;
  onTimeRate: number; // 0.0 – 1.0
}

export interface QualityMetricsResponse {
  totalSubmitted: number;
  firstAttemptApproved: number;
  firstAttemptApprovalRate: number; // 0.0 – 1.0
  avgRejectionCyclesPerTask: number;
}

export interface CategoryCountItem {
  category: string;
  total: number;
  active: number;
  completed: number;
}

export interface TasksByCategoryResponse {
  data: CategoryCountItem[];
}

export interface OnboardingPipelineResponse {
  onboarding: number;
  approved: number;
  active: number;
  total: number;
}

export interface ClientPortfolioItem {
  clientId: string;
  clientName: string;
  status: string;
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  nearestDeadline: string | null;
}

export interface ClientPortfolioResponse {
  content: ClientPortfolioItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// System analytics
export interface SystemAnalyticsResponse {
  totalClients: number;
  totalActiveClients: number;
  totalPendingClients: number;
  totalTasks: number;
  openTasks: number;
  submittedTasks: number;
  approvedTasks: number;
  rejectedTasks: number;
  totalOverdueTasks: number;
  profilesPendingReview: number;
  tasksApprovedThisMonth: number;
  avgTaskCompletionInDays: number;
  tasksDueThisWeek: number;
  tasksRejectedThisMonth: number;
}

export interface TaskCompletionTrendData {
  labels: string[];
  values: number[];
}

export interface TaskApprovalRateData {
  approved: number;
  rejected: number;
}

export interface AccountantsDashboardAnalyticsResponse {
  openTasks: number;
  newToday: number;
  submittedTasks: number;
  forFilingTasks: number;
}

export interface ReviewerDashboardStatsResponse {
  awaitingReview: number;
  newToday: number;
  approvedToday: number;
  approvalRateThisMonth: number | null;
}
