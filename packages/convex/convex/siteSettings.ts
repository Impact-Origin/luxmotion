import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Single global settings row, keyed like marketingStats.
const SETTINGS_KEY = "global";

export const siteSettingsDefaults = {
  // Minimum hours a transfer must be booked in advance (blocks "same hour" bookings).
  minAdvanceBookingHours: 2,
} as const;

export const get = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();

    if (!existing) {
      return siteSettingsDefaults;
    }

    return {
      minAdvanceBookingHours: existing.minAdvanceBookingHours,
    };
  },
});

export const upsert = mutation({
  args: {
    minAdvanceBookingHours: v.number(),
  },
  handler: async (ctx, args) => {
    if (
      !Number.isFinite(args.minAdvanceBookingHours) ||
      args.minAdvanceBookingHours < 0 ||
      args.minAdvanceBookingHours > 720
    ) {
      // 0 = no restriction; 720 = 30 days, a sane upper bound.
      throw new Error("minAdvanceBookingHours must be between 0 and 720");
    }

    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();

    const payload = {
      key: SETTINGS_KEY,
      minAdvanceBookingHours: args.minAdvanceBookingHours,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("siteSettings", payload);
  },
});
