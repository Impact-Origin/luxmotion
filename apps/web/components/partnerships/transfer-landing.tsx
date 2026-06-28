import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Testimonials } from "@/components/landing/testimonials";
import { Fleet } from "@/components/landing/fleet";
import { PaymentMethods } from "@/components/landing/payment-methods";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { WhyScheduleSection } from "@/components/landing/why-schedule-section";
import { LisbonBanner } from "@/components/landing/lisbon-banner";
import {
  DynamicThemeProvider,
  type ThemeConfig,
} from "@/components/dynamic-theme-provider";

export function TransferLanding({
  theme,
  logoUrl,
  isPreviewMode = false,
}: {
  theme?: Partial<ThemeConfig>;
  logoUrl?: string | null;
  isPreviewMode?: boolean;
}) {
  return (
    <DynamicThemeProvider
      theme={theme}
      logoUrl={logoUrl}
      isPreviewMode={isPreviewMode}
    >
      <div
        className="min-h-screen bg-white text-slate-900"
        style={{ backgroundColor: "var(--theme-background)" }}
      >
        <Header minimalNavigation />
        <Hero showTrustedBy={false} />
        <Testimonials />
        <WhyScheduleSection />
        <Fleet />
        <LisbonBanner />
        <PaymentMethods />
        <FAQ />
        <Footer />
      </div>
    </DynamicThemeProvider>
  );
}
