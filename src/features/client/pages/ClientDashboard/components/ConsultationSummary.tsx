import { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";
import { consultationAPI } from "../../../../../api/consultation";
import { formatCurrency } from "../../../../../lib/formatters";
import type { ConsultationMonthlySummary } from "../../../../../types/consultation";

export default function ConsultationSummary() {
  const [summary, setSummary] = useState<ConsultationMonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSummary = async () => {
      try {
        const data = await consultationAPI.getMySummary();
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSummary();
    return () => { cancelled = true; };
  }, []);

  if (error) return null; // Config not set up or no data — hide card

  const monthLabel = summary
    ? new Date(summary.year, summary.month - 1).toLocaleString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-accent" />
        <h2 className="text-base font-bold text-primary">Consultation Hours</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : summary ? (
        <>
          <p className="text-xs text-gray-400 mb-3">{monthLabel}</p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-end justify-between mb-1.5">
              <p className="text-2xl font-bold text-primary">
                {summary.totalHoursConsumed.toFixed(1)}h
              </p>
              <p className="text-sm text-gray-400">
                of {summary.includedHours.toFixed(1)}h included
              </p>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              {summary.includedHours > 0 && (
                <div
                  className={`h-full rounded-full transition-all ${
                    summary.excessHours > 0 ? "bg-orange-400" : "bg-accent"
                  }`}
                  style={{ width: `${Math.min((summary.billableHours / summary.includedHours) * 100, 100)}%` }}
                />
              )}
            </div>
            {summary.remainingIncluded > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {summary.remainingIncluded.toFixed(1)}h remaining
              </p>
            )}
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-md bg-blue-50 px-3 py-2 text-center">
              <p className="text-xs text-blue-600 font-medium">Included</p>
              <p className="text-sm font-bold text-blue-700">{(summary.billableHours - summary.excessHours).toFixed(1)}h</p>
            </div>
            <div className="rounded-md bg-orange-50 px-3 py-2 text-center">
              <p className="text-xs text-orange-600 font-medium">Excess</p>
              <p className="text-sm font-bold text-orange-700">{summary.excessHours.toFixed(1)}h</p>
            </div>
            <div className="rounded-md bg-violet-50 px-3 py-2 text-center">
              <p className="text-xs text-violet-600 font-medium">Courtesy</p>
              <p className="text-sm font-bold text-violet-700">{summary.courtesyHours.toFixed(1)}h</p>
            </div>
          </div>

          {summary.estimatedExcessFee > 0 && (
            <div className="mt-3 rounded-md bg-orange-50 border border-orange-100 px-3 py-2">
              <p className="text-xs text-orange-700">
                Estimated excess fee: <span className="font-semibold">{formatCurrency(summary.estimatedExcessFee)}</span>
                <span className="text-orange-500 ml-1">({formatCurrency(summary.excessRate)}/hr)</span>
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
