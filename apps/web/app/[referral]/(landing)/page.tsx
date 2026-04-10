import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Testimonials } from "@/components/landing/testimonials"
import { Fleet } from "@/components/landing/fleet"
import { PaymentMethods } from "@/components/landing/payment-methods"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { WhyScheduleSection } from "@/components/landing/why-schedule-section"
import { LisbonBanner } from "@/components/landing/lisbon-banner"
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider"
import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { createNoIndexMetadata, createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data"

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ referral: string }>
}) {
  const { referral } = await params

  const partnership = await fetchQuery(api.partnerships.getBySlug, { slug: referral })

  if (!partnership || partnership.status === "inactive") {
    notFound()
  }

  const seoTitle =
    partnership.content?.seoTitle ||
    partnership.content?.heroTitle ||
    partnership.name

  const seoDescription =
    partnership.content?.seoDescription ||
    partnership.welcomeMessage ||
    `Custom landing page for ${partnership.name} powered by Easy Transfer.`

  return (
    <DynamicThemeProvider theme={partnership.theme} logoUrl={partnership.logoUrl}>
      <div className="min-h-screen bg-white text-slate-900" style={{ backgroundColor: "var(--theme-background)" }}>
        <JsonLd
          data={
            buildBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: partnership.name, url: `/${referral}` },
            ])
          }
        />
        <JsonLd
          data={
            buildServiceSchema({
              name: seoTitle,
              description: seoDescription,
              path: `/${referral}`,
              image: partnership.logoUrl,
            })
          }
        />
        <Header minimalNavigation />
        <Hero showTrustedBy={false} />
        <Testimonials />
        <WhyScheduleSection />
        <Fleet />
        <LisbonBanner />
        <PaymentMethods />
        <FAQ />
        <Footer />
      </div>
    </DynamicThemeProvider>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ referral: string }>
}): Promise<Metadata> {
  const { referral } = await params
  const partnership = await fetchQuery(api.partnerships.getBySlug, { slug: referral })

  if (!partnership || partnership.status === "inactive") {
    return createNoIndexMetadata("Partner page")
  }

  const seoTitle =
    partnership.content?.seoTitle ||
    partnership.content?.heroTitle ||
    partnership.name

  const seoDescription =
    partnership.content?.seoDescription ||
    partnership.welcomeMessage ||
    `Custom landing page for ${partnership.name} powered by Easy Transfer.`

  return createPageMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/${referral}`,
    image: partnership.logoUrl,
    noIndex: partnership.status === "inactive",
  })
}
