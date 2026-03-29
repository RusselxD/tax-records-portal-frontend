import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { Extensions } from "@tiptap/react";

const linkHTMLAttributes = {
  class: "text-accent underline cursor-pointer",
  target: "_blank",
  rel: "noopener noreferrer",
};

/** Extensions for the editable CommentEditor (images hidden — shown as thumbnails below). */
export function getEditorExtensions(): Extensions {
  return [
    StarterKit.configure({ link: false }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: linkHTMLAttributes,
    }),
    Image.configure({
      HTMLAttributes: { style: "display:none" },
    }),
  ];
}

/** Extensions for the read-only CommentPreview (images rendered inline). */
export function getPreviewExtensions(): Extensions {
  return [
    StarterKit.configure({ link: false }),
    Link.configure({
      openOnClick: true,
      HTMLAttributes: linkHTMLAttributes,
    }),
    Image.configure({
      HTMLAttributes: {
        class:
          "max-w-[300px] max-h-[200px] object-contain rounded border border-gray-200 cursor-pointer",
      },
    }),
  ];
}
