import type { Period } from "./tax-record-task";

export const DRILL_DOWN_LEVEL = {
  CATEGORY: "category",
  SUB_CATEGORY: "subCategory",
  TASK_NAME: "taskName",
  YEAR: "year",
  PERIOD: "period",
  RECORD: "record",
} as const;

export type DrillDownLevel =
  (typeof DRILL_DOWN_LEVEL)[keyof typeof DRILL_DOWN_LEVEL];

export interface DrillDownItem {
  id: string;
  label: string;
  count: number;
}

export interface TaxRecordEntryResponse {
  id: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  workingFiles: { type: "file" | "link"; fileId: string; fileName: string; url: string | null; label: string | null }[];
  outputFile: { id: string; name: string } | null;
  proofOfFilingFile: { id: string; name: string } | null;
}

export interface DrillDownItemsResponse {
  level: Exclude<DrillDownLevel, "record">;
  items: DrillDownItem[];
}

export interface DrillDownRecordResponse {
  level: "record";
  record: TaxRecordEntryResponse;
}

export type DrillDownResponse = DrillDownItemsResponse | DrillDownRecordResponse;

export interface DrillDownFilters {
  categoryId?: number;
  subCategoryId?: number;
  taskNameId?: number;
  year?: number;
  period?: Period;
}

export interface DrillSelection {
  id: string;
  label: string;
}

export interface ImportantDateResponse {
  date: string;
  label: string;
}

export type RecentTaxRecordRange = "7d" | "30d" | "3m";

export interface RecentTaxRecordEntryResponse {
  id: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  taskNameId: number;
  taskName: string;
  year: number;
  period: Period;
  createdAt: string;
}
