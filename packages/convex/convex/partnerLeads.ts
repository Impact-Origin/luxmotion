import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const statusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("archived"),
)

export const submit = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    companyName: v.string(),
    partnerType: v.string(),
    estimatedMonthlyVolume: v.string(),
    city: v.string(),
    howDidYouHear: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("partnerLeads", {
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
      .query("partnerLeads")
      .withIndex("by_created")
      .collect()
    return rows.reverse()
  },
})

export const get = query({
  args: { id: v.id("partnerLeads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const setStatus = mutation({
  args: { id: v.id("partnerLeads"), status: statusValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status })
  },
})

export const remove = mutation({
  args: { id: v.id("partnerLeads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
