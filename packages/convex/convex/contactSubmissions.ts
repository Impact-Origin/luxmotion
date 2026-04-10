import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contactSubmissions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_created")
      .collect();
    return submissions.reverse();
  },
});
