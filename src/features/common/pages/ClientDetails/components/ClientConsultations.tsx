import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, Settings, Check, Pencil, X } from "lucide-react";
import { consultationAPI } from "../../../../../api/consultation";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatDate, formatCurrency } from "../../../../../lib/formatters";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import { getRolePrefix } from "../../../../../constants/roles";
import { useToast } from "../../../../../contexts/ToastContext";
import type { ConsultationMonthlySummary, ConsultationLogListItem, ConsultationLogPageResponse } from "../../../../../types/consultation";
import { billableLabels, billableStyles } from "../../../../../constants/consultation";

const now = new Date();

function InlineConfigSetup({ clientId, onConfigured }: { clientId: string; onConfigured: () => void }) {
  const { toastSuccess, toastError } = useToast();
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    if (isNaN(h) || isNaN(r)) return;
    setIsSaving(true);
    try {
      await consultationAPI.upsertConfig(clientId, { includedHours: h, excessRate: r });
      toastSuccess("Config Saved", "Consultation config has been set up.");
      onConfigured();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to save config."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-lg bg-white border border-amber-200 bg-amber-50/30 p-5">
      <div className="flex items-start gap-3 mb-4">
        <Settings className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">Consultation config not set up</p>
          <p className="text-sm text-amber-700 mt-1">Set the monthly included hours and billable rate to enable consultation tracking for this client.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">Included Hours / Month</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">Billable Rate (per hour)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving || !hours || !rate}
        className="mt-3 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Save Config
      </button>
    </div>
  );
}

