import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import {
  PolicyPage,
  PolicyBulletList,
  PolicyBullet,
  type PolicySection,
} from "@/components/policy/policy-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacyPage")

  return createPageMetadata({
    title: t("title"),
    description: t("section1Body"),
    path: "/privacy-policy",
    keywords: ["privacy", "GDPR", "policy"],
  })
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("privacyPage")

  const renderListSection = (intro: string, items: string[]) => (
    <div className="flex flex-col">
      <p>{intro}</p>
      <PolicyBulletList>
        {items.map((item, i) => (
          <PolicyBullet key={i}>{item}</PolicyBullet>
        ))}
      </PolicyBulletList>
    </div>
  )

  const sections: PolicySection[] = [
    { title: t("section1Title"), body: <p>{t("section1Body")}</p> },
    {
      title: t("section2Title"),
      body: renderListSection(t("section2Intro"), [
        t("section2Item1"),
        t("section2Item2"),
        t("section2Item3"),
        t("section2Item4"),
        t("section2Item5"),
      ]),
    },
    {
      title: t("section3Title"),
      body: renderListSection(t("section3Intro"), [
        t("section3Item1"),
        t("section3Item2"),
        t("section3Item3"),
        t("section3Item4"),
        t("section3Item5"),
      ]),
    },
    {
      title: t("section4Title"),
      body: renderListSection(t("section4Intro"), [
        t("section4Item1"),
        t("section4Item2"),
        t("section4Item3"),
      ]),
    },
    { title: t("section5Title"), body: <p>{t("section5Body")}</p> },
    {
      title: t("section6Title"),
      body: renderListSection(t("section6Intro"), [
        t("section6Item1"),
        t("section6Item2"),
        t("section6Item3"),
        t("section6Item4"),
        t("section6Item5"),
        t("section6Item6"),
      ]),
    },
    { title: t("section7Title"), body: <p>{t("section7Body")}</p> },
    {
      title: t("section8Title"),
      body: (
        <div className="flex flex-col">
          <p>{t("section8Body")}</p>
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
          { name: t("title"), url: "/privacy-policy" },
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
