import MultiFileDropZone from "../../../../../../components/common/MultiFileDropZone";
import type { FileReference } from "../../../../../../types/client-info";
import { useNewClient } from "../../context/NewClientContext";

interface MultiFileUploadInputProps {
  label: string;
  value: FileReference[];
  onChange: (value: FileReference[]) => void;
}

export default function MultiFileUploadInput({
  label,
  value,
  onChange,
}: MultiFileUploadInputProps) {
  const { uploadFile } = useNewClient();
  return (
    <MultiFileDropZone
      label={label}
      value={value}
      onChange={onChange}
      uploadFile={uploadFile}
    />
  );
}
