import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { ContactHero } from "@/components/corporate/contact-hero"
import { ContactReachOut } from "@/components/corporate/contact-reach-out"
import { PreferToTalk } from "@/components/corporate/prefer-to-talk"
import { RequestProposalCta } from "@/components/corporate/request-proposal-cta"

export default function CorporateContactPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[60px] lg:pt-[72px]">
        <ContactHero />
        <ContactReachOut />
        <PreferToTalk />
        <RequestProposalCta />
      </div>
      <Footer />
    </div>
  )
}
