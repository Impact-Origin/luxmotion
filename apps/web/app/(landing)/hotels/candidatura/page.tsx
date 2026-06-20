import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { PartnerApplicationHero } from "@/components/hotels/partner-application-hero"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels")
  return createPageMetadata({
    title: t("form.eyebrow"),
    description: t("hero.intro"),
    path: "/hotels/candidatura",
    keywords: [
      "candidatura parceria luxmotion",
      "partner application",
      "hotel partnership form",
      "tornar-se parceiro",
    ],
  })
}

export default function HotelsCandidaturaPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Hotels", url: "/hotels" },
          { name: "Candidatura", url: "/hotels/candidatura" },
        ])}
      />
      <Header />
      <main className="pt-[60px] lg:pt-[72px]">
        <PartnerApplicationHero />
      </main>
      <Footer />
    </div>
  )
}
