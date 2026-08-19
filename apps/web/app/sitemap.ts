import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { canonicalUrl, localePath } from "@/lib/seo";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Uma entrada por caminho, no idioma por omissão, com as outras cinco versões
 * declaradas em `alternates`. É a forma que o Google recomenda para sites
 * multilingues: seis entradas soltas por página diziam a mesma coisa em 834
 * linhas em vez de 139.
 */
function entry(
  path: string,
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap[number] {
  return {
    url: canonicalUrl(localePath(defaultLocale, path)),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, canonicalUrl(localePath(l, path))]),
      ),
    },
    ...rest,
  };
}

// Rendered on demand: the dynamic entries come from Convex via a no-store
// fetch, so this route can't be statically prerendered at build time. Making
// it dynamic also means the build never needs Convex (no NEXT_PUBLIC_CONVEX_URL
// required at build), while the live sitemap still includes every DB route.
export const dynamic = "force-dynamic";

// Every public, indexable page. Deliberately excluded: search-result pages
// (/tours/results, /blogs/results), the checkout + /payment flow, the white-label
// demo pages (/whitelabel, /wedding-whitelabel), the /admin area and all preview
// routes. Individual tours/events/blogs and partnership white-labels are appended
// from Convex below. Ultra-luxury tour detail pages reuse the same records as
// /tours/tour/[slug] (via api.tours.getBySlug), so only their hubs are listed
// here — listing both URLs would be duplicate content.
const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}> = [
  // Home
  { path: "/", priority: 1.0, changeFrequency: "daily" },

  // Primary product lines
  { path: "/tours", priority: 0.9, changeFrequency: "daily" },
  { path: "/ultra-luxury-tours", priority: 0.9, changeFrequency: "weekly" },
  { path: "/fleet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/wedding", priority: 0.9, changeFrequency: "weekly" },
  { path: "/corporate", priority: 0.9, changeFrequency: "weekly" },
  { path: "/events", priority: 0.9, changeFrequency: "weekly" },

  // Segment landing pages
  { path: "/ultra-luxury-tours/tours", priority: 0.8, changeFrequency: "weekly" },
  { path: "/corporate/experiences", priority: 0.8, changeFrequency: "weekly" },
  { path: "/wedding-planner", priority: 0.8, changeFrequency: "weekly" },
  { path: "/hotels", priority: 0.8, changeFrequency: "weekly" },
  { path: "/schools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/drivers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/partners", priority: 0.8, changeFrequency: "weekly" },
  { path: "/partner-guide", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blogs", priority: 0.7, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },

  // Tour destination hubs (mirror generateStaticParams in /tours/[destination])
  { path: "/tours/lisboa", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tours/porto", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tours/algarve", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tours/alentejo", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tours/acores", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tours/madeira", priority: 0.8, changeFrequency: "weekly" },

  // Conversion / application forms
  { path: "/corporate/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/drivers/apply", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners/apply", priority: 0.6, changeFrequency: "monthly" },
  { path: "/hotels/candidatura", priority: 0.6, changeFrequency: "monthly" },

  // Support / legal
  { path: "/faqs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
];

// Partnership white-labels live at the top level (/<slug>). Guard against a slug
// that would shadow a real first-level route above or a reserved system path.
const reservedPartnershipSlugs = new Set([
  /* Os códigos de idioma: /pt é a homepage portuguesa, e uma parceria com esse
     slug ficaria inalcançável. */
  ...locales,
  "about-us",
  "fleet",
  "tours",
  "ultra-luxury-tours",
  "events",
  "blogs",
  "corporate",
  "wedding",
  "wedding-planner",
  "hotels",
  "schools",
  "drivers",
  "partners",
  "partner-guide",
  "faqs",
  "terms-and-conditions",
  "privacy-policy",
  "refund",
  "whitelabel",
  "wedding-whitelabel",
  "checkout",
  "admin",
  "payment",
  "preview-site",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) =>
    entry(route.path, {
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
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

    const tourEntries: MetadataRoute.Sitemap = tours.map((tour) =>
      entry(`/tours/tour/${tour.slug}`, {
        lastModified: new Date(
          tour.updatedAt || tour.publishedAt || tour.createdAt || Date.now(),
        ),
        changeFrequency: "weekly",
        priority: tour.isFeatured ? 0.9 : 0.8,
      }),
    );

    const eventEntries: MetadataRoute.Sitemap = events.map((event) =>
      entry(`/events/${event.slug}`, {
        lastModified: new Date(
          event.updatedAt || event.publishedAt || event.createdAt || Date.now(),
        ),
        changeFrequency: "weekly",
        priority: event.isFeatured ? 0.8 : 0.7,
      }),
    );

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) =>
      entry(`/blogs/${blog.slug}`, {
        lastModified: new Date(
          blog.updatedAt || blog.publishedAt || blog.createdAt || Date.now(),
        ),
        changeFrequency: "monthly",
        priority: blog.isFeatured ? 0.8 : 0.7,
      }),
    );

    /* Estado explícito, não "tudo o que não está inactivo". O campo é opcional
       no schema, por isso qualquer registo criado sem estado entrava aqui como
       público: foi assim que quatro páginas de teste foram parar ao sitemap. */
    const partnershipEntries: MetadataRoute.Sitemap = partnerships
      .filter((partnership) => partnership.status === "active")
      .filter((partnership) => !reservedPartnershipSlugs.has(partnership.slug))
      .map((partnership) =>
        entry(`/${partnership.slug}`, {
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }),
      );

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
