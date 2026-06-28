import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { pagedArgs, paginate, applySearch, applySort } from "./lib/pagination";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_order")
      .collect();
    
    return Promise.all(
      vehicles.map(async (vehicle) => {
        const partnership = vehicle.partnershipId 
          ? await ctx.db.get(vehicle.partnershipId)
          : null;
          
        return {
        ...vehicle,
        imageUrl: vehicle.imageId 
          ? await ctx.storage.getUrl(vehicle.imageId) 
          : null,
          partnershipName: partnership?.name || "EasyTransfer",
        };
      })
    );
  },
});

export const listPaged = query({
  args: pagedArgs,
  handler: async (ctx, a) => {
    const vehicles = await ctx.db.query("vehicles").withIndex("by_order").collect();

    // Enrich with partnershipName (needed for search/filter) — cheap db.get per row.
    let rows = await Promise.all(
      vehicles.map(async (vehicle) => {
        const partnership = vehicle.partnershipId ? await ctx.db.get(vehicle.partnershipId) : null;
        return { ...vehicle, partnershipName: partnership?.name || "EasyTransfer" };
      }),
    );

    rows = applySearch(rows, a.search, [(r) => r.name, (r) => r.partnershipName]);

    const owner = a.filters?.owner;
    if (owner) rows = rows.filter((r) => (owner === "global" ? !r.partnershipId : r.partnershipId === owner));
    const status = a.filters?.status;
    if (status) rows = rows.filter((r) => r.status === status);

    rows = applySort(rows, a.sortBy, a.sortDir, {
      name: (r) => r.name.toLowerCase(),
      day: (r) => r.pricePerKm,
      night: (r) => r.pricePerKmNight,
      min: (r) => r.minimumPrice,
    });

    const result = paginate(rows, a.page, a.pageSize);
    const withImages = await Promise.all(
      result.rows.map(async (r) => ({
        ...r,
        imageUrl: r.imageId ? await ctx.storage.getUrl(r.imageId) : null,
      })),
    );
    return { ...result, rows: withImages };
  },
});

export const listActive = query({
  args: { partnershipSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let partnershipId = null;
    if (args.partnershipSlug) {
      const partnership = await ctx.db
        .query("partnerships")
        .withIndex("by_slug", (q) => q.eq("slug", args.partnershipSlug!))
        .unique();
      partnershipId = partnership?._id;
    }

    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    
    const filteredVehicles = vehicles.filter((vehicle) => {
      if (partnershipId) {
        return vehicle.partnershipId === partnershipId;
      }
      return !vehicle.partnershipId;
    });

    const sortedVehicles = filteredVehicles.sort((a, b) => a.order - b.order);

    return Promise.all(
      sortedVehicles.map(async (vehicle) => ({
        ...vehicle,
        imageUrl: vehicle.imageId 
          ? await ctx.storage.getUrl(vehicle.imageId) 
          : null,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) return null;

    return {
      ...vehicle,
      imageUrl: vehicle.imageId 
        ? await ctx.storage.getUrl(vehicle.imageId) 
        : null,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    imageId: v.optional(v.id("_storage")),
    partnershipId: v.optional(v.id("partnerships")),
    passengers: v.number(),
    luggage: v.number(),
    maxBackpacks: v.optional(v.number()),
    maxHandLuggage: v.optional(v.number()),
    maxCheckedBaggage: v.optional(v.number()),
    maxChildSeats: v.optional(v.number()),
    maxBabySeats: v.optional(v.number()),
    maxBoosterSeats: v.optional(v.number()),
    pricePerKm: v.number(),
    pricePerKmNight: v.number(),
    minimumPrice: v.number(),
    hasWifi: v.boolean(),
    isElectric: v.boolean(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("maintenance")
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vehicles", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("vehicles"),
    name: v.string(),
    imageId: v.optional(v.id("_storage")),
    partnershipId: v.optional(v.id("partnerships")),
    passengers: v.number(),
    luggage: v.number(),
    maxBackpacks: v.optional(v.number()),
    maxHandLuggage: v.optional(v.number()),
    maxCheckedBaggage: v.optional(v.number()),
    maxChildSeats: v.optional(v.number()),
    maxBabySeats: v.optional(v.number()),
    maxBoosterSeats: v.optional(v.number()),
    pricePerKm: v.number(),
    pricePerKmNight: v.number(),
    minimumPrice: v.number(),
    hasWifi: v.boolean(),
    isElectric: v.boolean(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("maintenance")
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    
    if (existing?.imageId && data.imageId && existing.imageId !== data.imageId) {
      await ctx.storage.delete(existing.imageId);
    }

    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (existing?.imageId) {
      await ctx.storage.delete(existing.imageId);
    }
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
