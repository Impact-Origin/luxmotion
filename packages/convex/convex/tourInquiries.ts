import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    tourId: v.optional(v.id("tours")),
    tourTitle: v.optional(v.string()),
    tourSlug: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    country: v.optional(v.string()),
    date: v.optional(v.string()),
    datesFlexible: v.boolean(),
    people: v.optional(v.string()),
    ageRange: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    interests: v.string(),
    marketingOptIn: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tourInquiries", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const inquiries = await ctx.db
      .query("tourInquiries")
      .withIndex("by_created")
      .collect();
    return inquiries.reverse();
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("tourInquiries"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("tourInquiries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
