import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { generateSlug } from "./lib/utils";

function withDisplayedReviewCount<
  T extends { reviewCount?: number; manualReviewCount?: number },
>(item: T): T & { baseReviewCount: number } {
  const baseReviewCount = item.reviewCount ?? 0;
  const manualReviewCount = item.manualReviewCount ?? 0;
  return {
    ...item,
    baseReviewCount,
    reviewCount: Math.max(0, baseReviewCount + manualReviewCount),
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tours = await ctx.db.query("tours").collect();

    const toursWithUrls = await Promise.all(
      tours.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        const additionalBannerUrls = tour.additionalBannerIds
          ? await Promise.all(
              tour.additionalBannerIds.map((id) => ctx.storage.getUrl(id)),
            )
          : [];

        const galleryImageUrls = tour.galleryImageIds
          ? await Promise.all(
              tour.galleryImageIds.map((id) => ctx.storage.getUrl(id)),
            )
          : [];

        const translations = await ctx.db
          .query("tourTranslations")
          .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
          .collect();

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
          additionalBannerUrls: additionalBannerUrls.filter(Boolean),
          galleryImageUrls: galleryImageUrls.filter(Boolean),
          availableLanguages: [
            tour.originalLanguage,
            ...translations.map((t) => t.locale),
          ],
        });
      }),
    );

    return toursWithUrls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const toursWithUrls = await Promise.all(
      tours
        .filter((t) => t.isUltraLuxury !== true)
        .map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        const translations = await ctx.db
          .query("tourTranslations")
          .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
          .collect();

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
          availableLanguages: [
            tour.originalLanguage,
            ...translations.map((t) => t.locale),
          ],
        });
      }),
    );

    return toursWithUrls.sort(
      (a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0),
    );
  },
});

export const listByDestination = query({
  args: { destination: v.string() },
  handler: async (ctx, args) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_destination", (q) => q.eq("destination", args.destination))
      .collect();
    const publishedTours = tours.filter(
      (t) => t.status === "published" && t.isUltraLuxury !== true,
    );

    const toursWithUrls = await Promise.all(
      publishedTours.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
        });
      }),
    );

    return toursWithUrls;
  },
});

export const listByCategory = query({
  args: {
    category: v.union(
      v.literal("tours"),
      v.literal("experiences"),
      v.literal("private"),
      v.literal("events"),
    ),
  },
  handler: async (ctx, args) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    const publishedTours = tours.filter(
      (t) => t.status === "published" && t.isUltraLuxury !== true,
    );

    const toursWithUrls = await Promise.all(
      publishedTours.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
        });
      }),
    );

    return toursWithUrls;
  },
});

export const listByDestinationAndCategory = query({
  args: {
    destination: v.string(),
    category: v.union(
      v.literal("tours"),
      v.literal("experiences"),
      v.literal("private"),
      v.literal("events"),
    ),
  },
  handler: async (ctx, args) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_destination_category", (q) =>
        q.eq("destination", args.destination).eq("category", args.category),
      )
      .collect();
    const publishedTours = tours.filter(
      (t) => t.status === "published" && t.isUltraLuxury !== true,
    );

    const toursWithUrls = await Promise.all(
      publishedTours.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
        });
      }),
    );

    return toursWithUrls;
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
    const publishedFeatured = tours
      .filter((t) => t.status === "published" && t.isUltraLuxury !== true)
      .slice(0, args.limit ?? 6);

    const toursWithUrls = await Promise.all(
      publishedFeatured.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
        });
      }),
    );

    return toursWithUrls;
  },
});

export const listBestsellers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_bestseller", (q) => q.eq("isBestSeller", true))
      .collect();
    const publishedBestsellers = tours
      .filter((t) => t.status === "published" && t.isUltraLuxury !== true)
      .slice(0, args.limit ?? 6);

    const toursWithUrls = await Promise.all(
      publishedBestsellers.map(async (tour) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
        });
      }),
    );

    return toursWithUrls;
  },
});

