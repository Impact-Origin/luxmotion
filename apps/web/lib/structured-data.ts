import { absoluteUrl, seoDefaults } from "@/lib/seo";
import { GOOGLE_REVIEWS_URL, TRUSTPILOT_REVIEWS_URL } from "@/lib/review-links";

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

/**
 * A entidade LuxMotion, tal como o Google a deve reconhecer.
 *
 * O `sameAs` é a única forma de ligar este domínio às fichas onde a reputação
 * está construída — sem ele, as redes e o Trustpilot são páginas sem dono. A
 * ficha do Trustpilot ainda está registada noutro domínio; declará-la aqui é o
 * que permite ao Google perceber que é a mesma empresa.
 *
 * Sem `aggregateRating` de propósito: as 324 avaliações que o site mostra vivem
 * nessa ficha noutro domínio, e reclamá-las aqui era declarar uma nota que este
 * domínio não pode provar.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoDefaults.siteName,
    legalName: "LuxMotion by EasyTransfer",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/shared/logos/luxmotion-logo-square.jpg"),
    image: absoluteUrl(seoDefaults.ogImage),
    email: "geral@easytransferportugal.com",
    telephone: "+351963650278",
    areaServed: "Portugal",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ericeira Business Factory, Rua Prudêncio Franco da Trindade 4",
      postalCode: "2655-344",
      addressLocality: "Ericeira",
      addressCountry: "PT",
    },
    sameAs: [
      "https://www.facebook.com/luxmotioneasytransferportugal/",
      "https://www.instagram.com/luxmotion.tours/",
      "https://www.linkedin.com/company/luxmotion-easytransferportugal/",
      TRUSTPILOT_REVIEWS_URL,
      GOOGLE_REVIEWS_URL,
    ],
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
