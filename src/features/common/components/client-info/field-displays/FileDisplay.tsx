import { useState } from "react";
import { FilePreviewOverlay } from "../../../../../components/common";
import FileRow from "../../../../../components/common/FileRow";
import type { FileReference } from "../../../../../types/client-info";
import DisplayField from "./DisplayField";

interface FileDisplayProps {
  label: string;
  value: FileReference | FileReference[] | null | undefined;
  fullWidth?: boolean;
}

export default function FileDisplay({ label, value, fullWidth }: FileDisplayProps) {
  const files = normalizeFiles(value);
  const [previewFile, setPreviewFile] = useState<FileReference | null>(null);

  if (files.length === 0) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <div className="space-y-1.5">
        {files.map((file) => (
          <FileRow key={file.id} name={file.name} onClick={() => setPreviewFile(file)} />
        ))}
      </div>

      {previewFile && (
        <FilePreviewOverlay
          fileId={previewFile.id}
          fileName={previewFile.name}
          setModalOpen={() => setPreviewFile(null)}
        />
      )}
    </DisplayField>
  );
}

function normalizeFiles(value: FileReference | FileReference[] | null | undefined): FileReference[] {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}
