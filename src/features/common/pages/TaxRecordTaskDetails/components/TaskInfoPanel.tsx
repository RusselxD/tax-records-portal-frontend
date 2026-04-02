import { InfoField } from "../../../../../components/common";
import { formatDate } from "../../../../../lib/formatters";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import { periodLabels } from "../../../../../constants/tax-record-task";

export default function TaskInfoPanel() {
  const { task } = useTaxRecordTaskDetails();

  if (!task) return null;

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-primary mb-4">Task Information</h2>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        <InfoField label="Client" value={task.clientDisplayName} />
        <InfoField label="Category" value={task.categoryName} />
        <InfoField label="Sub Category" value={task.subCategoryName} />
        <InfoField label="Task Name" value={task.taskName} />
        <InfoField
          label="Period"
          value={`${task.year} — ${periodLabels[task.period] || task.period}`}
        />
        <InfoField label="Deadline" value={formatDate(task.deadline)} />
        <InfoField label="Assigned To" value={task.assignedTo.join(", ")} />
        <InfoField label="Created By" value={task.createdBy} />
        <InfoField label="Created" value={formatDate(task.createdAt)} />
      </dl>

      {task.description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Description
          </dt>
          <dd className="mt-1 text-sm text-gray-700 leading-relaxed">
            {task.description}
          </dd>
        </div>
      )}
    </div>
  );
}
