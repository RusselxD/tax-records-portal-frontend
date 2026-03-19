import type { BirTaxComplianceDetails } from "../../../../../../../types/client-info";
import { TAXPAYER_CLASSIFICATION_LABELS } from "../../../enum-labels";
import {
  TextDisplay,
  DateFieldDisplay,
  BooleanDisplay,
  EnumDisplay,
} from "../../../field-displays";

export default function BirTaxCompliancePreview({ data }: { data: BirTaxComplianceDetails }) {
  const hasGrossSales = data.grossSales.some((gs) => gs.amount !== null);
  const hasData = hasGrossSales ||
    data.taxpayerClassification ||
    data.topWithholding !== null ||
    data.dateClassifiedTopWithholding?.date ||
    data.incomeTaxRegime;

  if (!hasData) return null;

  return (
    <div className="space-y-4">
      {hasGrossSales && (
        <div>
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Gross Sales
          </span>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Year
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.grossSales
                  .filter((gs) => gs.amount !== null)
                  .map((gs, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                    >
                      <td className="px-4 py-2.5 text-sm text-primary font-medium">
                        {gs.year}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-primary">
                        {gs.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <EnumDisplay
          label="Taxpayer Classification"
          value={data.taxpayerClassification}
          labels={TAXPAYER_CLASSIFICATION_LABELS}
        />
        <BooleanDisplay label="Top Withholding Agent" value={data.topWithholding} />
        <DateFieldDisplay
          label="Date Classified as Top Withholding"
          value={data.dateClassifiedTopWithholding}
        />
        <TextDisplay label="Income Tax Regime" value={data.incomeTaxRegime} />
      </div>
    </div>
  );
}