export const listUltraLuxury = query({
  args: {},
  handler: async (ctx) => {
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const toursWithUrls = await Promise.all(
      tours
        .filter((t) => t.isUltraLuxury === true)
        .map(async (tour) => {
          const bannerImageUrl = tour.bannerImageId
            ? await ctx.storage.getUrl(tour.bannerImageId)
            : null;

          const translations = await ctx.db
            .query("tourTranslations")
            .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
            .collect();

          return withDisplayedReviewCount({
            ...tour,
            bannerImageUrl,
            availableLanguages: [
              tour.originalLanguage,
              ...translations.map((t) => t.locale),
            ],
          });
        }),
    );

    return toursWithUrls.sort(
      (a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tour = await ctx.db
      .query("tours")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!tour) return null;

    const bannerImageUrl = tour.bannerImageId
      ? await ctx.storage.getUrl(tour.bannerImageId)
      : null;

    const additionalBannerUrls = tour.additionalBannerIds
      ? await Promise.all(
          tour.additionalBannerIds.map((id) => ctx.storage.getUrl(id)),
        )
      : [];

    const additionalBannerTypes =
      tour.additionalBannerTypes ??
      tour.additionalBannerIds?.map(() => "image" as const) ??
      [];

    const additionalBanners = (
      additionalBannerUrls.filter(Boolean) as string[]
    ).map((url, i) => ({
      url,
      type: (additionalBannerTypes[i] ?? "image") as "image" | "video",
    }));

    const galleryImageUrls = tour.galleryImageIds
      ? await Promise.all(
          tour.galleryImageIds.map((id) => ctx.storage.getUrl(id)),
        )
      : [];

    const translations = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
      .collect();

    const stops = await ctx.db
      .query("tourStops")
      .withIndex("by_tour_order", (q) => q.eq("tourId", tour._id))
      .collect();

    const stopsWithImages = await Promise.all(
      stops.map(async (stop) => {
        const imageUrl = stop.imageId
          ? await ctx.storage.getUrl(stop.imageId)
          : null;
        return { ...stop, imageUrl };
      }),
    );

    const reviews = await ctx.db
      .query("tourReviews")
      .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
      .collect();

    const approvedReviews = reviews.filter((r) => r.isApproved);

    const addons = await ctx.db
      .query("tourAddons")
      .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
      .collect();

    const activeAddons = addons
      .filter(
        (a) =>
          a.status === "published" ||
          (a.status === undefined && a.isActive === true),
      )
      .sort((a, b) => a.order - b.order);

    const addonsWithData = await Promise.all(
      activeAddons.map(async (addon) => {
        const imageUrl = addon.imageId
          ? await ctx.storage.getUrl(addon.imageId)
          : null;
        const addonTranslations = await ctx.db
          .query("tourAddonTranslations")
          .withIndex("by_addon", (q) => q.eq("addonId", addon._id))
          .collect();
        return { ...addon, imageUrl, translations: addonTranslations };
      }),
    );

    const itineraryDays = tour.itineraryDays
      ? await Promise.all(
          tour.itineraryDays.map(async (day) => ({
            ...day,
            stops: await Promise.all(
              day.stops.map(async (stop) => ({
                ...stop,
                imageUrl: stop.imageId ? await ctx.storage.getUrl(stop.imageId) : null,
              })),
            ),
          })),
        )
      : undefined

    return withDisplayedReviewCount({
      ...tour,
      bannerImageUrl,
      additionalBannerUrls: additionalBannerUrls.filter(Boolean),
      additionalBanners,
      galleryImageUrls: galleryImageUrls.filter(Boolean),
      translations,
      itineraryDays,
      stops: stopsWithImages.sort((a, b) => a.order - b.order),
      reviews: approvedReviews,
      addons: addonsWithData,
      availableLanguages: [
        tour.originalLanguage,
        ...translations.map((t) => t.locale),
      ],
    });
  },
});

export const getById = query({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) return null;

    const bannerImageUrl = tour.bannerImageId
      ? await ctx.storage.getUrl(tour.bannerImageId)
      : null;

    const additionalBannerUrls = tour.additionalBannerIds
      ? await Promise.all(
          tour.additionalBannerIds.map((id) => ctx.storage.getUrl(id)),
        )
      : [];

    const additionalBannerTypes =
      tour.additionalBannerTypes ??
      tour.additionalBannerIds?.map(() => "image" as const) ??
      [];

    const additionalBanners = (
      additionalBannerUrls.filter(Boolean) as string[]
    ).map((url, i) => ({
      url,
      type: (additionalBannerTypes[i] ?? "image") as "image" | "video",
    }));

    const galleryImageUrls = tour.galleryImageIds
      ? await Promise.all(
          tour.galleryImageIds.map((id) => ctx.storage.getUrl(id)),
        )
      : [];

    const translations = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
      .collect();

    const stops = await ctx.db
      .query("tourStops")
      .withIndex("by_tour_order", (q) => q.eq("tourId", tour._id))
      .collect();

    const stopsWithImages = await Promise.all(
      stops.map(async (stop) => {
        const imageUrl = stop.imageId
          ? await ctx.storage.getUrl(stop.imageId)
          : null;
        return { ...stop, imageUrl };
      }),
    );

    const itineraryDays = tour.itineraryDays
      ? await Promise.all(
          tour.itineraryDays.map(async (day) => ({
            ...day,
            stops: await Promise.all(
              day.stops.map(async (stop) => ({
                ...stop,
                imageUrl: stop.imageId ? await ctx.storage.getUrl(stop.imageId) : null,
              })),
            ),
          })),
        )
      : undefined

    return withDisplayedReviewCount({
      ...tour,
      bannerImageUrl,
      additionalBannerUrls: additionalBannerUrls.filter(Boolean),
      additionalBanners,
      galleryImageUrls: galleryImageUrls.filter(Boolean),
      translations,
      itineraryDays,
      stops: stopsWithImages.sort((a, b) => a.order - b.order),
      availableLanguages: [
        tour.originalLanguage,
        ...translations.map((t) => t.locale),
      ],
    });
  },
});

