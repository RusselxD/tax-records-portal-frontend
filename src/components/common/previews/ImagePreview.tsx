interface ImagePreviewProps {
  fileUrl: string;
  fileName: string;
}

export default function ImagePreview({ fileUrl, fileName }: ImagePreviewProps) {
  return (
    <div className="flex-1 overflow-auto flex items-center justify-center p-6 scrollbar-dark">
      <div data-preview-content>
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[calc(100dvh-8rem)] object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
