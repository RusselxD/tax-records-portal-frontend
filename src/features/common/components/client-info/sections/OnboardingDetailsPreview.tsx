import type {
  OnboardingDetails,
  PendingActionItem,
} from "../../../../../types/client-info";
import { CollapsibleSubsection } from "../../../../../components/common";
import { TextDisplay, DateFieldDisplay } from "../field-displays";

function actionItemHasData(item: PendingActionItem): boolean {
  return !!(item.particulars || item.notes);
}

export default function OnboardingDetailsPreview({ data }: { data: OnboardingDetails }) {
  const hasGroupChat = !!(
    data.nameOfGroupChat ||
    data.platformUsed ||
    data.gcCreatedBy ||
    data.gcCreatedDate?.date
  );
  const hasActionItems = data.pendingActionItems.some(actionItemHasData);

  if (!hasGroupChat && !hasActionItems) return null;

  return (
    <div className="space-y-3">
      {hasGroupChat && (
        <CollapsibleSubsection title="Group Chat Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <TextDisplay label="Name of Group Chat" value={data.nameOfGroupChat} />
            <TextDisplay label="Platform Used" value={data.platformUsed} />
            <TextDisplay label="Created By" value={data.gcCreatedBy} />
            <DateFieldDisplay label="Created Date" value={data.gcCreatedDate} />
          </div>
        </CollapsibleSubsection>
      )}

      {hasActionItems && (
        <CollapsibleSubsection title="Pending Action Items">
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Particulars
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.pendingActionItems.filter(actionItemHasData).map((item, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                  >
                    <td className="px-4 py-2.5 text-sm text-primary">
                      {item.particulars}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-primary">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSubsection>
      )}
    </div>
  );
}
