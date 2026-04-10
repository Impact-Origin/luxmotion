import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { canonicalUrl } from "@/lib/seo";

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
  const [tours, events, blogs, partnerships] = await Promise.all([
    fetchQuery(api.tours.listPublished, {}),
    fetchQuery(api.events.listPublished, {}),
    fetchQuery(api.blogs.listPublished, {}),
    fetchQuery(api.partnerships.list, {}),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    (path, index) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : index < 6 ? 0.9 : 0.7,
    }),
  );

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
}
