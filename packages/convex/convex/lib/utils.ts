export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractTextFromTipTap(content: any): string {
  if (!content) return "";

  const extractText = (node: any): string => {
    if (typeof node === "string") return node;
    if (node.text) return node.text;
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join(" ");
    }
    return "";
  };

  if (content.content && Array.isArray(content.content)) {
    return content.content.map(extractText).join(" ");
  }
  return "";
}

export function calculateReadTime(content: any): number {
  const WORDS_PER_MINUTE = 200;
  const text = extractTextFromTipTap(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
