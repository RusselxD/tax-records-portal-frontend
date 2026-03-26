import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { X } from "lucide-react";
import type { RichTextContent } from "../../../../../types/client-info";
import DisplayField from "./DisplayField";

interface RichTextPreviewProps {
  label: string;
  value: RichTextContent | null | undefined;
  fullWidth?: boolean;
}

function hasContent(value: RichTextContent | null | undefined): boolean {
  if (!value) return false;
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

export default function RichTextPreview({ label, value, fullWidth = true }: RichTextPreviewProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-accent underline cursor-pointer", target: "_blank", rel: "noopener noreferrer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-[300px] max-h-[200px] object-contain rounded border border-gray-200 cursor-pointer" },
      }),
    ],
    content: value || { type: "doc", content: [] },
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none text-primary text-[13px] leading-relaxed",
      },
    },
  });

  if (!hasContent(value) || !editor) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
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
    </DisplayField>
  );
}
