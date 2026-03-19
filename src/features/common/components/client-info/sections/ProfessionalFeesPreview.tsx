import type { ProfessionalFeeEntry } from "../../../../../types/client-info";

function feeHasData(entry: ProfessionalFeeEntry): boolean {
  return !!(entry.serviceName || entry.fee);
}

export default function ProfessionalFeesPreview({ data }: { data: ProfessionalFeeEntry[] }) {
  const filled = data.filter(feeHasData);
  if (filled.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-gray-200">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                Service Name
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                Fee
              </th>
            </tr>
          </thead>
          <tbody>
            {filled.map((entry, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
              >
                <td className="px-4 py-2.5 text-sm text-primary font-medium">
                  {entry.serviceName}
                </td>
                <td className="px-4 py-2.5 text-sm text-primary">
                  {entry.fee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
