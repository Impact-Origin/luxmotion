import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import {
  PolicyPage,
  PolicyH3,
  PolicyHighlight,
  PolicyBulletList,
  PolicyBullet,
  type PolicySection,
} from "@/components/policy/policy-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("refundPage")

  return createPageMetadata({
    title: t("title"),
    description: t("section1Body"),
    path: "/refund",
    keywords: ["refund", "cancellation", "policy"],
  })
}

export default async function RefundPage() {
  const t = await getTranslations("refundPage")

  const sections: PolicySection[] = [
    { title: t("section1Title"), body: <p>{t("section1Body")}</p> },
    {
      title: t("section2Title"),
      body: (
        <div className="flex flex-col">
          <PolicyH3>{t("section2Tier1Title")}</PolicyH3>
          <PolicyHighlight>{t("section2Tier1Body")}</PolicyHighlight>
          <PolicyH3>{t("section2Tier2Title")}</PolicyH3>
          <p>{t("section2Tier2Body")}</p>
          <PolicyH3>{t("section2Tier3Title")}</PolicyH3>
          <p>{t("section2Tier3Body")}</p>
        </div>
      ),
    },
    { title: t("section3Title"), body: <p>{t("section3Body")}</p> },
    { title: t("section4Title"), body: <p>{t("section4Body")}</p> },
    {
      title: t("section5Title"),
      body: (
        <div className="flex flex-col">
          <p>{t("section5Intro")}</p>
          <PolicyBulletList>
            <PolicyBullet>{t("section5Item1")}</PolicyBullet>
            <PolicyBullet>{t("section5Item2")}</PolicyBullet>
            <PolicyBullet>{t("section5Item3")}</PolicyBullet>
          </PolicyBulletList>
          <p className="pt-[7.8px]">{t("section5Outro")}</p>
        </div>
      ),
    },
    {
      title: t("section6Title"),
      body: (
        <div className="flex flex-col">
          <p>{t("section6Body")}</p>
          <PolicyBulletList>
            <PolicyBullet>
              {t("contactEmailLabel")}:{" "}
              <a
                href="mailto:geral@easytransferericeira.com"
                className="text-[rgba(28,27,24,0.62)] hover:text-[#9A7535] transition-colors"
              >
                geral@easytransferericeira.com
              </a>
            </PolicyBullet>
            <PolicyBullet>
              {t("contactPhoneLabel")}:{" "}
              <a
                href="tel:+351963650278"
                className="text-[rgba(28,27,24,0.62)] hover:text-[#9A7535] transition-colors"
              >
                +351 963 650 278
              </a>
            </PolicyBullet>
          </PolicyBulletList>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1C1B18]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: t("title"), url: "/refund" },
        ])}
      />
      <Header />
      <main className="pt-[56px]">
        <PolicyPage title={t("title")} sections={sections} lastUpdated={t("lastUpdated")} />
      </main>
      <Footer />
    </div>
  )
}
