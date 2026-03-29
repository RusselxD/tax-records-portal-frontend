import { uid } from "../../../../../../../lib/uid";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button, Dropdown } from "../../../../../../../components/common";
import type {
  BirTaxComplianceDetails,
  GrossSalesEntry,
  TaxpayerClassification,
} from "../../../../../../../types/client-info";
import { TAXPAYER_CLASSIFICATION_LABELS } from "../../../../../../common/components/client-info/enum-labels";
import DateFieldInput from "../DateFieldInput";

const TOP_WITHHOLDING_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

function classifyTaxpayer(
  grossSales: GrossSalesEntry[],
): TaxpayerClassification | null {
  if (grossSales.length === 0) return null;
  const mostRecent = [...grossSales].sort((a, b) => b.year - a.year)[0];
  if (mostRecent.amount === null) return null;
  const amount = mostRecent.amount;
  if (amount < 3_000_000) return "MICRO";
  if (amount < 20_000_000) return "SMALL";
  if (amount < 1_000_000_000) return "MEDIUM";
  return "LARGE";
}

interface BirTaxComplianceSubsectionProps {
  data: BirTaxComplianceDetails;
  onChange: (data: BirTaxComplianceDetails) => void;
}

export default function BirTaxComplianceSubsection({
  data,
  onChange,
}: BirTaxComplianceSubsectionProps) {
  const update = (fields: Partial<BirTaxComplianceDetails>) => {
    const next = { ...data, ...fields };
    // Recompute classification when gross sales change
    if ("grossSales" in fields) {
      next.taxpayerClassification = classifyTaxpayer(next.grossSales);
    }
    onChange(next);
  };

  const updateGrossSales = (
    index: number,
    fields: Partial<GrossSalesEntry>,
  ) => {
    const updated = data.grossSales.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    update({ grossSales: updated });
  };

  const addGrossSalesYear = () => {
    const lastYear =
      data.grossSales.length > 0
        ? data.grossSales[data.grossSales.length - 1].year
        : new Date().getFullYear() - 1;
    update({
      grossSales: [...data.grossSales, { _uid: uid(), year: lastYear + 1, amount: null }],
    });
  };

  const removeGrossSalesYear = (index: number) => {
    update({ grossSales: data.grossSales.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Gross Sales */}
      <div>
        <h4 className="text-sm font-medium text-primary mb-3">Gross Sales</h4>
        <div className="space-y-3">
          {data.grossSales.map((entry, index) => (
            <div key={entry._uid ?? index} className="flex items-end gap-3">
              <div className="grid flex-1 grid-cols-2 gap-4">
                <Input
                  label="Year"
                  type="number"
                  value={entry.year}
                  onChange={(e) =>
                    updateGrossSales(index, {
                      year: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  label="Amount"
                  type="number"
                  value={entry.amount ?? ""}
                  onChange={(e) =>
                    updateGrossSales(index, {
                      amount: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="₱0.00"
                />
              </div>
              <button
                type="button"
                onClick={() => removeGrossSalesYear(index)}
                className="mb-1 shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
                title="Remove year"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="secondary" onClick={addGrossSalesYear}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Year
          </Button>
        </div>
      </div>

      {/* Taxpayer Classification (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taxpayer Classification
        </label>
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-primary">
          {data.taxpayerClassification
            ? TAXPAYER_CLASSIFICATION_LABELS[data.taxpayerClassification] ?? data.taxpayerClassification
            : "—"}
        </div>
      </div>

      {/* Other fields */}
      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="Top Withholding"
          options={TOP_WITHHOLDING_OPTIONS}
          value={data.topWithholding === null ? "" : String(data.topWithholding)}
          onChange={(v) =>
            update({ topWithholding: v === "" ? null : v === "true" })
          }
          placeholder="Select"
          portal
        />
        <DateFieldInput
          label="Date Classified as Top Withholding"
          value={data.dateClassifiedTopWithholding}
          onChange={(v) => update({ dateClassifiedTopWithholding: v })}
        />
      </div>

      <Input
        label="Income Tax Regime"
        value={data.incomeTaxRegime ?? ""}
        onChange={(e) => update({ incomeTaxRegime: e.target.value || null })}
        placeholder="e.g. Regular, Optional Standard Deduction"
      />
    </div>
  );
}
