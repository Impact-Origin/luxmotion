import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { ContactHero } from "@/components/corporate/contact-hero"
import { ContactReachOut } from "@/components/corporate/contact-reach-out"

export default function CorporateContactPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[60px] lg:pt-[72px]">
        <ContactHero />
        <ContactReachOut />
      </div>
      <Footer />
    </div>
  )
}
