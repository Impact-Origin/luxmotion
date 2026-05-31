"use client"

import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { ExperiencesListing } from "@/components/corporate/experiences-listing"

export default function CorporateExperiencesPage() {
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
