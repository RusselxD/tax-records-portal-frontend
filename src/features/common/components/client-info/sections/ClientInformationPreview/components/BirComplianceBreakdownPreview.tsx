import type { BirComplianceBreakdown } from "../../../../../../../types/client-info";
import { TextDisplay } from "../../../field-displays";

export default function BirComplianceBreakdownPreview({ data }: { data: BirComplianceBreakdown }) {
  const applicableItems = data.items.filter((item) => item.applicable);
  const hasData = applicableItems.length > 0 || !!data.othersSpecify;

  if (!hasData) return null;

  return (
    <div className="space-y-4">
      {applicableItems.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                  Tax Return Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                  Deadline
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {applicableItems.map((item, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                >
                  <td className="px-4 py-2.5 text-sm text-primary font-medium">
                    {item.category}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-primary">
                    {item.taxReturnName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-primary">
                    {item.deadline}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-primary">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TextDisplay label="Others (Specify)" value={data.othersSpecify} />
    </div>
  );
}
