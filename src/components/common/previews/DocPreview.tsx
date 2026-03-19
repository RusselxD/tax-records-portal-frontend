import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface DocPreviewProps {
  fileUrl: string;
  fileType: "word" | "excel";
}

const MIME_TYPES: Record<string, string> = {
  word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  excel:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export default function DocPreview({ fileUrl, fileType }: DocPreviewProps) {
  return (
    <div className="flex-1 overflow-auto flex items-center justify-center pb-6 px-4 scrollbar-dark">
      <div data-preview-content className="bg-white rounded-lg w-full max-w-5xl h-full overflow-auto">
        <DocViewer
          documents={[{ uri: fileUrl, fileType: MIME_TYPES[fileType] }]}
          pluginRenderers={DocViewerRenderers}
          config={{ header: { disableHeader: true } }}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
