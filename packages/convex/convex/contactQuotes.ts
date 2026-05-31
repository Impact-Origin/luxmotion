import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const statusValidator = v.union(
  v.literal("new"),
  v.literal("inProgress"),
  v.literal("resolved"),
  v.literal("archived"),
)

export const submit = mutation({
  args: {
    fullName: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contactQuotes", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    })
    return { id }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("contactQuotes")
      .withIndex("by_created")
      .collect()
    return rows.reverse()
  },
})

export const get = query({
  args: { id: v.id("contactQuotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const setStatus = mutation({
  args: { id: v.id("contactQuotes"), status: statusValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status })
  },
})

export const remove = mutation({
  args: { id: v.id("contactQuotes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