export const listNearCoordinates = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radiusKm: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const radius = args.radiusKm ?? 30;
    const tours = await ctx.db
      .query("tours")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    function haversine(
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number,
    ): number {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const toursWithDistance = tours
      .filter((t) => t.isUltraLuxury !== true)
      .map((tour) => {
        const tourLat = tour.pickup?.lat ?? tour.mapCenter?.lat;
        const tourLng = tour.pickup?.lng ?? tour.mapCenter?.lng;
        if (tourLat == null || tourLng == null) return null;
        const distance = haversine(args.lat, args.lng, tourLat, tourLng);
        if (distance > radius) return null;
        return { tour, distance: Math.round(distance * 10) / 10 };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.distance - b.distance);

    const result = await Promise.all(
      toursWithDistance.map(async ({ tour, distance }) => {
        const bannerImageUrl = tour.bannerImageId
          ? await ctx.storage.getUrl(tour.bannerImageId)
          : null;

        const allAddons = await ctx.db
          .query("tourAddons")
          .withIndex("by_tour", (q) => q.eq("tourId", tour._id))
          .collect();
        const activeAddons = allAddons.filter(
          (a) =>
            a.status === "published" ||
            (a.status === undefined && a.isActive === true),
        );
        const addons = await Promise.all(
          activeAddons.map(async (addon) => {
            const imageUrl = addon.imageId
              ? await ctx.storage.getUrl(addon.imageId)
              : null;
            return {
              _id: addon._id,
              title: addon.title,
              description: addon.description,
              imageUrl,
              price: addon.price,
              pricingType: addon.pricingType,
              currency: addon.currency,
            };
          }),
        );

        return withDisplayedReviewCount({
          ...tour,
          bannerImageUrl,
          distanceKm: distance,
          addons,
        });
      }),
    );

    return result;
  },
});

export const getDestinations = query({
  args: {},
  handler: async (ctx) => {
    const tours = await ctx.db.query("tours").collect();
    const destinations = [
      ...new Set(
        tours
          .filter((t) => t.isUltraLuxury !== true)
          .map((t) => t.destination),
      ),
    ];
    return destinations.sort();
  },
});

export const getTranslation = query({
  args: {
    tourId: v.id("tours"),
    locale: v.string(),
  },
  handler: async (ctx, args) => {
    const translation = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour_locale", (q) =>
        q.eq("tourId", args.tourId).eq("locale", args.locale),
      )
      .first();

    return translation;
  },
});

