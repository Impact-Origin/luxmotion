import { Header } from "@/components/new-landing-page/header";
import { Hero } from "@/components/new-landing-page/hero";
import { Fleet } from "@/components/new-landing-page/fleet";
import { Footer } from "@/components/new-landing-page/footer";
import { QualityProcess } from "@/components/whitelabel/quality-process";
import { Testimonials } from "@/components/whitelabel/testimonials";
import { Benefits } from "@/components/whitelabel/benefits";
import { Payment } from "@/components/whitelabel/payment";
import { FAQ } from "@/components/whitelabel/faq";
import { CtaFinal } from "@/components/whitelabel/cta-final";

export function WhitelabelLanding({
  logoUrl,
}: {
  logoUrl?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header whitelabel logoUrl={logoUrl} />
      <Hero whitelabel />
      <QualityProcess />
      <Testimonials />
      <Benefits />
      <Fleet />
      <Payment />
      <FAQ />
      <CtaFinal />
      <Footer whitelabel logoUrl={logoUrl} />
    </div>
  );
}
