import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { pagedArgs, paginate, applySearch, applySort } from "./lib/pagination"

const durationValidator = v.union(
  v.literal("halfDay"),
  v.literal("fullDay"),
  v.literal("multiDay"),
)

const pillarValidator = v.union(
  v.literal("standard"),
  v.literal("experiences"),
  v.literal("logistics"),
)

const statusValidator = v.union(v.literal("draft"), v.literal("published"))

const experienceItemValidator = v.object({
  strong: v.string(),
  body: v.string(),
})

async function resolveUrls(
  ctx: { storage: { getUrl: (id: any) => Promise<string | null> } },
  exp: any,
) {
  const coverImageUrl = exp.coverImageId
    ? await ctx.storage.getUrl(exp.coverImageId)
    : null
  const galleryImageUrls = await Promise.all(
    (exp.galleryImageIds ?? []).map((id: any) => ctx.storage.getUrl(id)),
  )
  return { ...exp, coverImageUrl, galleryImageUrls }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("corporateExperiences").collect()
    const withUrls = await Promise.all(all.map((e) => resolveUrls(ctx, e)))
    return withUrls.sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt - a.createdAt)
  },
})

export const listPaged = query({
  args: pagedArgs,
  handler: async (ctx, a) => {
    let rows = await ctx.db.query("corporateExperiences").collect()

    rows = applySearch(rows, a.search, [
      (r) => r.titlePrefix,
      (r) => r.titleAccent,
      (r) => r.shortDescription,
      (r) => r.location,
    ])

    const status = a.filters?.status
    if (status) rows = rows.filter((r) => r.status === status)
    const pillar = a.filters?.pillar
    if (pillar) rows = rows.filter((r) => r.pillar === pillar)

    // Default order mirrors `list`; applySort overrides when a sortable column is active.
    rows = rows.sort((x, y) => x.sortOrder - y.sortOrder || y.createdAt - x.createdAt)
    rows = applySort(rows, a.sortBy, a.sortDir, {
      title: (r) => `${r.titlePrefix} ${r.titleAccent}`.toLowerCase(),
      pillar: (r) => r.pillar,
      sortOrder: (r) => r.sortOrder,
      updated: (r) => r.updatedAt,
    })

    const result = paginate(rows, a.page, a.pageSize)
    const withUrls = await Promise.all(result.rows.map((e) => resolveUrls(ctx, e)))
    return { ...result, rows: withUrls }
  },
})

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("corporateExperiences")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect()
    const withUrls = await Promise.all(all.map((e) => resolveUrls(ctx, e)))
    return withUrls.sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt - a.createdAt)
  },
})

export const get = query({
  args: { id: v.id("corporateExperiences") },
  handler: async (ctx, { id }) => {
    const exp = await ctx.db.get(id)
    if (!exp) return null
    return await resolveUrls(ctx, exp)
  },
})

export const create = mutation({
  args: {
    titlePrefix: v.string(),
    titleAccent: v.string(),
    shortDescription: v.string(),
    duration: durationValidator,
    pillar: pillarValidator,
    subcategory: v.string(),
    groupSize: v.string(),
    durationLabel: v.string(),
    location: v.string(),
    description: v.string(),
    experienceBody: v.string(),
    experienceItems: v.array(experienceItemValidator),
    routeHighlights: v.array(v.string()),
    whatsIncluded: v.array(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    galleryImageIds: v.array(v.id("_storage")),
    status: statusValidator,
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("corporateExperiences", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("corporateExperiences"),
    titlePrefix: v.string(),
    titleAccent: v.string(),
    shortDescription: v.string(),
    duration: durationValidator,
    pillar: pillarValidator,
    subcategory: v.string(),
    groupSize: v.string(),
    durationLabel: v.string(),
    location: v.string(),
    description: v.string(),
    experienceBody: v.string(),
    experienceItems: v.array(experienceItemValidator),
    routeHighlights: v.array(v.string()),
    whatsIncluded: v.array(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    galleryImageIds: v.array(v.id("_storage")),
    status: statusValidator,
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    const existing = await ctx.db.get(id)
    if (!existing) throw new Error("Experience not found")
    await ctx.db.patch(id, { ...data, updatedAt: Date.now() })
    return id
  },
})

export const setStatus = mutation({
  args: {
    id: v.id("corporateExperiences"),
    status: statusValidator,
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id("corporateExperiences") },
  handler: async (ctx, { id }) => {
    const exp = await ctx.db.get(id)
    if (!exp) throw new Error("Experience not found")
    if (exp.coverImageId) {
      try {
        await ctx.storage.delete(exp.coverImageId)
      } catch {}
    }
    for (const gid of exp.galleryImageIds ?? []) {
      try {
        await ctx.storage.delete(gid)
      } catch {}
    }
    await ctx.db.delete(id)
    return id
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})
