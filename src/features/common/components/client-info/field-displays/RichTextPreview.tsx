import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
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
    // Image nodes have no content array — they use attrs
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

export default function RichTextPreview({ label, value, fullWidth = true }: RichTextPreviewProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-accent underline cursor-pointer", target: "_blank", rel: "noopener noreferrer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-[300px] max-h-[200px] object-contain rounded border border-gray-200" },
      }),
    ],
    content: value || { type: "doc", content: [] },
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none text-primary",
      },
    },
  });

  if (!hasContent(value) || !editor) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <EditorContent editor={editor} />
    </DisplayField>
  );
}
