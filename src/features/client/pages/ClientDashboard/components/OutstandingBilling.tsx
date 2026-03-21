import { Receipt, Construction } from "lucide-react";

export default function OutstandingBilling() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <Receipt className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-primary">Outstanding Billing</h2>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
        <Construction className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-500">Under Construction</p>
        <p className="text-sm text-gray-400 mt-0.5">
          This section is coming soon
        </p>
      </div>
    </div>
  );
}
