import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { WhitelabelLanding } from "@/components/partnerships/whitelabel-landing"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hero")

  return createPageMetadata({
    title: `${t("title1")} ${t("title2")}`,
    description: t("subtitle"),
    path: "/whitelabel",
  })
}

export default async function WhitelabelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <WhitelabelLanding />
}
