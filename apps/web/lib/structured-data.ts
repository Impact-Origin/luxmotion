import { absoluteUrl, seoDefaults } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ArticleSchemaInput = {
  headline: string;
  description: string;
  path: string;
  image?: string | null;
  authorName?: string;
  publishedAt?: number;
  modifiedAt?: number;
};

type EventSchemaInput = {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  startDate: number;
  endDate?: number;
  locationName?: string;
};

type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  areaServed?: string;
};

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoDefaults.siteName,
    url: absoluteUrl("/"),
    email: "geral@easytransferericeira.com",
    telephone: "+351963650278",
    areaServed: "Portugal",
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoDefaults.siteName,
    url: absoluteUrl("/"),
    inLanguage: ["pt", "en", "de", "es", "fr", "nl"],
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: absoluteUrl(input.path),
    headline: input.headline,
    description: input.description,
    image: absoluteUrl(input.image || seoDefaults.ogImage),
    author: {
      "@type": "Person",
      name: input.authorName || seoDefaults.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: seoDefaults.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.png"),
      },
    },
    datePublished: input.publishedAt
      ? new Date(input.publishedAt).toISOString()
      : undefined,
    dateModified: new Date(
      input.modifiedAt || input.publishedAt || Date.now(),
    ).toISOString(),
  };
}

export function buildEventSchema(input: EventSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    image: absoluteUrl(input.image || seoDefaults.ogImage),
    url: absoluteUrl(input.path),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    startDate: new Date(input.startDate).toISOString(),
    endDate: new Date(input.endDate || input.startDate).toISOString(),
    location: {
      "@type": "Place",
      name: input.locationName || "Portugal",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PT",
      },
    },
    organizer: {
      "@type": "Organization",
      name: seoDefaults.siteName,
      url: absoluteUrl("/"),
    },
  };
}

export function buildServiceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: seoDefaults.siteName,
      url: absoluteUrl("/"),
    },
    areaServed: input.areaServed || "Portugal",
    url: absoluteUrl(input.path),
    image: absoluteUrl(input.image || seoDefaults.ogImage),
  };
}
