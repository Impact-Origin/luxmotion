import { Header } from "@/components/new-landing-page/header";
import { Footer } from "@/components/new-landing-page/footer";
import { WeddingWhitelabelHero } from "@/components/wedding-whitelabel/wedding-whitelabel-hero";
import { WeddingWhitelabelStats } from "@/components/wedding-whitelabel/wedding-whitelabel-stats";
import { WeddingWhitelabelQuoteSection } from "@/components/wedding-whitelabel/wedding-whitelabel-quote-section";
import { WeddingWhitelabelMetrics } from "@/components/wedding-whitelabel/wedding-whitelabel-metrics";
import { WeddingWhitelabelOffer } from "@/components/wedding-whitelabel/wedding-whitelabel-offer";
import { WeddingWhitelabelTestimonials } from "@/components/wedding-whitelabel/wedding-whitelabel-testimonials";
import { WeddingWhitelabelBenefits } from "@/components/wedding-whitelabel/wedding-whitelabel-benefits";
import { WeddingGallerySection } from "@/components/wedding/wedding-gallery-section";
import { WeddingDiffSection } from "@/components/wedding/wedding-diff-section";
import { WeddingFleetSection } from "@/components/wedding/wedding-fleet-section";
import { WeddingPaymentSection } from "@/components/wedding/wedding-payment-section";
import { WeddingWhitelabelFaq } from "@/components/wedding-whitelabel/wedding-whitelabel-faq";

export function WeddingWhitelabelLanding({
  logoUrl,
  partnerName,
  heroImageUrl,
}: {
  logoUrl?: string | null;
  partnerName?: string;
  heroImageUrl?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#EFE8DC]">
      <Header variant="light" whitelabel logoUrl={logoUrl} />
      <div className="pt-[60px] md:pt-[72px]">
        <WeddingWhitelabelHero partnerName={partnerName} heroImageUrl={heroImageUrl} />
        <WeddingWhitelabelStats partnerName={partnerName} />
        <WeddingWhitelabelQuoteSection />
        <WeddingWhitelabelMetrics />
        <WeddingWhitelabelOffer />
        <WeddingWhitelabelTestimonials />
        <WeddingWhitelabelBenefits />
        <WeddingGallerySection />
        <WeddingDiffSection />
        <WeddingFleetSection />
        <WeddingPaymentSection />
        <WeddingWhitelabelFaq />
      </div>
      <Footer whitelabel logoUrl={logoUrl} />
    </div>
  );
}
