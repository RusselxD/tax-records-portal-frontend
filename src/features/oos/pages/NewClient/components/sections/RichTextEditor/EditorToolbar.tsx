import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImagePlus,
  Loader2,
  Undo,
  Redo,
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";
import LinkPopover from "./LinkPopover";

interface EditorToolbarProps {
  editor: Editor;
  isUploadingImage: boolean;
  onImageClick: () => void;
}

const ICON = "h-4 w-4";

export default function EditorToolbar({
  editor,
  isUploadingImage,
  onImageClick,
}: EditorToolbarProps) {
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  return (
    <div className="flex items-center gap-0.5 border-b border-gray-200 px-2 py-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className={ICON} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className={ICON} />
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className={ICON} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered className={ICON} />
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <div className="relative">
        <ToolbarButton
          onClick={() => setShowLinkPopover((prev) => !prev)}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon className={ICON} />
        </ToolbarButton>
        {showLinkPopover && (
          <LinkPopover
            initialUrl={editor.getAttributes("link").href ?? ""}
            hasSelection={!editor.state.selection.empty}
            onSubmit={(url, text) => {
              if (text) {
                // No selection — insert new text with link
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "text",
                    marks: [{ type: "link", attrs: { href: url } }],
                    text,
                  })
                  .run();
              } else {
                // Selection exists — wrap it with link
                editor.chain().focus().setLink({ href: url }).run();
              }
              setShowLinkPopover(false);
            }}
            onRemove={() => {
              editor.chain().focus().unsetLink().run();
              setShowLinkPopover(false);
            }}
            onClose={() => setShowLinkPopover(false)}
          />
        )}
      </div>
      <ToolbarButton
        onClick={onImageClick}
        disabled={isUploadingImage}
        title="Upload Image"
      >
        {isUploadingImage ? (
          <Loader2 className={`${ICON} animate-spin`} />
        ) : (
          <ImagePlus className={ICON} />
        )}
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className={ICON} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className={ICON} />
      </ToolbarButton>
    </div>
  );
}
