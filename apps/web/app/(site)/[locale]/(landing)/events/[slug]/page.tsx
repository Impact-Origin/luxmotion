import { routing } from "@/i18n/routing";
import { HomeThemeProvider } from "@/components/new-landing-page/home-theme";
import { resolveEventView } from "@/lib/event-view-model";
import { notFound } from "next/navigation";
import { ToursTopBar } from "@/components/tours/tours-top-bar";
import { ToursCartBar } from "@/components/tours/tours-cart-bar";
import { Footer } from "@/components/new-landing-page/footer";
import { EventDetailsHeader } from "@/components/events/event-details-header";
import { EventDetailsWrapper } from "@/components/events/event-details-wrapper";
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { getLocale, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import {
  createNoIndexMetadata,
  createPageMetadata,
  extractTextContent,
} from "@/lib/seo";
import { buildBreadcrumbSchema, buildEventSchema } from "@/lib/structured-data";

interface EventDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

type EventTranslation = {
  locale: string;
  title?: string;
  description?: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

type EventSeoSource = {
  title: string;
  description?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  translations?: EventTranslation[];
  bannerImageUrl?: string | null;
  tags?: string[];
  status?: string;
  eventDate: number;
  endDate?: number;
  venue?: string;
  location?: string;
};

function resolveEventSeo(event: EventSeoSource, locale: string) {
  const translation = event.translations?.find(
    (item: { locale: string }) => item.locale === locale,
  );

  const title =
    translation?.seoTitle ||
    translation?.title ||
    event.seoTitle ||
    event.title;

  const description =
    translation?.seoDescription ||
    extractTextContent(translation?.description) ||
    event.seoDescription ||
    extractTextContent(event.description);

  return {
    title,
    description,
  };
}

/**
 * Pré-gera cada events publicado nos seis idiomas, e revalida de cinco em cinco
 * minutos. Sem isto, cada visita a uma página de detalhe ia à base de dados —
 * são as páginas que mais tráfego valem do site.
 *
 * Se o Convex não responder durante o build, devolve lista vazia em vez de
 * partir o build: as páginas passam a ser geradas ao primeiro pedido, que é o
 * que `dynamicParams` permite.
 */
export async function generateStaticParams() {
  const rows = await fetchQuery(api.events.listPublished, {}).catch(() => []);
  return routing.locales.flatMap((locale) =>
    rows.map((row) => ({ locale, slug: row.slug })),
  );
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({
  params,
}: EventDetailsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const event = await fetchQuery(api.events.getBySlug, { slug });

  if (!event) {
    return createNoIndexMetadata("Event not found");
  }

  const seo = resolveEventSeo(event, locale);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/events/${slug}`,
    image: event.bannerImageUrl,
    keywords: event.tags,
    noIndex: event.status !== "published",
  });
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // "Não respondeu" e "não existe" não são a mesma coisa: só a segunda é 404.
  // Sem isto, um slug inexistente respondia 200 com um spinner, e o Google
  // indexava-o como página válida.
  let event: Awaited<ReturnType<typeof fetchQuery<typeof api.events.getBySlug>>> = null;
  let reachable = true;
  try {
    event = await fetchQuery(api.events.getBySlug, { slug });
  } catch {
    reachable = false;
  }
  if (reachable && !event) notFound();

  const seo = event ? resolveEventSeo(event, locale) : null;
  const initial = event ? resolveEventView(event, locale) : null;

  return (
    // O fundo e a cor do texto vêm do HomeThemeProvider.
    <HomeThemeProvider>
      {event && seo && (
        <>
          <JsonLd
            data={buildBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Events", url: "/events" },
              { name: seo.title, url: `/events/${slug}` },
            ])}
          />
          <JsonLd
            data={buildEventSchema({
              name: seo.title,
              description: seo.description,
              path: `/events/${slug}`,
              image: event.bannerImageUrl,
              startDate: event.eventDate,
              endDate: event.endDate,
              locationName: event.venue || event.location,
            })}
          />
        </>
      )}
      <div className="pb-[var(--cart-bar-h,0px)] [--tours-bar-h:30px] md:[--tours-bar-h:36px]">
        <ToursTopBar />
        <EventDetailsHeader />
        <div className="pt-[30px] md:pt-[86px]">
          <EventDetailsWrapper slug={slug} initial={initial} />
        </div>
        <Footer />
        <ToursCartBar />
      </div>
    </HomeThemeProvider>
  );
}
