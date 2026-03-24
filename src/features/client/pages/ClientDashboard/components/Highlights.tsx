import { Loader2, Sparkles } from "lucide-react";
import type { ClientNoticeResponse } from "../../../../../types/client";

interface HighlightsProps {
  highlights: ClientNoticeResponse[];
  isLoading: boolean;
}

export default function Highlights({ highlights, isLoading }: HighlightsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <Sparkles className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-primary">Highlights</h2>
      </div>

      <div className="overflow-y-auto flex-1 flex flex-col">
        {isLoading && (
          <div className="flex items-center justify-center px-5 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && highlights.length === 0 && (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center flex-1">
            <Sparkles className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">No highlights</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Important updates will appear here
            </p>
          </div>
        )}

        {!isLoading && highlights.length > 0 && (
          <div className="divide-y divide-gray-100">
            {highlights.map((notice) => (
              <div key={notice.id} className="flex items-start gap-3 px-5 py-3">
                <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                <p className="text-sm text-primary leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
