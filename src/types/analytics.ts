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
  // Card 1
  totalClients: number;
  onboardingClients: number;
  activeClients: number;
  offboardingClients: number;
  inactiveClients: number;

  // Card 2
  totalTasks: number;
  openTasks: number;
  submittedTasks: number;
  approvedForFilingTasks: number;
  filedTasks: number;
  completedTasks: number;
  rejectedTasks: number;

  // Card 3
  totalOverdueTasks: number;
  tasksDueToday: number;
  tasksDueThisWeek: number;

  // Card 4
  profilesPendingReview: number;
  onboardingProfilesPending: number;
  profileUpdatesPending: number;

  // Card 5
  tasksCompletedThisMonth: number;
  tasksCreatedThisMonth: number;
  tasksRejectedThisMonth: number;

  // Card 6
  avgTaskCompletionInDays: number;
  onTimeRate: number; // 0.0–1.0

  // Card 7
  avgRejectionCyclesPerTask: number;
  firstAttemptApprovalRate: number; // 0.0–1.0

  // Card 8
  onboardingClientsCopy: number; // same as Card 1 sub-stat, reused
  onboardingProfilesPendingCopy: number; // same as Card 4 sub-stat, reused
  clientsActivatedThisMonth: number;
}

export interface TaskCompletionTrendData {
  labels: string[];
  values: number[];
}

export interface TaskApprovalRateData {
  approvedRate: number;
  rejectedRate: number;
}

export interface AccountantWorkloadItem {
  accountantName: string;
  activeTasks: number;
}

export interface TasksByCategorySystemItem {
  category: string;
  open: number;
  submitted: number;
  rejected: number;
  approvedForFiling: number;
  filed: number;
  completed: number;
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
