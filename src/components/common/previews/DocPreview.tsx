import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface DocPreviewProps {
  fileUrl: string;
}

export default function DocPreview({ fileUrl }: DocPreviewProps) {
  return (
    <div className="flex-1 overflow-auto flex items-center justify-center pb-6 px-4 scrollbar-dark">
      <div data-preview-content className="bg-white rounded-lg w-full max-w-5xl h-full overflow-auto">
        <DocViewer
          documents={[{
            uri: fileUrl,
            fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }]}
          pluginRenderers={DocViewerRenderers}
          config={{ header: { disableHeader: true } }}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
