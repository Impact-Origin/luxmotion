import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { WeddingWhitelabelLanding } from "@/components/partnerships/wedding-whitelabel-landing"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("weddingWhitelabel.hero")

  return createPageMetadata({
    title: `${t("titlePrimary")} ${t("titleAccent")}`,
    description: t("subtitle", { partnerName: "{{PARTNER_NAME}}" }),
    path: "/wedding-whitelabel",
    keywords: [
      "wedding whitelabel",
      "wedding chauffeur partner",
      "Portugal wedding transport",
      "LuxMotion wedding white label",
    ],
  })
}

export default async function WeddingWhitelabelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <WeddingWhitelabelLanding />
}
