import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db.query("pastExperiences").collect();

    const withUrls = await Promise.all(
      experiences.map(async (exp) => {
        const imageUrl = exp.imageId
          ? await ctx.storage.getUrl(exp.imageId)
          : null;
        return { ...exp, imageUrl };
      })
    );

    return withUrls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db
      .query("pastExperiences")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const withUrls = await Promise.all(
      experiences.map(async (exp) => {
        const imageUrl = exp.imageId
          ? await ctx.storage.getUrl(exp.imageId)
          : null;
        return { ...exp, imageUrl };
      })
    );

    return withUrls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    category: v.union(
      v.literal("corporate"),
      v.literal("weddings"),
      v.literal("events"),
      v.literal("privateTours")
    ),
    tags: v.optional(v.array(v.string())),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("pastExperiences", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("pastExperiences"),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    category: v.union(
      v.literal("corporate"),
      v.literal("weddings"),
      v.literal("events"),
      v.literal("privateTours")
    ),
    tags: v.optional(v.array(v.string())),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Experience not found");

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("pastExperiences") },
  handler: async (ctx, args) => {
    const experience = await ctx.db.get(args.id);
    if (!experience) throw new Error("Experience not found");

    if (experience.imageId) {
      await ctx.storage.delete(experience.imageId);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
