import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const drivers = await ctx.db.query("drivers").collect();

    const withUrls = await Promise.all(
      drivers.map(async (driver) => {
        const imageUrl = driver.imageId
          ? await ctx.storage.getUrl(driver.imageId)
          : null;
        return { ...driver, imageUrl };
      })
    );

    return withUrls.sort((a, b) => a.order - b.order);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const drivers = await ctx.db
      .query("drivers")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const withUrls = await Promise.all(
      drivers.map(async (driver) => {
        const imageUrl = driver.imageId
          ? await ctx.storage.getUrl(driver.imageId)
          : null;
        return { ...driver, imageUrl };
      })
    );

    return withUrls.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    quote: v.string(),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("drivers", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("drivers"),
    name: v.string(),
    location: v.string(),
    quote: v.string(),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Driver not found");

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("drivers") },
  handler: async (ctx, args) => {
    const driver = await ctx.db.get(args.id);
    if (!driver) throw new Error("Driver not found");

    if (driver.imageId) {
      await ctx.storage.delete(driver.imageId);
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
