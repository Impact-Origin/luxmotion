import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    children: v.optional(v.number()),
    budget: v.optional(v.number()),
    route: v.optional(v.string()),
    departureTime: v.optional(v.string()),
    pickup: v.optional(v.string()),
    dropoff: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("schoolQuoteSubmissions", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db
      .query("schoolQuoteSubmissions")
      .withIndex("by_created")
      .collect();
    return submissions.reverse();
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("schoolQuoteSubmissions"),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("schoolQuoteSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
