import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Real Google reviews — pulled from the Google Places API (New) server-side and
 * cached in Convex (refreshed once a day by the cron in crons.ts). The website
 * reads the cached `getGoogleReviews` query, so pages stay fast + SSR-friendly
 * and we stay within Google's caching policy.
 *
 * NOTE: the official Places API returns at most 5 review texts per place — the
 * aggregate rating + total count, however, are the real values for the listing.
 *
 * Required Convex env vars (set via the dashboard or `npx convex env set`):
 *   GOOGLE_PLACES_API_KEY  — a server key with "Places API (New)" enabled
 *   GOOGLE_PLACE_ID        — the Google place_id of the business listing
 */

type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  time: number;
  profilePhotoUrl?: string;
  language?: string;
};

const reviewValidator = v.object({
  author: v.string(),
  rating: v.number(),
  text: v.string(),
  relativeTime: v.string(),
  time: v.number(),
  profilePhotoUrl: v.optional(v.string()),
  language: v.optional(v.string()),
});

/** Public: the website reads the cached reviews + aggregate from here. */
export const getGoogleReviews = query({
  args: {},
  handler: async (ctx) => {
    try {
      const doc = await ctx.db.query("googleReviewsCache").first();
      if (!doc) return null;
      return {
        rating: doc.rating,
        total: doc.total,
        fetchedAt: doc.fetchedAt,
        reviews: doc.reviews,
      };
    } catch {
      // Never let a reviews read crash the homepage — fall back to null.
      return null;
    }
  },
});

/** Internal: replace the single cache document with a fresh pull. */
export const _store = internalMutation({
  args: {
    rating: v.number(),
    total: v.number(),
    reviews: v.array(reviewValidator),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("googleReviewsCache").collect();
    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }
    await ctx.db.insert("googleReviewsCache", {
      rating: args.rating,
      total: args.total,
      reviews: args.reviews,
      fetchedAt: Date.now(),
    });
  },
});

/**
 * Fetch the latest reviews from Google Places and store them. Runs daily via
 * cron; can also be triggered manually from the Convex dashboard to populate
 * the cache the first time, once the env vars are set.
 */
export const fetchGoogleReviews = internalAction({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ ok: boolean; count?: number; error?: string }> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) {
      console.error(
        "[GoogleReviews] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID env var",
      );
      return {
        ok: false,
        error: "Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID",
      };
    }
    try {
      const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
        placeId,
      )}?languageCode=en`;
      const res = await fetch(url, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error?.message ?? res.statusText;
        console.error("[GoogleReviews] API error:", res.status, message);
        return { ok: false, error: `${res.status}: ${message}` };
      }
      const reviews: GoogleReview[] = (data.reviews ?? [])
        .map((r: any) => {
          const parsed = r.publishTime ? Date.parse(r.publishTime) : 0;
          return {
            author: r.authorAttribution?.displayName ?? "Google user",
            rating: typeof r.rating === "number" ? r.rating : 5,
            text: r.text?.text ?? r.originalText?.text ?? "",
            relativeTime: r.relativePublishTimeDescription ?? "",
            time: Number.isNaN(parsed) ? 0 : parsed,
            profilePhotoUrl: r.authorAttribution?.photoUri,
            language: r.text?.languageCode,
          };
        })
        .filter((r: GoogleReview) => r.text.trim().length > 0);

      await ctx.runMutation(internal.googleReviews._store, {
        rating: typeof data.rating === "number" ? data.rating : 0,
        total:
          typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
        reviews,
      });
      console.log(
        `[GoogleReviews] Stored ${reviews.length} reviews (rating ${data.rating}, total ${data.userRatingCount})`,
      );
      return { ok: true, count: reviews.length };
    } catch (err: any) {
      console.error("[GoogleReviews] Fetch error:", err);
      return { ok: false, error: err?.message ?? String(err) };
    }
  },
});
