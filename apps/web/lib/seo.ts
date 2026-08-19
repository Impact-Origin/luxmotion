import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/** Códigos de idioma como o Open Graph os quer (og:locale). */
const OG_LOCALES: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_GB",
  de: "de_DE",
  nl: "nl_NL",
  fr: "fr_FR",
  es: "es_ES",
};

/** O caminho de uma página num dado idioma. Todos levam prefixo, o inglês incluído. */
export function localePath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

const DEFAULT_SITE_NAME = "LuxMotion";
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
    //
    // Com www, que é para onde o servidor redirecciona: um canonical a apontar
    // para o apex mandava cada página para um endereço que responde 308, e
    // dividia a autoridade entre os dois.
    return "https://www.easytransferportugal.com";
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

/**
 * O idioma vem do próprio pedido, não de um parâmetro: são 27 sítios a chamar
 * isto e nenhum tinha de saber de idiomas até agora.
 *
 * Daqui saem duas coisas que o site não tinha: um canonical que aponta para a
 * versão no idioma da página, e o hreflang que diz ao Google que as outras
 * cinco existem. Sem eles, cinco dos seis idiomas eram invisíveis.
 */
export async function createPageMetadata(
  input: CreatePageMetadataInput,
): Promise<Metadata> {
  const locale = await getLocale();
  const description = input.description?.trim()
    ? trimToDescription(input.description)
    : DEFAULT_DESCRIPTION;
  const image = input.image || DEFAULT_OG_IMAGE;
  const canonical = canonicalUrl(localePath(locale, input.path));
  const robots = input.noIndex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  const languages = Object.fromEntries([
    ...locales.map((l) => [l, canonicalUrl(localePath(l, input.path))]),
    // Quem chega sem idioma definido vai para o inglês.
    ["x-default", canonicalUrl(localePath(defaultLocale, input.path))],
  ]);

  return {
    title: input.title,
    description,
    alternates: { canonical, languages },
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
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES[defaultLocale],
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
