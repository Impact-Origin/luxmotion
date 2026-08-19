import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { FaqsClient } from "./faqs-client"
import { FaqsCtaBand } from "@/components/faqs/faqs-cta-band"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faqsPage")

  return createPageMetadata({
    title: t("title"),
    description: t("a1"),
    path: "/faqs",
    keywords: ["FAQ", "transfer faq", "tour faq", "payment methods"],
  })
}

async function getFaqSchemaData() {
  const t = await getTranslations("faqsPage")

  return buildFaqSchema([
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: `${t("a2_intro")} WhatsApp/telefone: +351 963 650 278. Email: geral@easytransferericeira.com.` },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: `${t("a4_intro")} ${t("a4_1")}. ${t("a4_2")}. ${t("a4_3")}. ${t("a4_4")}. ${t("a4_5")}.` },
    { question: t("q5"), answer: t("a5") },
    { question: t("q6"), answer: t("a6") },
    { question: t("q7"), answer: t("a7") },
    { question: t("q8"), answer: `${t("a8_intro")} ${t("a8_1")}. ${t("a8_2")}. ${t("a8_3")}. ${t("a8_outro")}` },
    { question: t("q9"), answer: `${t("a9_intro")} ${t("a9_1")}. ${t("a9_2")}. ${t("a9_3")}. ${t("a9_4")}.` },
    { question: t("q10"), answer: t("a10") },
    { question: t("q11"), answer: t("a11") },
    { question: t("q12"), answer: t("a12") },
    { question: t("q13"), answer: `${t("a13_1")}. ${t("a13_2")}. ${t("a13_3")}. ${t("a13_4")}.` },
  ])
}

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const faqSchema = await getFaqSchemaData()

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd
        data={
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "FAQ", url: "/faqs" },
          ])
        }
      />
      <JsonLd data={faqSchema} />
      <Header />
      <main className="pt-[56px]">
        <FaqsClient />
        <FaqsCtaBand />
      </main>
      <Footer />
    </div>
  )
}