export const getAvailableLanguages = query({
  args: { tourId: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.tourId);
    if (!tour) return [];

    const translations = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .collect();

    return [tour.originalLanguage, ...translations.map((t) => t.locale)];
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subtitle: v.optional(v.string()),
    description: v.any(),
    tourType: v.string(),
    originalLanguage: v.string(),
    category: v.union(
      v.literal("tours"),
      v.literal("experiences"),
      v.literal("private"),
      v.literal("events"),
    ),
    destination: v.string(),
    isFeatured: v.boolean(),
    isBestSeller: v.boolean(),
    isActive: v.boolean(),
    isUltraLuxury: v.optional(v.boolean()),
    tourTypeTag: v.optional(
      v.union(
        v.literal("half-day"),
        v.literal("full-day"),
        v.literal("multi-day"),
        v.literal("river-cruise"),
        v.literal("private-yacht"),
        v.literal("helicopter"),
      ),
    ),
    durationDays: v.optional(v.number()),
    itineraryDays: v.optional(
      v.array(
        v.object({
          title: v.string(),
          titleAccent: v.optional(v.string()),
          hoursActive: v.optional(v.string()),
          nights: v.optional(v.number()),
          hotel: v.optional(v.string()),
          stops: v.array(
            v.object({
              time: v.optional(v.string()),
              label: v.optional(v.string()),
              title: v.string(),
              description: v.optional(v.string()),
              imageId: v.optional(v.id("_storage")),
              lat: v.optional(v.number()),
              lng: v.optional(v.number()),
            }),
          ),
        }),
      ),
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    duration: v.string(),
    durationMinutes: v.optional(v.number()),
    groupSize: v.string(),
    maxGroupSize: v.optional(v.number()),
    languages: v.array(v.string()),
    basePrice: v.number(),
    originalPrice: v.optional(v.number()),
    currency: v.string(),
    bannerImageId: v.optional(v.id("_storage")),
    additionalBannerIds: v.optional(v.array(v.id("_storage"))),
    additionalBannerTypes: v.optional(
      v.array(v.union(v.literal("image"), v.literal("video"))),
    ),
    galleryImageIds: v.optional(v.array(v.id("_storage"))),

    included: v.optional(v.array(v.string())),
    excluded: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    pickup: v.optional(
      v.object({
        title: v.string(),
        address: v.string(),
        description: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        placeId: v.optional(v.string()),
      }),
    ),
    dropoff: v.optional(
      v.object({
        title: v.string(),
        address: v.string(),
        description: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        placeId: v.optional(v.string()),
      }),
    ),
    mapCenter: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    bookingDeadlineHours: v.optional(v.number()),
    cancellationPolicy: v.optional(v.string()),
    minPassengers: v.optional(v.number()),
    maxPassengers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.isFeatured) {
      const featuredCount = await ctx.db
        .query("tours")
        .withIndex("by_featured", (q) => q.eq("isFeatured", true))
        .collect();
      if (featuredCount.length >= 6) {
        throw new Error("Maximum of 6 featured tours allowed");
      }
    }

    const now = Date.now();
    let slug = generateSlug(args.title);

    const existing = await ctx.db
      .query("tours")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      slug = `${slug}-${now}`;
    }

    const tourId = await ctx.db.insert("tours", {
      ...args,
      slug,
      rating: 0,
      reviewCount: 0,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    return tourId;
  },
});

