import { useState, useEffect } from "react";
import { read, utils, type WorkBook } from "xlsx";
import { Loader2 } from "lucide-react";
import Alert from "../Alert";

interface SpreadsheetPreviewProps {
  fileUrl: string;
}

interface SheetData {
  name: string;
  headers: string[];
  rows: string[][];
}

function parseWorkbook(wb: WorkBook): SheetData[] {
  return wb.SheetNames.map((name) => {
    const sheet = wb.Sheets[name];
    const json = utils.sheet_to_json<string[]>(sheet, { header: 1, defval: "" });
    const headers = json[0] ?? [];
    const rows = json.slice(1);
    return { name, headers, rows };
  });
}

export default function SpreadsheetPreview({ fileUrl }: SpreadsheetPreviewProps) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(fileUrl);
        const buffer = await response.arrayBuffer();
        const wb = read(buffer, { type: "array" });
        if (!cancelled) {
          setSheets(parseWorkbook(wb));
        }
      } catch {
        if (!cancelled) setError("Failed to parse spreadsheet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Parsing spreadsheet...</p>
      </div>
    );
  }

  if (error || sheets.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 p-4">
        <Alert variant="error">{error ?? "No data found in spreadsheet."}</Alert>
      </div>
    );
  }

  const sheet = sheets[activeSheet];

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-6 px-4">
      {/* Sheet tabs */}
      {sheets.length > 1 && (
        <div className="flex items-center gap-1 px-2 py-2 shrink-0">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveSheet(i)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                i === activeSheet
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div
        data-preview-content
        className="flex-1 overflow-auto rounded-lg bg-white scrollbar-dark"
      >
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="bg-gray-100 border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-400 text-center w-10">
                #
              </th>
              {sheet.headers.map((h, i) => (
                <th
                  key={i}
                  className="bg-gray-100 border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-primary whitespace-nowrap"
                >
                  {h || `Col ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-blue-50/50">
                <td className="border border-gray-200 px-3 py-1.5 text-xs text-gray-400 text-center bg-gray-50/50">
                  {rowIdx + 1}
                </td>
                {sheet.headers.map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-gray-200 px-3 py-1.5 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {row[colIdx] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
