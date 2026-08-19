import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { DriversHero2 } from "@/components/drivers-2/hero"
import { EarningsComparison2 } from "@/components/drivers-2/earnings-comparison"
import { HowItWorks2 } from "@/components/drivers-2/how-it-works"
import { QualityProcess2 } from "@/components/drivers-2/quality-process"
import { DailyOps2 } from "@/components/drivers-2/daily-ops"
import { TrustTestimonials2 } from "@/components/drivers-2/trust-testimonials"
import { FaqDrivers2 } from "@/components/drivers-2/faq"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("driversPage2.hero")

  return createPageMetadata({
    title: t("titleStart"),
    description: t("subtitle"),
    path: "/drivers",
    keywords: [
      "driver partner",
      "chauffeur partner",
      "luxmotion drivers",
      "premium driver portugal",
    ],
  })
}

export default function DriversTwoPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Drivers", url: "/drivers" },
        ])}
      />
      <Header variant="light" />
      <main className="pt-[60px] lg:pt-[72px]">
        <DriversHero2 />
        <EarningsComparison2 />
        <HowItWorks2 />
        <QualityProcess2 />
        <DailyOps2 />
        <TrustTestimonials2 />
        <FaqDrivers2 />
      </main>
      <Footer />
    </div>
  )
}
