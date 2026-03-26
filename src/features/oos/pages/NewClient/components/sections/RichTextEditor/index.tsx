import { useRef, useState, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { X } from "lucide-react";
import type { RichTextContent } from "../../../../../../../types/client-info";
import { fileAPI } from "../../../../../../../api/file";
import { useNewClient } from "../../../context/NewClientContext";
import EditorToolbar from "./EditorToolbar";
import {
  extractImages,
  removeImageFromJson,
  readAsDataUrl,
} from "./image-helpers";

interface RichTextEditorProps {
  label: string;
  description?: React.ReactNode;
  value: RichTextContent;
  onChange: (value: RichTextContent) => void;
  placeholder?: string;
}

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

export default function RichTextEditor({
  label,
  description,
  value,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const { uploadFile } = useNewClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const latestValue = useRef(value);
  latestValue.current = value;
  // Flag to distinguish intentional image removal (X button) from keyboard deletion
  const intentionalRemoval = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: { style: "display:none" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || EMPTY_DOC,
    onUpdate: ({ editor: e }) => {
      const json = e.getJSON() as RichTextContent;

      // Prevent accidental image deletion via keyboard
      if (!intentionalRemoval.current) {
        const prevImages = extractImages(latestValue.current);
        const nextImages = extractImages(json);
        if (prevImages.length > nextImages.length) {
          // Images were removed — restore them by re-injecting into the JSON
          const removedImages = prevImages.filter(
            (prev) => !nextImages.some((next) => next.src === prev.src),
          );
          const imageNodes = removedImages.map((img) => ({
            type: "image" as const,
            attrs: { src: img.src, alt: img.alt, title: img.fileId },
          }));
          const restored: RichTextContent = {
            ...json,
            content: [...(json.content ?? []), ...imageNodes],
          };
          latestValue.current = restored;
          onChange(restored);
          e.commands.setContent(restored, { emitUpdate: false });
          return;
        }
      }
      intentionalRemoval.current = false;

      latestValue.current = json;
      onChange(json);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none px-3 py-2.5 min-h-[120px] focus:outline-none text-primary text-[13px] leading-relaxed",
      },
    },
  });

  const images = useMemo(() => (value ? extractImages(value) : []), [value]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!editor) return null;

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageInputRef.current) imageInputRef.current.value = "";

    setIsUploadingImage(true);
    try {
      const ref = await uploadFile(file);
      const dataUrl = await readAsDataUrl(file);
      editor
        .chain()
        .focus()
        .setImage({ src: dataUrl, alt: file.name, title: ref.id })
        .run();
    } catch {
      // Upload failed — silently ignore, user can retry
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async (src: string, fileId: string | null) => {
    if (fileId) {
      try {
        await fileAPI.delete(fileId);
      } catch {
        // Deletion failed — still remove from editor
      }
    }
    intentionalRemoval.current = true;
    const updated = removeImageFromJson(latestValue.current, src);
    onChange(updated);
    editor.commands.setContent(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {description && (
        <div className="text-xs text-gray-500 leading-relaxed mb-2">{description}</div>
      )}
      <div className="rounded-md border border-gray-300 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-colors">
        <EditorToolbar
          editor={editor}
          isUploadingImage={isUploadingImage}
          onImageClick={() => imageInputRef.current?.click()}
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
