import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { PartnerGuide } from "@/components/partner-guide/guide"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("partnerGuide.clients")
  return createPageMetadata({
    title: `${t("titlePrefix")} ${t("titleAccent")}`,
    description: t("subtitle"),
    path: "/partner-guide",
    keywords: [
      "luxmotion guide",
      "how it works",
      "hotel partner guide",
      "transfer booking guide",
      "guia do parceiro",
    ],
  })
}

export default async function PartnerGuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  /* Esta é a única página pública com searchParams, o que a obriga a ser
     renderizada a pedido: não entra na cache, com ou sem idioma no endereço. */
  searchParams: Promise<{ tab?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { tab } = await searchParams
  const initialTab = tab === "partners" ? "partners" : "clients"
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Partner Guide", url: "/partner-guide" },
        ])}
      />
      <Header />
      <main className="pt-[60px] lg:pt-[72px]">
        <PartnerGuide initialTab={initialTab} />
      </main>
      <Footer />
    </div>
  )
}
