import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  ImagePlus,
  Loader2,
} from "lucide-react";

const IC = "h-3.5 w-3.5";

function ToolbarBtn({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1 rounded transition-colors ${
        disabled
          ? "text-gray-300 cursor-not-allowed"
          : isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

interface CommentEditorToolbarProps {
  editor: Editor;
  isUploadingImage: boolean;
  onImageUploadClick: () => void;
}

export default function CommentEditorToolbar({
  editor,
  isUploadingImage,
  onImageUploadClick,
}: CommentEditorToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleLinkSubmit = () => {
    let trimmed = linkUrl.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) trimmed = `https://${trimmed}`;

    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          marks: [{ type: "link", attrs: { href: trimmed } }],
          text: trimmed,
        })
        .run();
    } else {
      editor.chain().focus().setLink({ href: trimmed }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  };

  return (
    <div className="flex items-center gap-0.5 border-b border-gray-200 px-2 py-1">
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className={IC} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className={IC} />
      </ToolbarBtn>
      <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className={IC} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered className={IC} />
      </ToolbarBtn>
      <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
      {editor.isActive("link") ? (
        <ToolbarBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          isActive
          title="Remove Link"
        >
          <Unlink className={IC} />
        </ToolbarBtn>
      ) : (
        <div className="relative">
          <ToolbarBtn
            onClick={() => {
              setShowLinkInput((v) => !v);
              setTimeout(() => linkInputRef.current?.focus(), 50);
            }}
            title="Insert Link"
          >
            <LinkIcon className={IC} />
          </ToolbarBtn>
          {showLinkInput && (
            <div className="absolute left-0 top-full mt-1.5 z-10 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white shadow-lg p-2">
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkSubmit();
                  if (e.key === "Escape") {
                    setShowLinkInput(false);
                    setLinkUrl("");
                  }
                  e.stopPropagation();
                }}
                placeholder="https://..."
                className="w-52 rounded border border-gray-300 px-2 py-1 text-xs text-primary focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                disabled={!linkUrl.trim()}
                className="px-2 py-1 text-xs font-medium text-white bg-accent hover:bg-accent-hover rounded disabled:opacity-40 transition-colors"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <ToolbarBtn
        onClick={onImageUploadClick}
        disabled={isUploadingImage}
        title="Upload Image"
      >
        {isUploadingImage ? (
          <Loader2 className={`${IC} animate-spin`} />
        ) : (
          <ImagePlus className={IC} />
        )}
      </ToolbarBtn>
    </div>
  );
}