export const update = mutation({
  args: {
    id: v.id("tours"),
    title: v.string(),
    subtitle: v.optional(v.string()),
    description: v.any(),
    tourType: v.string(),
    originalLanguage: v.string(),
    category: v.union(
      v.literal("tours"),
      v.literal("experiences"),
      v.literal("private"),
      v.literal("events"),
    ),
    destination: v.string(),
    isFeatured: v.boolean(),
    isBestSeller: v.boolean(),
    isActive: v.boolean(),
    isUltraLuxury: v.optional(v.boolean()),
    tourTypeTag: v.optional(
      v.union(
        v.literal("half-day"),
        v.literal("full-day"),
        v.literal("multi-day"),
        v.literal("river-cruise"),
        v.literal("private-yacht"),
        v.literal("helicopter"),
      ),
    ),
    durationDays: v.optional(v.number()),
    itineraryDays: v.optional(
      v.array(
        v.object({
          title: v.string(),
          titleAccent: v.optional(v.string()),
          hoursActive: v.optional(v.string()),
          nights: v.optional(v.number()),
          hotel: v.optional(v.string()),
          stops: v.array(
            v.object({
              time: v.optional(v.string()),
              label: v.optional(v.string()),
              title: v.string(),
              description: v.optional(v.string()),
              imageId: v.optional(v.id("_storage")),
              lat: v.optional(v.number()),
              lng: v.optional(v.number()),
            }),
          ),
        }),
      ),
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    duration: v.string(),
    durationMinutes: v.optional(v.number()),
    groupSize: v.string(),
    maxGroupSize: v.optional(v.number()),
    languages: v.array(v.string()),
    basePrice: v.number(),
    originalPrice: v.optional(v.number()),
    currency: v.string(),
    bannerImageId: v.optional(v.id("_storage")),
    additionalBannerIds: v.optional(v.array(v.id("_storage"))),
    additionalBannerTypes: v.optional(
      v.array(v.union(v.literal("image"), v.literal("video"))),
    ),
    galleryImageIds: v.optional(v.array(v.id("_storage"))),

    included: v.optional(v.array(v.string())),
    excluded: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    pickup: v.optional(
      v.object({
        title: v.string(),
        address: v.string(),
        description: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        placeId: v.optional(v.string()),
      }),
    ),
    dropoff: v.optional(
      v.object({
        title: v.string(),
        address: v.string(),
        description: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        placeId: v.optional(v.string()),
      }),
    ),
    mapCenter: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    bookingDeadlineHours: v.optional(v.number()),
    cancellationPolicy: v.optional(v.string()),
    minPassengers: v.optional(v.number()),
    maxPassengers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Tour not found");

    if (data.isFeatured && !existing.isFeatured) {
      const featuredCount = await ctx.db
        .query("tours")
        .withIndex("by_featured", (q) => q.eq("isFeatured", true))
        .collect();
      if (featuredCount.length >= 6) {
        throw new Error("Maximum of 6 featured tours allowed");
      }
    }

    const now = Date.now();

    let publishedAt = existing.publishedAt;
    if (
      data.status === "published" ||
      (data.status === undefined &&
        data.isActive === true &&
        existing.status !== "published")
    ) {
      publishedAt = now;
    }

    await ctx.db.patch(id, {
      ...data,
      publishedAt,
      updatedAt: now,
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    const translations = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const translation of translations) {
      await ctx.db.delete(translation._id);
    }

    const stops = await ctx.db
      .query("tourStops")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const stop of stops) {
      const stopTranslations = await ctx.db
        .query("tourStopTranslations")
        .withIndex("by_stop", (q) => q.eq("stopId", stop._id))
        .collect();

      for (const st of stopTranslations) {
        await ctx.db.delete(st._id);
      }

      if (stop.imageId) {
        await ctx.storage.delete(stop.imageId);
      }
      await ctx.db.delete(stop._id);
    }

    const tourAddons = await ctx.db
      .query("tourAddons")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const addon of tourAddons) {
      const addonTranslations = await ctx.db
        .query("tourAddonTranslations")
        .withIndex("by_addon", (q) => q.eq("addonId", addon._id))
        .collect();
      for (const at of addonTranslations) {
        await ctx.db.delete(at._id);
      }
      if (addon.imageId) {
        await ctx.storage.delete(addon.imageId);
      }
      await ctx.db.delete(addon._id);
    }

    const schedules = await ctx.db
      .query("tourSchedules")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const schedule of schedules) {
      await ctx.db.delete(schedule._id);
    }

    const exceptions = await ctx.db
      .query("tourScheduleExceptions")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const exception of exceptions) {
      await ctx.db.delete(exception._id);
    }

    const reviews = await ctx.db
      .query("tourReviews")
      .withIndex("by_tour", (q) => q.eq("tourId", args.id))
      .collect();

    for (const review of reviews) {
      await ctx.db.delete(review._id);
    }

    if (tour.bannerImageId) {
      await ctx.storage.delete(tour.bannerImageId);
    }

    if (tour.additionalBannerIds) {
      for (const imageId of tour.additionalBannerIds) {
        await ctx.storage.delete(imageId);
      }
    }

    if (tour.galleryImageIds) {
      for (const imageId of tour.galleryImageIds) {
        await ctx.storage.delete(imageId);
      }
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const publish = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: tour.publishedAt ?? now,
      updatedAt: now,
    });

    return args.id;
  },
});

