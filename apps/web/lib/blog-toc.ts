import type { ContentBlock } from "@/components/blogs/blog-article-content"

export interface TocItem {
  id: string
  title: string
}

export function slugifyHeading(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
  return base ? `toc-${base}` : "toc-section"
}

function inlineText(nodes: any[] | undefined): string {
  if (!nodes) return ""
  let out = ""
  for (const n of nodes) {
    if (!n) continue
    if (n.type === "text" && typeof n.text === "string") {
      out += n.text
    } else if (Array.isArray(n.content)) {
      out += inlineText(n.content)
    }
  }
  return out
}

export function extractTocItems(blocks: ContentBlock[] | undefined): TocItem[] {
  if (!blocks || blocks.length === 0) return []

  const items: TocItem[] = []
  const seen = new Set<string>()

  const push = (raw: string) => {
    const trimmed = raw.replace(/\s+/g, " ").trim()
    if (!trimmed) return
    const baseId = slugifyHeading(trimmed)
    let id = baseId
    let counter = 2
    while (seen.has(id)) {
      id = `${baseId}-${counter++}`
    }
    seen.add(id)
    items.push({ id, title: trimmed })
  }

  for (const block of blocks) {
    if (block.type === "heading") {
      push(block.content)
    } else if (block.type === "subheading") {
      push(block.content)
    } else if (block.type === "richText") {
      const doc = block.node
      if (doc?.content) {
        for (const child of doc.content) {
          if (child.type === "heading") {
            const level = child.attrs?.level ?? 2
            if (level <= 3) {
              push(inlineText(child.content))
            }
          }
        }
      }
    }
  }

  return items
}
