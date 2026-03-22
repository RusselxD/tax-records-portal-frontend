// Accountant performance analytics
export interface TaskSummaryResponse {
  // Card 1 — Task Pipeline
  open: number;
  submitted: number;
  rejected: number;
  approvedForFiling: number;
  filed: number;
  completed: number;

  // Card 2 — Deadlines
  overdue: number;
  dueToday: number;
  dueThisWeek: number;

  // Card 3 — Productivity
  completedThisMonth: number;
  submittedThisMonth: number;
  newTasksThisMonth: number;

  // Card 4 — Efficiency
  onTimeRate: number; // 0.0–1.0
  avgCompletionDays: number;

  // Card 5 — Quality
  firstAttemptApprovalRate: number; // 0.0–1.0
  avgRejectionCycles: number;

  // Card 6 — Responsiveness
  avgDaysToFirstSubmit: number;
  avgRejectionTurnaroundDays: number;

  // Card 7 — Workload
  activeTaskCount: number;
  assignedClientCount: number;

  // Card 8 — Trend
  completedLastMonth: number;
  completedThisMonthTrend: number;
  percentChange: number | null;
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
  activeClient: number;
  offboarding: number;
  inactiveClient: number;
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

// Accountant overview (manager view)
export interface AccountantOverviewItem {
  id: string;
  name: string;
  position: string;
  roleKey: string;
  profileUrl: string;
  activeTasks: number;
  assignedClients: number;
  overdueTasks: number;
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
