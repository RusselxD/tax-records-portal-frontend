import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { X } from "lucide-react";
import type { RichTextContent } from "../../types/client-info";
import { getPreviewExtensions } from "./tiptap-extensions";

interface CommentPreviewProps {
  content: RichTextContent;
  className?: string;
}

function hasContent(value: RichTextContent | null | undefined): boolean {
  if (!value) return false;
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

export default function CommentPreview({ content, className = "" }: CommentPreviewProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }, []);

  const editor = useEditor({
    extensions: getPreviewExtensions(),
    content: content || { type: "doc", content: [] },
    editable: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none text-primary text-sm leading-relaxed ${className}`,
      },
    },
  });

  if (!hasContent(content) || !editor) return null;

  return (
    <>
      <div onClick={handleClick}>
        <EditorContent editor={editor} />
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxSrc}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
