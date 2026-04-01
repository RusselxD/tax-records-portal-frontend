import { useState, useEffect, useCallback } from "react";
import { Loader2, Settings, Pencil, Check, X } from "lucide-react";
import { consultationAPI } from "../../../../../api/consultation";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatCurrency } from "../../../../../lib/formatters";
import { useToast } from "../../../../../contexts/ToastContext";
import { SidebarCard } from "../../../components/client-info";

interface ConsultationConfigCardProps {
  clientId: string;
}

export default function ConsultationConfigCard({ clientId }: ConsultationConfigCardProps) {
  const { toastSuccess, toastError } = useToast();

  const [includedHours, setIncludedHours] = useState<number | null>(null);
  const [excessRate, setExcessRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editHours, setEditHours] = useState("");
  const [editRate, setEditRate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await consultationAPI.getConfig(clientId);
      setIncludedHours(data.includedHours);
      setExcessRate(data.excessRate);
      setNotConfigured(false);
    } catch {
      setNotConfigured(true);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleStartEdit = () => {
    setEditHours(includedHours != null ? String(includedHours) : "");
    setEditRate(excessRate != null ? String(excessRate) : "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    const hours = parseFloat(editHours);
    const rate = parseFloat(editRate);
    if (isNaN(hours) || isNaN(rate)) return;

    setIsSaving(true);
    try {
      const data = await consultationAPI.upsertConfig(clientId, { includedHours: hours, excessRate: rate });
      setIncludedHours(data.includedHours);
      setExcessRate(data.excessRate);
      setNotConfigured(false);
      setIsEditing(false);
      toastSuccess("Config Saved", "Consultation config updated.");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to save config."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarCard title="Consultation Config">
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : isEditing ? (
        <div className="px-4 py-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Included Hours / Month</label>
            <input
              type="number"
              value={editHours}
              onChange={(e) => setEditHours(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Excess Rate (per hour)</label>
            <input
              type="number"
              value={editRate}
              onChange={(e) => setEditRate(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !editHours || !editRate}
              className="p-2 rounded-md text-white bg-accent hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : notConfigured ? (
        <div className="px-4 py-6 text-center">
          <Settings className="h-5 w-5 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-3">Not configured</p>
          <button
            onClick={() => { setEditHours(""); setEditRate(""); setIsEditing(true); }}
            className="text-sm text-accent hover:text-accent-hover font-medium"
          >
            Configure
          </button>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">Included Hours</p>
              <p className="text-sm font-medium text-primary">{includedHours?.toFixed(2)}h / month</p>
            </div>
            <button onClick={handleStartEdit} className="p-2 text-gray-400 hover:text-accent transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-xs text-gray-400">Excess Rate</p>
            <p className="text-sm font-medium text-primary">{formatCurrency(excessRate ?? 0)} / hr</p>
          </div>
        </div>
      )}
    </SidebarCard>
  );
}
