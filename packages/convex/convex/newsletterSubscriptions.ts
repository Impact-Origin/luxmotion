import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) return;
    await ctx.db.insert("newsletterSubscriptions", {
      email: args.email,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_created")
      .collect();
    return subs.reverse();
  },
});
