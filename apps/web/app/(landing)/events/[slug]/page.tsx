import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { EventDetailsWrapper } from "@/components/events/event-details-wrapper"
import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { getLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createNoIndexMetadata, createPageMetadata, extractTextContent } from "@/lib/seo"
import { buildBreadcrumbSchema, buildEventSchema } from "@/lib/structured-data"

interface EventDetailsPageProps {
  params: Promise<{ slug: string }>
}

type EventTranslation = {
  locale: string
  title?: string
  description?: unknown
  seoTitle?: string
  seoDescription?: string
}

type EventSeoSource = {
  title: string
  description?: unknown
  seoTitle?: string
  seoDescription?: string
  translations?: EventTranslation[]
  bannerImageUrl?: string | null
  tags?: string[]
  status?: string
  eventDate: number
  endDate?: number
  venue?: string
  location?: string
}

function resolveEventSeo(event: EventSeoSource, locale: string) {
  const translation = event.translations?.find((item: { locale: string }) => item.locale === locale)

  const title =
    translation?.seoTitle ||
    translation?.title ||
    event.seoTitle ||
    event.title

  const description =
    translation?.seoDescription ||
    extractTextContent(translation?.description) ||
    event.seoDescription ||
    extractTextContent(event.description)

  return {
    title,
    description,
  }
}

export async function generateMetadata({ params }: EventDetailsPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const event = await fetchQuery(api.events.getBySlug, { slug })

  if (!event) {
    return createNoIndexMetadata("Event not found")
  }

  const seo = resolveEventSeo(event, locale)

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/events/${slug}`,
    image: event.bannerImageUrl,
    keywords: event.tags,
    noIndex: event.status !== "published",
  })
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const event = await fetchQuery(api.events.getBySlug, { slug })
  const seo = event ? resolveEventSeo(event, locale) : null

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {event && seo && (
        <>
          <JsonLd
            data={
              buildBreadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "Events", url: "/events" },
                { name: seo.title, url: `/events/${slug}` },
              ])
            }
          />
          <JsonLd
            data={
              buildEventSchema({
                name: seo.title,
                description: seo.description,
                path: `/events/${slug}`,
                image: event.bannerImageUrl,
                startDate: event.eventDate,
                endDate: event.endDate,
                locationName: event.venue || event.location,
              })
            }
          />
        </>
      )}
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <EventDetailsWrapper slug={slug} />
      </div>
      <Footer />
    </div>
  )
}
