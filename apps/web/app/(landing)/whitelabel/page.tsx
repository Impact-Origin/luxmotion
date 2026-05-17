import { Header } from "@/components/new-landing-page/header"
import { Hero } from "@/components/new-landing-page/hero"
import { Fleet } from "@/components/new-landing-page/fleet"
import { Footer } from "@/components/new-landing-page/footer"
import { WhatsAppFloat } from "@/components/new-landing-page/whatsapp-float"
import { QualityProcess } from "@/components/whitelabel/quality-process"
import { Testimonials } from "@/components/whitelabel/testimonials"
import { Benefits } from "@/components/whitelabel/benefits"
import { Payment } from "@/components/whitelabel/payment"
import { FAQ } from "@/components/whitelabel/faq"
import { CtaFinal } from "@/components/whitelabel/cta-final"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hero")

  return createPageMetadata({
    title: `${t("title1")} ${t("title2")}`,
    description: t("subtitle"),
    path: "/whitelabel",
  })
}

export default function WhitelabelPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header whitelabel />
      <WhatsAppFloat />
      <Hero whitelabel />
      <QualityProcess />
      <Testimonials />
      <Benefits />
      <Fleet />
      <Payment />
      <FAQ />
      <CtaFinal />
      <Footer whitelabel />
    </div>
  )
}
