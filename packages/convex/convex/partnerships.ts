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

// Per-partnership dashboard: everything attributed to a partnership across every
// lead/order surface (affiliate attribution via partnershipId). Full-table scans
// + filter — fine for the admin (these tables are modest); add by_partnership
// indexes if any grows large.
export const getLeadStats = query({
  args: { partnershipId: v.id("partnerships") },
  handler: async (ctx, { partnershipId }) => {
    const summarize = (rows: any[]) => {
      const mine = rows.filter((r) => r.partnershipId === partnershipId);
      const recent = [...mine]
        .sort(
          (a, b) =>
            (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime),
        )
        .slice(0, 8)
        .map((r) => ({
          _id: r._id as string,
          label:
            r.fullName ||
            r.name ||
            r.author ||
            r.companyName ||
            r.company ||
            r.email ||
            "—",
          email: (r.email as string | undefined) ?? null,
          status: (r.status as string | undefined) ?? null,
          createdAt: (r.createdAt as number | undefined) ?? r._creationTime,
        }));
      return { count: mine.length, recent };
    };

    const [
      orders,
      tourInquiries,
      tourBookings,
      contactSubmissions,
      contactQuotes,
      corporateRequests,
      schoolQuoteSubmissions,
      weddingQuoteSubmissions,
    ] = await Promise.all([
      ctx.db.query("orders").collect(),
      ctx.db.query("tourInquiries").collect(),
      ctx.db.query("tourBookings").collect(),
      ctx.db.query("contactSubmissions").collect(),
      ctx.db.query("contactQuotes").collect(),
      ctx.db.query("corporateRequests").collect(),
      ctx.db.query("schoolQuoteSubmissions").collect(),
      ctx.db.query("weddingQuoteSubmissions").collect(),
    ]);

    return {
      orders: summarize(orders),
      tourInquiries: summarize(tourInquiries),
      tourBookings: summarize(tourBookings),
      contactSubmissions: summarize(contactSubmissions),
      contactQuotes: summarize(contactQuotes),
      corporateRequests: summarize(corporateRequests),
      schoolQuoteSubmissions: summarize(schoolQuoteSubmissions),
      weddingQuoteSubmissions: summarize(weddingQuoteSubmissions),
    };
  },
});