export default function ClientConsultations({ clientId }: { clientId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");
  const { toastSuccess, toastError } = useToast();
  const canManageConfig = hasPermission(user?.permissions, Permission.CONSULTATION_CONFIG_MANAGE);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [summary, setSummary] = useState<ConsultationMonthlySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const [logs, setLogs] = useState<ConsultationLogListItem[]>([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsTotalPages, setLogsTotalPages] = useState(0);
  const [logsLoading, setLogsLoading] = useState(true);

  const [editingConfig, setEditingConfig] = useState(false);
  const [editHours, setEditHours] = useState("");
  const [editRate, setEditRate] = useState("");
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const monthLabel = new Date(year, month - 1).toLocaleString("en-US", { month: "long", year: "numeric" });

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    setNotConfigured(false);
    try {
      const data = await consultationAPI.getClientSummary(clientId, year, month);
      setSummary(data);
    } catch (err) {
      const msg = getErrorMessage(err);
      // 404 means config not set up
      if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("404")) {
        setNotConfigured(true);
      } else {
        setSummaryError(msg);
      }
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [clientId, year, month]);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const dateFrom = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const dateTo = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      const data: ConsultationLogPageResponse = await consultationAPI.getLogs({
        clientId,
        status: "APPROVED",
        dateFrom,
        dateTo,
        page: logsPage,
        size: 10,
      });
      setLogs(data.content);
      setLogsTotalPages(data.totalPages);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, [clientId, year, month, logsPage]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setLogsPage(0);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setLogsPage(0);
  };

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div className="space-y-4">
      {/* Month picker */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-primary">{monthLabel}</h2>
        <button onClick={nextMonth} disabled={isCurrentMonth} className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Not configured — show inline setup for Manager */}
      {!summaryLoading && notConfigured && canManageConfig && (
        <InlineConfigSetup clientId={clientId} onConfigured={fetchSummary} />
      )}

      {/* Not configured — non-Manager sees info message */}
      {!summaryLoading && notConfigured && !canManageConfig && (
        <div className="rounded-lg bg-white border border-gray-200 p-5 text-center">
          <Settings className="h-5 w-5 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Consultation config has not been set up for this client yet.</p>
        </div>
      )}

      {/* Summary card */}
      {!notConfigured && (
        <div className="rounded-lg bg-white border border-gray-200 p-5">
          {summaryLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : summaryError ? (
            <div className="py-6 text-center">
              <AlertTriangle className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{summaryError}</p>
            </div>
          ) : summary ? (
            <>
              {/* Config edit inline */}
              {editingConfig && canManageConfig ? (
                <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Edit Consultation Config</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Included Hours / Month</label>
                      <input type="number" value={editHours} onChange={(e) => setEditHours(e.target.value)} placeholder="0.00" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Billable Rate (per hour)</label>
                      <input type="number" value={editRate} onChange={(e) => setEditRate(e.target.value)} placeholder="0.00" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={async () => {
                        const h = parseFloat(editHours); const r = parseFloat(editRate);
                        if (isNaN(h) || isNaN(r)) return;
                        setIsSavingConfig(true);
                        try {
                          await consultationAPI.upsertConfig(clientId, { includedHours: h, excessRate: r });
                          toastSuccess("Config Updated");
                          setEditingConfig(false);
                          fetchSummary();
                        } catch (err) { toastError(getErrorMessage(err)); }
                        finally { setIsSavingConfig(false); }
                      }}
                      disabled={isSavingConfig || !editHours || !editRate}
                      className="p-2 rounded-md text-white bg-accent hover:bg-accent-hover disabled:opacity-50 transition-colors"
                    >
                      {isSavingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setEditingConfig(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-sm font-medium text-primary">
                    {summary.totalHoursConsumed.toFixed(2)}h consumed
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      {summary.includedHours.toFixed(2)}h included / month
                    </p>
                    {canManageConfig && !editingConfig && (
                      <button
                        onClick={() => { setEditHours(String(summary.includedHours)); setEditRate(String(summary.excessRate)); setEditingConfig(true); }}
                        className="p-0.5 text-gray-300 hover:text-accent transition-colors"
                        title="Edit config"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  {summary.includedHours > 0 ? (
                    <div
                      className={`h-full rounded-full transition-all ${
                        summary.excessHours > 0 ? "bg-orange-400" : "bg-accent"
                      }`}
                      style={{ width: `${Math.min((summary.billableHours / summary.includedHours) * 100, 100)}%` }}
                    />
                  ) : (
                    <div className="h-full w-0" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2.5">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Included</p>
                  <p className="text-lg font-bold text-blue-700">{(summary.billableHours - summary.excessHours).toFixed(2)}h</p>
                </div>
                <div className="rounded-md bg-orange-50 border border-orange-100 px-3 py-2.5">
                  <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Billable</p>
                  <p className="text-lg font-bold text-orange-700">{summary.excessHours.toFixed(2)}h</p>
                </div>
                <div className="rounded-md bg-violet-50 border border-violet-100 px-3 py-2.5">
                  <p className="text-xs text-violet-600 font-medium uppercase tracking-wider">Courtesy</p>
                  <p className="text-lg font-bold text-violet-700">{summary.courtesyHours.toFixed(2)}h</p>
                </div>
                <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2.5">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Est. Billable Fee</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(summary.estimatedExcessFee)}</p>
                  {summary.excessRate > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(summary.excessRate)}/hr</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Logs table */}
      <div className="rounded-lg bg-white border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-primary">Consultation Logs — {monthLabel}</h3>
        </div>
        {logsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No consultation logs for this month.
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th-label w-[15%]">Date</th>
                  <th className="th-label w-[10%]">Hours</th>
                  <th className="th-label w-[30%]">Subject</th>
                  <th className="th-label w-[12%]">Type</th>
                  <th className="th-label w-[18%]">By</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => navigate(`/${prefix}/consultation-logs/${l.id}`)}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-600">{formatDate(l.date)}</td>
                    <td className="px-4 py-3 font-medium text-primary">{l.hours.toFixed(2)}h</td>
                    <td className="px-4 py-3 max-w-0">
                      <span className="block truncate text-gray-700" title={l.subject}>{l.subject}</span>
                      <span className="block truncate text-xs text-gray-400 mt-0.5">{l.platform}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${billableStyles[l.billableType]}`}>
                        {billableLabels[l.billableType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-0">
                      <span className="block truncate text-gray-600" title={l.createdByName}>{l.createdByName}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logsTotalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Page {logsPage + 1} of {logsTotalPages}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setLogsPage((p) => p - 1)} disabled={logsPage === 0} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setLogsPage((p) => p + 1)} disabled={logsPage >= logsTotalPages - 1} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
