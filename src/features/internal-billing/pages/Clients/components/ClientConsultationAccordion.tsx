import { useState, useEffect } from "react";
import { Clock, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { consultationAPI } from "../../../../../api/consultation";
import { formatCurrency } from "../../../../../lib/formatters";
import type { ConsultationMonthlySummary } from "../../../../../types/consultation";

interface Props {
  clientId: string;
  clientName: string;
}

export default function ClientConsultationAccordion({ clientId, clientName }: Props) {
  const [summary, setSummary] = useState<ConsultationMonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const now = new Date();
    const fetchSummary = async () => {
      try {
        const data = await consultationAPI.getClientSummary(
          clientId,
          now.getFullYear(),
          now.getMonth() + 1,
        );
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSummary();
    return () => { cancelled = true; };
  }, [clientId]);

  const monthLabel = summary
    ? new Date(summary.year, summary.month - 1).toLocaleString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div className="flex items-start justify-between gap-4">
        {/* Consultation Hours */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">Consultation Hours</h3>
            {summary && (
              <span className="text-xs text-gray-400">{monthLabel}</span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : error || !summary ? (
            <p className="text-sm text-gray-400 italic">
              No consultation data available for {clientName}.
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              {/* Total + bar */}
              <div className="min-w-[10rem]">
                <div className="flex items-end gap-2 mb-1.5">
                  <span className="text-xl font-bold text-primary">
                    {summary.totalHoursConsumed.toFixed(1)}h
                  </span>
                  <span className="text-xs text-gray-400 mb-0.5">
                    of {summary.includedHours.toFixed(1)}h included
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full">
                  {summary.includedHours > 0 && (
                    <div
                      className={`h-full rounded-full transition-all ${
                        summary.excessHours > 0 ? "bg-orange-400" : "bg-accent"
                      }`}
                      style={{
                        width: `${Math.min(
                          (summary.totalHoursConsumed / summary.includedHours) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  )}
                </div>
                {summary.remainingIncluded > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {summary.remainingIncluded.toFixed(1)}h remaining
                  </p>
                )}
              </div>

              {/* Breakdown pills */}
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-blue-50 px-3 py-1.5 text-center">
                  <p className="text-xs text-blue-600 font-medium">Included</p>
                  <p className="text-sm font-bold text-blue-700">
                    {(summary.billableHours - summary.excessHours).toFixed(1)}h
                  </p>
                </div>
                <div className="rounded-md bg-orange-50 px-3 py-1.5 text-center">
                  <p className="text-xs text-orange-600 font-medium">Billable</p>
                  <p className="text-sm font-bold text-orange-700">
                    {summary.excessHours.toFixed(1)}h
                  </p>
                </div>
                <div className="rounded-md bg-violet-50 px-3 py-1.5 text-center">
                  <p className="text-xs text-violet-600 font-medium">Courtesy</p>
                  <p className="text-sm font-bold text-violet-700">
                    {summary.courtesyHours.toFixed(1)}h
                  </p>
                </div>
              </div>

              {/* Fee */}
              {summary.estimatedExcessFee > 0 && (
                <div className="rounded-md bg-orange-50 border border-orange-100 px-3 py-1.5 shrink-0">
                  <p className="text-xs text-orange-700">
                    Estimated billable fee:{" "}
                    <span className="font-semibold">
                      {formatCurrency(summary.estimatedExcessFee)}
                    </span>
                    <span className="text-orange-500 ml-1">
                      ({formatCurrency(summary.excessRate)}/hr)
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Billings link */}
        <Link
          to={`/internal-billing/billings?clientId=${clientId}`}
          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 shrink-0 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          View Billings
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