export const unpublish = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const countFeatured = query({
  args: {},
  handler: async (ctx) => {
    const featured = await ctx.db
      .query("tours")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
    return featured.length;
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    if (!tour.isFeatured) {
      const featuredCount = await ctx.db
        .query("tours")
        .withIndex("by_featured", (q) => q.eq("isFeatured", true))
        .collect();
      if (featuredCount.length >= 6) {
        throw new Error("Maximum of 6 featured tours allowed");
      }
    }

    await ctx.db.patch(args.id, {
      isFeatured: !tour.isFeatured,
      updatedAt: Date.now(),
    });

    return !tour.isFeatured;
  },
});

export const toggleBestseller = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    await ctx.db.patch(args.id, {
      isBestSeller: !tour.isBestSeller,
      updatedAt: Date.now(),
    });

    return !tour.isBestSeller;
  },
});

export const setManualReviewCount = mutation({
  args: {
    id: v.id("tours"),
    manualReviewCount: v.number(),
  },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");
    if (
      args.manualReviewCount < 0 ||
      !Number.isInteger(args.manualReviewCount)
    ) {
      throw new Error("Manual review count must be a non-negative integer");
    }

    await ctx.db.patch(args.id, {
      manualReviewCount: args.manualReviewCount,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const clearManualReviewCount = mutation({
  args: { id: v.id("tours") },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) throw new Error("Tour not found");

    await ctx.db.patch(args.id, {
      manualReviewCount: undefined,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const upsertTranslation = mutation({
  args: {
    tourId: v.id("tours"),
    locale: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    description: v.any(),

    included: v.optional(v.array(v.string())),
    excluded: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    cancellationPolicy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.tourId);
    if (!tour) throw new Error("Tour not found");

    if (args.locale === tour.originalLanguage) {
      throw new Error("Cannot create translation in the original language");
    }

    const existing = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour_locale", (q) =>
        q.eq("tourId", args.tourId).eq("locale", args.locale),
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        subtitle: args.subtitle,
        description: args.description,

        included: args.included,
        excluded: args.excluded,
        seoTitle: args.seoTitle,
        seoDescription: args.seoDescription,
        cancellationPolicy: args.cancellationPolicy,
        updatedAt: now,
      });
      return existing._id;
    }

    const translationId = await ctx.db.insert("tourTranslations", {
      tourId: args.tourId,
      locale: args.locale,
      title: args.title,
      subtitle: args.subtitle,
      description: args.description,

      included: args.included,
      excluded: args.excluded,
      seoTitle: args.seoTitle,
      seoDescription: args.seoDescription,
      cancellationPolicy: args.cancellationPolicy,
      updatedAt: now,
    });

    return translationId;
  },
});

export const removeTranslation = mutation({
  args: {
    tourId: v.id("tours"),
    locale: v.string(),
  },
  handler: async (ctx, args) => {
    const translation = await ctx.db
      .query("tourTranslations")
      .withIndex("by_tour_locale", (q) =>
        q.eq("tourId", args.tourId).eq("locale", args.locale),
      )
      .first();

    if (!translation) throw new Error("Translation not found");

    await ctx.db.delete(translation._id);
    return translation._id;
  },
});

export const updateRating = mutation({
  args: { tourId: v.id("tours") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("tourReviews")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .collect();

    const approvedReviews = reviews.filter((r) => r.isApproved);
    const reviewCount = approvedReviews.length;
    const rating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    await ctx.db.patch(args.tourId, {
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      updatedAt: Date.now(),
    });

    return { rating, reviewCount };
  },
});
