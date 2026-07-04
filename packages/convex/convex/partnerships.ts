import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { pagedArgs, paginate, applySearch, applySort } from "./lib/pagination";

const landingTemplateValidator = v.optional(
  v.union(
    v.literal("transfer"),
    v.literal("whitelabel"),
    v.literal("wedding-whitelabel"),
  ),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const partnerships = await ctx.db.query("partnerships").collect();
    return Promise.all(
      partnerships.map(async (p) => ({
        ...p,
        logoUrl: p.logoId ? await ctx.storage.getUrl(p.logoId) : null,
        heroImageUrl: p.heroImageId ? await ctx.storage.getUrl(p.heroImageId) : null,
      }))
    );
  },
});

export const listPaged = query({
  args: pagedArgs,
  handler: async (ctx, a) => {
    let rows = await ctx.db.query("partnerships").collect();

    rows = applySearch(rows, a.search, [(r) => r.name, (r) => r.slug]);

    const template = a.filters?.template;
    if (template) rows = rows.filter((r) => (r.landingTemplate ?? "transfer") === template);
    const status = a.filters?.status;
    if (status) rows = rows.filter((r) => (r.status ?? "active") === status);

    rows = applySort(rows, a.sortBy, a.sortDir, {
      name: (r) => r.name.toLowerCase(),
      slug: (r) => r.slug.toLowerCase(),
    });

    const result = paginate(rows, a.page, a.pageSize);
    const withLogos = await Promise.all(
      result.rows.map(async (r) => ({
        ...r,
        logoUrl: r.logoId ? await ctx.storage.getUrl(r.logoId) : null,
        heroImageUrl: r.heroImageId ? await ctx.storage.getUrl(r.heroImageId) : null,
      })),
    );
    return { ...result, rows: withLogos };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const partnership = await ctx.db
      .query("partnerships")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!partnership) return null;
    return {
      ...partnership,
      logoUrl: partnership.logoId ? await ctx.storage.getUrl(partnership.logoId) : null,
      heroImageUrl: partnership.heroImageId ? await ctx.storage.getUrl(partnership.heroImageId) : null,
    };
  },
});

export const getById = query({
  args: { id: v.id("partnerships") },
  handler: async (ctx, args) => {
    const partnership = await ctx.db.get(args.id);
    if (!partnership) return null;
    return {
      ...partnership,
      logoUrl: partnership.logoId ? await ctx.storage.getUrl(partnership.logoId) : null,
      heroImageUrl: partnership.heroImageId ? await ctx.storage.getUrl(partnership.heroImageId) : null,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    theme: v.any(),
    content: v.optional(v.any()),
    logoId: v.optional(v.id("_storage")),
    status: v.optional(v.string()),
    landingTemplate: landingTemplateValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("partnerships")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      throw new Error("Partnership with this slug already exists");
    }
    return await ctx.db.insert("partnerships", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("partnerships"),
    name: v.string(),
    slug: v.string(),
    theme: v.any(),
    content: v.optional(v.any()),
    logoId: v.optional(v.id("_storage")),
    heroImageId: v.optional(v.id("_storage")),
    status: v.optional(v.string()),
    landingTemplate: landingTemplateValidator,
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("partnerships") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

