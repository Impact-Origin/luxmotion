import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { DriversHero } from "@/components/drivers-page/hero"
import { EarningsComparison } from "@/components/drivers-page/earnings-comparison"
import { HowItWorks } from "@/components/drivers-page/how-it-works"
import { QualityProcess } from "@/components/drivers-page/quality-process"
import { OperacaoDiaria } from "@/components/drivers-page/operacao-diaria"
import { TrustTestimonials } from "@/components/drivers-page/trust-testimonials"
import { FaqDrivers } from "@/components/drivers-page/faq"
import { DriversCtaFinal } from "@/components/drivers-page/cta-final"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("driversPage")

  return createPageMetadata({
    title: t("hero.titleLine1"),
    description: t("hero.subtitle"),
    path: "/partners",
    keywords: [
      "driver partner",
      "chauffeur partner",
      "luxmotion drivers",
      "premium driver portugal",
    ],
  })
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white text-[#1C1B18]">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Partners", url: "/partners" },
        ])}
      />
      <Header variant="light" />
      <main className="pt-[60px] lg:pt-[72px]">
        <DriversHero />
        <EarningsComparison />
        <HowItWorks />
        <QualityProcess />
        <OperacaoDiaria />
        <TrustTestimonials />
        <FaqDrivers />
        <DriversCtaFinal />
      </main>
      <Footer />
    </div>
  )
}
