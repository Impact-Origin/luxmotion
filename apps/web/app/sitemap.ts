import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { canonicalUrl } from "@/lib/seo";

// Rendered on demand: the dynamic entries come from Convex via a no-store
// fetch, so this route can't be statically prerendered at build time. Making
// it dynamic also means the build never needs Convex (no NEXT_PUBLIC_CONVEX_URL
// required at build), while the live sitemap still includes every DB route.
export const dynamic = "force-dynamic";

const staticRoutes = [
  "/",
  "/about-us",
  "/fleet",
  "/tours",
  "/events",
  "/blogs",
  "/faqs",
  "/terms-and-conditions",
  "/privacy-policy",
  "/refund",
  "/tours/lisboa",
  "/tours/porto",
  "/tours/algarve",
  "/tours/alentejo",
  "/tours/acores",
  "/tours/madeira",
];

const reservedPartnershipSlugs = new Set([
  "about-us",
  "fleet",
  "tours",
  "events",
  "blogs",
  "faqs",
  "terms-and-conditions",
  "privacy-policy",
  "refund",
  "checkout",
  "admin",
  "payment",
  "preview-site",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    (path, index) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : index < 6 ? 0.9 : 0.7,
    }),
  );

  // Dynamic routes are pulled from Convex. If Convex isn't reachable at build
  // time (e.g. NEXT_PUBLIC_CONVEX_URL not set in the build environment), emit
  // the static routes only instead of failing the whole build.
  try {
    const [tours, events, blogs, partnerships] = await Promise.all([
      fetchQuery(api.tours.listPublished, {}),
      fetchQuery(api.events.listPublished, {}),
      fetchQuery(api.blogs.listPublished, {}),
      fetchQuery(api.partnerships.list, {}),
    ]);

    const tourEntries: MetadataRoute.Sitemap = tours.map((tour) => ({
      url: canonicalUrl(`/tours/tour/${tour.slug}`),
      lastModified: new Date(
        tour.updatedAt || tour.publishedAt || tour.createdAt || Date.now(),
      ),
      changeFrequency: "weekly",
      priority: tour.isFeatured ? 0.9 : 0.8,
    }));

    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
      url: canonicalUrl(`/events/${event.slug}`),
      lastModified: new Date(
        event.updatedAt || event.publishedAt || event.createdAt || Date.now(),
      ),
      changeFrequency: "weekly",
      priority: event.isFeatured ? 0.8 : 0.7,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: canonicalUrl(`/blogs/${blog.slug}`),
      lastModified: new Date(
        blog.updatedAt || blog.publishedAt || blog.createdAt || Date.now(),
      ),
      changeFrequency: "monthly",
      priority: blog.isFeatured ? 0.8 : 0.7,
    }));

    const partnershipEntries: MetadataRoute.Sitemap = partnerships
      .filter((partnership) => partnership.status !== "inactive")
      .filter((partnership) => !reservedPartnershipSlugs.has(partnership.slug))
      .map((partnership) => ({
        url: canonicalUrl(`/${partnership.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    return [
      ...staticEntries,
      ...tourEntries,
      ...eventEntries,
      ...blogEntries,
      ...partnershipEntries,
    ];
  } catch (error) {
    console.warn(
      "[sitemap] Could not load dynamic routes from Convex; emitting static routes only.",
      error,
    );
    return staticEntries;
  }
}
