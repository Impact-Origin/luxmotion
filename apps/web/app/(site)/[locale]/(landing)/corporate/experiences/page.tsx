"use client"

import { setRequestLocale } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { ExperiencesListing } from "@/components/corporate/experiences-listing"

export default async function CorporateExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <Header />
      <div className="pt-[60px] lg:pt-[72px]">
        <ExperiencesListing />
      </div>
      <Footer />
    </div>
  )
}
