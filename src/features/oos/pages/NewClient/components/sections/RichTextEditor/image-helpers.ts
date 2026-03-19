import type { RichTextContent } from "../../../../../../../types/client-info";

export interface ExtractedImage {
  src: string;
  alt: string;
  fileId: string | null;
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function extractImages(json: RichTextContent | null | undefined): ExtractedImage[] {
  if (!json) return [];
  const images: ExtractedImage[] = [];
  function walk(nodes: Record<string, unknown>[] | undefined) {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === "image") {
        const attrs = node.attrs as
          | { src?: string; alt?: string; title?: string }
          | undefined;
        if (attrs?.src) {
          images.push({
            src: attrs.src,
            alt: attrs.alt ?? "",
            fileId: attrs.title ?? null,
          });
        }
      }
      if (Array.isArray(node.content)) {
        walk(node.content as Record<string, unknown>[]);
      }
    }
  }
  walk(json.content);
  return images;
}

export function removeImageFromJson(
  json: RichTextContent,
  src: string,
): RichTextContent {
  function filterNodes(
    nodes: Record<string, unknown>[] | undefined,
  ): Record<string, unknown>[] {
    if (!nodes) return [];
    return nodes
      .filter((node) => {
        if (node.type === "image") {
          const attrs = node.attrs as { src?: string } | undefined;
          return attrs?.src !== src;
        }
        return true;
      })
      .map((node) => {
        if (Array.isArray(node.content)) {
          return {
            ...node,
            content: filterNodes(
              node.content as Record<string, unknown>[],
            ),
          };
        }
        return node;
      });
  }
  return { ...json, content: filterNodes(json.content) };
}
