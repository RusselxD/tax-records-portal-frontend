import { useRef, useState, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { X } from "lucide-react";
import type { RichTextContent } from "../../types/client-info";
import { fileAPI } from "../../api/file";
import { resolveAssetUrl } from "../../lib/formatters";
import { useToast } from "../../contexts/ToastContext";
import { validateImageFile } from "../../lib/file-validation";
import { getEditorExtensions } from "./tiptap-extensions";
import CommentEditorToolbar from "./CommentEditorToolbar";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

interface CommentEditorProps {
  value: RichTextContent;
  onChange: (value: RichTextContent) => void;
  placeholder?: string;
  minHeight?: string;
}

function extractImages(doc: RichTextContent): { src: string; alt: string; fileId: string | null }[] {
  const images: { src: string; alt: string; fileId: string | null }[] = [];
  function walk(nodes: Record<string, unknown>[] | undefined) {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === "image") {
        const attrs = node.attrs as { src?: string; alt?: string; title?: string } | undefined;
        images.push({
          src: attrs?.src ?? "",
          alt: attrs?.alt ?? "",
          fileId: attrs?.title ?? null,
        });
      }
      if (Array.isArray(node.content)) walk(node.content as Record<string, unknown>[]);
    }
  }
  walk(doc.content);
  return images;
}

function removeImageFromJson(doc: RichTextContent, src: string): RichTextContent {
  function filterNodes(nodes: Record<string, unknown>[]): Record<string, unknown>[] {
    return nodes
      .filter((n) => !(n.type === "image" && (n.attrs as { src?: string })?.src === src))
      .map((n) => (Array.isArray(n.content) ? { ...n, content: filterNodes(n.content as Record<string, unknown>[]) } : n));
  }
  return { ...doc, content: filterNodes(doc.content ?? []) };
}

/** Delete all images embedded in a rich text document. Call on discard/cancel. */
export function cleanupCommentImages(doc: RichTextContent) {
  const images = extractImages(doc);
  for (const img of images) {
    if (img.fileId) {
      fileAPI.deleteImage(img.fileId).catch(() => {});
    }
  }
}

export default function CommentEditor({
  value,
  onChange,
  placeholder = "Add a comment...",
  minHeight = "80px",
}: CommentEditorProps) {
  const { toastError } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const latestValue = useRef(value);
  latestValue.current = value;

  const editor = useEditor({
    extensions: [
      ...getEditorExtensions(),
      Placeholder.configure({ placeholder }),
    ],
    content: value || EMPTY_DOC,
    onUpdate: ({ editor: e }) => {
      const json = e.getJSON() as RichTextContent;
      latestValue.current = json;
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none px-3 py-2.5 focus:outline-none text-primary text-sm leading-relaxed`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  const images = useMemo(() => (value ? extractImages(value) : []), [value]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageInputRef.current) imageInputRef.current.value = "";

    const result = validateImageFile(file);
    if (!result.valid) {
      toastError(result.error!);
      return;
    }

    setIsUploadingImage(true);
    try {
      const { id, url } = await fileAPI.uploadImage(file);
      const resolvedUrl = resolveAssetUrl(url) ?? url;
      editor
        .chain()
        .focus()
        .setImage({ src: resolvedUrl, alt: file.name, title: id })
        .run();
    } catch {
      // Upload failed — silently ignore
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async (src: string, fileId: string | null) => {
    if (fileId) {
      try { await fileAPI.deleteImage(fileId); } catch { /* ignore */ }
    }
    const updated = removeImageFromJson(latestValue.current, src);
    onChange(updated);
    editor.commands.setContent(updated);
  };

  return (
    <div>
      <div className="rounded-md border border-gray-300 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-colors">
        <CommentEditorToolbar
          editor={editor}
          isUploadingImage={isUploadingImage}
          onImageUploadClick={() => imageInputRef.current?.click()}
        />
        <EditorContent editor={editor} />
      </div>

      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group rounded-md border border-gray-200 overflow-hidden bg-gray-50"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="block max-w-[200px] max-h-[150px] object-contain cursor-pointer"
                onClick={() => setLightboxSrc(img.src)}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.src, img.fileId)}
                className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

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

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
