import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("teamMembers").collect();

    const withUrls = await Promise.all(
      members.map(async (member) => {
        const imageUrl = member.imageId
          ? await ctx.storage.getUrl(member.imageId)
          : null;
        return { ...member, imageUrl };
      })
    );

    return withUrls.sort((a, b) => a.order - b.order);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const withUrls = await Promise.all(
      members.map(async (member) => {
        const imageUrl = member.imageId
          ? await ctx.storage.getUrl(member.imageId)
          : null;
        return { ...member, imageUrl };
      })
    );

    return withUrls.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("teamMembers", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("teamMembers"),
    name: v.string(),
    role: v.string(),
    imageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("draft"), v.literal("published")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Team member not found");

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("Team member not found");

    if (member.imageId) {
      await ctx.storage.delete(member.imageId);
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
