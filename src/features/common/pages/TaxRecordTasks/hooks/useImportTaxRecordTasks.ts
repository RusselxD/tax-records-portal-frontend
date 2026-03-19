import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { getErrorMessage } from "../../../../../lib/api-error";
import { clientAPI } from "../../../../../api/client";
import { usersAPI } from "../../../../../api/users";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { PERIOD } from "../../../../../types/tax-record-task";
import type { BulkImportItem, LookupResponse } from "../../../../../types/tax-record-task";
import type { AccountantListItemResponse } from "../../../../../types/user";

export interface ParsedRow {
  row: number;
  clientName: string;
  clientId: string | null;
  category: string;
  subCategory: string;
  taskName: string;
  year: string;
  period: string;
  deadline: string;
  description: string;
  assignedTo: string;
  assignedToId: string | null;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

interface RefData {
  clients: LookupResponse[];
  accountants: AccountantListItemResponse[];
  clientMap: Map<string, string>;
  accountantMap: Map<string, string>;
}

const VALID_PERIODS = new Set(Object.values(PERIOD));

function formatDeadline(value: unknown): string {
  if (!value) return "";
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      const y = date.y;
      const m = String(date.m).padStart(2, "0");
      const d = String(date.d).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  }
  return String(value).trim();
}

function parseExcel(buffer: ArrayBuffer): Omit<ParsedRow, "clientId" | "assignedToId" | "errors" | "warnings" | "isValid">[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  return raw.map((row, i) => ({
    row: i + 2,
    clientName: String(row["Client Name"] ?? "").trim(),
    category: String(row["Category"] ?? "").trim(),
    subCategory: String(row["Sub Category"] ?? "").trim(),
    taskName: String(row["Task Name"] ?? "").trim(),
    year: String(row["Year"] ?? "").trim(),
    period: String(row["Period"] ?? "").trim().toUpperCase(),
    deadline: formatDeadline(row["Deadline"]),
    description: String(row["Description"] ?? "").trim(),
    assignedTo: String(row["Assigned To"] ?? "").trim(),
  }));
}

function validateRow(
  raw: Omit<ParsedRow, "clientId" | "assignedToId" | "errors" | "warnings" | "isValid">,
  ref: RefData,
): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];
  let clientId: string | null = null;
  let assignedToId: string | null = null;

  if (!raw.clientName) {
    errors.push("Client Name is required.");
  } else {
    clientId = ref.clientMap.get(raw.clientName.toLowerCase()) ?? null;
    if (!clientId) errors.push(`Client "${raw.clientName}" not found.`);
  }

  if (!raw.category) errors.push("Category is required.");
  if (!raw.subCategory) errors.push("Sub Category is required.");
  if (!raw.taskName) errors.push("Task Name is required.");

  if (!raw.year) {
    errors.push("Year is required.");
  } else if (isNaN(Number(raw.year))) {
    errors.push("Year must be a number.");
  }

  if (!raw.period) {
    errors.push("Period is required.");
  } else if (!VALID_PERIODS.has(raw.period as never)) {
    errors.push(`Invalid period: ${raw.period}.`);
  }

  if (!raw.deadline) errors.push("Deadline is required.");

  if (!raw.assignedTo) {
    errors.push("Assigned To is required.");
  } else {
    assignedToId = ref.accountantMap.get(raw.assignedTo.toLowerCase()) ?? null;
    if (!assignedToId) errors.push(`Accountant "${raw.assignedTo}" not found.`);
  }

  return {
    ...raw,
    clientId,
    assignedToId,
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}

export default function useImportTaxRecordTasks() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const refDataRef = useRef<RefData | null>(null);
  const [refError, setRefError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch reference data lazily (cached after first call)
  const fetchRefData = useCallback(async (): Promise<RefData | null> => {
    if (refDataRef.current) return refDataRef.current;

    try {
      const [clientsResult, accountantsResult] = await Promise.allSettled([
        clientAPI.getActiveClients(),
        usersAPI.getAccountants("CSD,OOS"),
      ]);

      const errors: string[] = [];

      if (clientsResult.status === "rejected") {
        errors.push(getErrorMessage(clientsResult.reason, "Failed to load clients."));
      }

      if (accountantsResult.status === "rejected") {
        errors.push(getErrorMessage(accountantsResult.reason, "Failed to load accountants."));
      }

      if (errors.length > 0) {
        setRefError(errors.join(" "));
        return null;
      }

      const clients = clientsResult.status === "fulfilled" ? clientsResult.value : [];
      const accountants = accountantsResult.status === "fulfilled" ? accountantsResult.value : [];

      const clientMap = new Map<string, string>();
      for (const c of clients) {
        clientMap.set(c.displayName.toLowerCase(), c.id);
      }

      const accountantMap = new Map<string, string>();
      for (const a of accountants) {
        accountantMap.set(a.displayName.toLowerCase(), a.id);
      }

      const data: RefData = { clients, accountants, clientMap, accountantMap };
      refDataRef.current = data;
      setRefError(null);
      return data;
    } catch {
      setRefError("Failed to load reference data.");
      return null;
    }
  }, []);

  // Parse + validate uploaded file (fetches ref data on first call)
  const processFile = useCallback(
    async (file: File) => {
      setIsParsing(true);
      setParseError(null);
      setRefError(null);
      setRows([]);
      setSubmitError(null);

      try {
        const [buffer, ref] = await Promise.all([
          file.arrayBuffer(),
          fetchRefData(),
        ]);

        if (!ref) return;

        const rawRows = parseExcel(buffer);

        if (rawRows.length === 0) {
          setParseError("No data rows found in the uploaded file.");
          return;
        }

        const validated = rawRows.map((r) => validateRow(r, ref));
        setRows(validated);
      } catch {
        setParseError("Failed to parse the Excel file.");
      } finally {
        setIsParsing(false);
      }
    },
    [fetchRefData],
  );

  // Submit valid rows — returns { created, failed } on success/partial, null on error
  const submitRows = useCallback(async (): Promise<{ created: number; failed: number } | null> => {
    const validRows = rows.filter((r) => r.isValid);
    if (validRows.length === 0) return null;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const items: BulkImportItem[] = validRows.map((r) => ({
        clientId: r.clientId!,
        category: r.category,
        subCategory: r.subCategory,
        taskName: r.taskName,
        year: Number(r.year),
        period: r.period,
        deadline: r.deadline,
        description: r.description,
        assignedToId: r.assignedToId!,
      }));

      const result = await taxRecordTaskAPI.bulkImport(items);

      if (result.failed > 0) {
        // Map error indices back to original row positions
        // result.errors[].index refers to the position in the valid-only array
        const validRowIndices = rows.reduce<number[]>((acc, row, i) => {
          if (row.isValid) acc.push(i);
          return acc;
        }, []);

        setRows((prev) =>
          prev.map((row, i) => {
            const validIdx = validRowIndices.indexOf(i);
            if (validIdx === -1) return row;
            const serverError = result.errors.find((e) => e.index === validIdx);
            if (serverError) {
              return {
                ...row,
                errors: [serverError.message],
                isValid: false,
              };
            }
            return row;
          }),
        );
      }

      return { created: result.created, failed: result.failed };
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Import failed. Try again."));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [rows]);

  const clearRows = useCallback(() => {
    setRows([]);
    setParseError(null);
    setSubmitError(null);
  }, []);

  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.filter((r) => !r.isValid).length;

  return {
    rows,
    validCount,
    invalidCount,
    isParsing,
    parseError,
    refError,
    isSubmitting,
    submitError,
    processFile,
    submitRows,
    clearRows,
  };
}
