import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const statusValidator = v.union(
  v.literal("submitted"),
  v.literal("reviewing"),
  v.literal("approved"),
  v.literal("rejected"),
)

export const submit = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    companyName: v.string(),
    eventDate: v.optional(v.number()),
    guests: v.optional(v.number()),
    budget: v.optional(v.number()),
    vehicleType: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const total = await ctx.db.query("corporateRequests").collect()
    const queuePosition = total.length + 1

    const id = await ctx.db.insert("corporateRequests", {
      ...args,
      status: "submitted",
      queuePosition,
      createdAt: Date.now(),
    })

    return { id, queuePosition }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db
      .query("corporateRequests")
      .withIndex("by_created")
      .collect()
    return requests.reverse()
  },
})

export const get = query({
  args: { id: v.id("corporateRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const setStatus = mutation({
  args: {
    id: v.id("corporateRequests"),
    status: statusValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      reviewedAt: Date.now(),
    })
  },
})

export const setInternalNotes = mutation({
  args: {
    id: v.id("corporateRequests"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { internalNotes: args.notes })
  },
})

export const remove = mutation({
  args: { id: v.id("corporateRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
