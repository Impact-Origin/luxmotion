import type { ContentBlock } from "@/components/blogs/blog-article-content";

interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}

export function tiptapToContentBlocks(tiptapContent: any): ContentBlock[] {
  if (!tiptapContent) {
    return [];
  }

  const doc = tiptapContent as TipTapDocument;

  if (doc.type !== "doc" || !doc.content) {
    return [];
  }

  return [
    {
      type: "richText",
      node: doc,
    },
  ];
}

export function contentBlocksToTiptap(blocks: ContentBlock[]): TipTapDocument {
  const content: TipTapNode[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: block.content }],
        });
        break;
      case "heading":
        content.push({
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: block.content }],
        });
        break;
      case "subheading":
        content.push({
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: block.content }],
        });
        break;
      case "list":
        content.push({
          type: "bulletList",
          content: block.items.map((item) => ({
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: item }],
              },
            ],
          })),
        });
        break;
      case "image":
        content.push({
          type: "image",
          attrs: { src: block.src, alt: block.alt },
        });
        break;
      case "richText":
        if (block.node.content) {
          content.push(...block.node.content);
        }
        break;
    }
  }

  return {
    type: "doc",
    content,
  };
}

export function getReadingTime(tiptapContent: any): number {
  if (!tiptapContent) return 1;

  const extractAllText = (node: any): string => {
    if (typeof node === "string") return node;
    if (node.text) return node.text;
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractAllText).join(" ");
    }
    return "";
  };

  const text = extractAllText(tiptapContent);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const WORDS_PER_MINUTE = 200;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
