import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { PolicyPage, type PolicySection } from "@/components/policy/policy-page"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("termsPage")

  return createPageMetadata({
    title: t("title"),
    description: t("section1Body"),
    path: "/terms-and-conditions",
    keywords: ["terms", "conditions", "policy"],
  })
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("termsPage")

  const sections: PolicySection[] = [
    { title: t("section1Title"), body: <p>{t("section1Body")}</p> },
    { title: t("section2Title"), body: <p>{t("section2Body")}</p> },
    { title: t("section3Title"), body: <p>{t("section3Body")}</p> },
    { title: t("section4Title"), body: <p>{t("section4Body")}</p> },
    { title: t("section5Title"), body: <p>{t("section5Body")}</p> },
    { title: t("section6Title"), body: <p>{t("section6Body")}</p> },
    { title: t("section7Title"), body: <p>{t("contactIntro")}</p> },
  ]

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1C1B18]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: t("title"), url: "/terms-and-conditions" },
        ])}
      />
      <Header />
      <main className="pt-[56px]">
        <PolicyPage
          title={t("title")}
          sections={sections}
          contactItems={[
            { label: t("contactEmailLabel"), value: "geral@easytransferericeira.com", href: "mailto:geral@easytransferericeira.com" },
            { label: t("contactPhoneLabel"), value: "+351 963 650 278", href: "tel:+351963650278" },
          ]}
          lastUpdated={t("lastUpdated")}
        />
      </main>
      <Footer />
    </div>
  )
}
