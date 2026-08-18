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

/**
 * Insere a imagem editorial no corpo do artigo.
 *
 * Entra como nó `image` do próprio documento, e não como bloco à parte, para o
 * índice lateral e os ids dos títulos continuarem a ser calculados sobre um só
 * documento. O sítio é antes do segundo título de nível 2, que é onde já há
 * texto suficiente para a imagem ilustrar alguma coisa e ainda falta artigo
 * para ela não ficar colada ao fim.
 */
export function withEditorialImage(
  tiptapContent: any,
  image: { src: string; alt?: string; caption?: string },
): any {
  const doc = tiptapContent as TipTapDocument | null;
  if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) {
    return tiptapContent;
  }
  // Um artigo que já traga imagens não precisa de mais uma a meio.
  if (doc.content.some((node) => node?.type === "image")) return tiptapContent;

  const headings = doc.content
    .map((node, index) => ({ node, index }))
    .filter(({ node }) => node?.type === "heading" && (node.attrs?.level ?? 2) === 2);

  const at =
    headings.length >= 2
      ? headings[1]!.index
      : Math.min(
          Math.max(2, Math.round(doc.content.length * 0.4)),
          doc.content.length,
        );

  const node: TipTapNode = {
    type: "image",
    attrs: {
      src: image.src,
      alt: image.alt ?? "",
      // O ImageNode desenha o attrs.title como legenda por baixo da figura.
      title: image.caption ?? null,
    },
  };

  return {
    ...doc,
    content: [...doc.content.slice(0, at), node, ...doc.content.slice(at)],
  };
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
