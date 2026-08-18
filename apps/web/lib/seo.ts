import type { Metadata } from "next";

const DEFAULT_SITE_NAME = "Easy Transfer";
const DEFAULT_DESCRIPTION =
  "Private transfers, tours, events, and premium mobility services across Portugal.";
const DEFAULT_OG_IMAGE = "/og-luxmotion.jpg";

function withProtocol(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (!envUrl) {
    // Sem NEXT_PUBLIC_SITE_URL, o og:image saía como localhost e as
    // pré-visualizações partilhadas ficavam sem imagem. O domínio de produção é
    // o default seguro; em dev a env var continua a mandar.
    return "https://easytransferportugal.com";
  }

  return trimTrailingSlash(withProtocol(envUrl));
}

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const base = getSiteUrl();
  if (pathOrUrl.startsWith("/")) {
    return `${base}${pathOrUrl}`;
  }
  return `${base}/${pathOrUrl}`;
}

export function canonicalUrl(path: string): string {
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function trimToDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTextContent(input: unknown): string {
  if (!input) {
    return "";
  }

  if (typeof input === "string") {
    return stripHtml(input);
  }

  if (Array.isArray(input)) {
    return input
      .map((item) => extractTextContent(item))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (typeof input === "object") {
    const asRecord = input as Record<string, unknown>;

    if (typeof asRecord.text === "string") {
      return asRecord.text;
    }

    if (Array.isArray(asRecord.content)) {
      return asRecord.content
        .map((item) => extractTextContent(item))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  return "";
}

type CreatePageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata(input: CreatePageMetadataInput): Metadata {
  const description = input.description?.trim()
    ? trimToDescription(input.description)
    : DEFAULT_DESCRIPTION;
  const image = input.image || DEFAULT_OG_IMAGE;
  const canonical = canonicalUrl(input.path);
  const robots = input.noIndex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  return {
    title: input.title,
    description,
    alternates: { canonical },
    keywords: input.keywords,
    robots,
    openGraph: {
      title: input.title,
      description,
      type: input.type || "website",
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      images: [
        input.imageAlt
          ? { url: absoluteUrl(image), alt: input.imageAlt }
          : { url: absoluteUrl(image) },
      ],
      locale: "pt_PT",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function createNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export const seoDefaults = {
  siteName: DEFAULT_SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  ogImage: DEFAULT_OG_IMAGE,
};
