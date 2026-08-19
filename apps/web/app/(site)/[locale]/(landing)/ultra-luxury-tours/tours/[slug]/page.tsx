import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { UltraTourDetailWrapper } from "@/components/ultra-luxury-tours/detail/ultra-tour-detail-wrapper"
import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { notFound } from "next/navigation"
import { resolveTourView } from "@/lib/tour-view-model"
import { api } from "@workspace/convex/api"
import { getLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createNoIndexMetadata, createPageMetadata, extractTextContent } from "@/lib/seo"
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data"

interface PageProps {
  params: Promise<{ slug: string }>
}

type TourTranslation = {
  locale: string
  title?: string
  description?: unknown
  seoTitle?: string
  seoDescription?: string
}

type TourSeoSource = {
  title: string
  description?: unknown
  seoTitle?: string
  seoDescription?: string
  translations?: TourTranslation[]
  bannerImageUrl?: string | null
  tags?: string[]
  status?: string
  destination?: string
}

function resolveTourSeo(tour: TourSeoSource, locale: string) {
  const translation = tour.translations?.find((item) => item.locale === locale)
  const title = translation?.seoTitle || translation?.title || tour.seoTitle || tour.title
  const description =
    translation?.seoDescription ||
    extractTextContent(translation?.description) ||
    tour.seoDescription ||
    extractTextContent(tour.description)
  return { title, description }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const tour = await fetchQuery(api.tours.getBySlug, { slug })

  if (!tour) return createNoIndexMetadata("Tour not found")

  const seo = resolveTourSeo(tour, locale)
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/ultra-luxury-tours/tours/${slug}`,
    image: tour.bannerImageUrl,
    keywords: tour.tags,
    noIndex: tour.status !== "published",
  })
}

export default async function UltraLuxuryTourDetailPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  // "Não respondeu" e "não existe" não são a mesma coisa: só a segunda é 404.
  // O notFound() estava no componente cliente, onde no servidor ainda estava a
  // carregar, e um slug inexistente respondia 200.
  let tour: Awaited<ReturnType<typeof fetchQuery<typeof api.tours.getBySlug>>> = null
  let reachable = true
  try {
    tour = await fetchQuery(api.tours.getBySlug, { slug })
  } catch {
    reachable = false
  }
  if (reachable && !tour) notFound()

  const seo = tour ? resolveTourSeo(tour, locale) : null
  const initial = tour ? resolveTourView(tour, locale) : null

  return (
    <div className="min-h-screen bg-white text-[#0d0d0d]">
      {tour && seo && (
        <>
          <JsonLd
            data={buildBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Luxury Tours", url: "/ultra-luxury-tours" },
              { name: seo.title, url: `/ultra-luxury-tours/tours/${slug}` },
            ])}
          />
          <JsonLd
            data={buildServiceSchema({
              name: seo.title,
              description: seo.description,
              path: `/ultra-luxury-tours/tours/${slug}`,
              image: tour.bannerImageUrl,
              areaServed: tour.destination || "Portugal",
            })}
          />
        </>
      )}
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <UltraTourDetailWrapper slug={slug} initial={initial} />
      </div>
      <Footer />
    </div>
  )
}
