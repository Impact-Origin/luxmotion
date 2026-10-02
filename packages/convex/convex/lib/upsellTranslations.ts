import type { QueryCtx } from "../_generated/server";

export function plainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const node = value as { text?: string; content?: unknown[]; type?: string };
  if (node.text) return node.text;
  const text = (node.content ?? []).map(plainText).join("");
  return ["paragraph", "heading"].includes(node.type ?? "")
    ? `${text}\n`
    : text;
}

/** Recover translations retained in tours after the upsell migration. Only an
 * unambiguous match in the original category may supply a translation. */
export async function legacyUpsellTranslations(
  ctx: QueryCtx,
  title: string,
  category: "stops" | "experiences",
) {
  const matches = await ctx.db
    .query("tours")
    .withIndex("by_category", (q) => q.eq("category", category))
    .filter((q) => q.eq(q.field("title"), title))
    .collect();
  if (matches.length !== 1) return [];
  const translations = await ctx.db
    .query("tourTranslations")
    .withIndex("by_tour", (q) => q.eq("tourId", matches[0]!._id))
    .collect();
  return translations.map((entry) => ({
    locale: entry.locale,
    title: entry.title,
    description: entry.subtitle?.trim() || plainText(entry.description).trim(),
  }));
}
