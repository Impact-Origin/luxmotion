"use client";

import { Header } from "@/components/new-landing-page/header";
import { Hero } from "@/components/new-landing-page/hero";
import { Fleet } from "@/components/new-landing-page/fleet";
import { Footer } from "@/components/new-landing-page/footer";
import {
  HomeThemeProvider,
  HomeThemeToggle,
  useHomeTheme,
} from "@/components/new-landing-page/home-theme";
import { QualityProcess } from "@/components/whitelabel/quality-process";
import { Testimonials } from "@/components/whitelabel/testimonials";
import { Benefits } from "@/components/whitelabel/benefits";
import { Payment } from "@/components/whitelabel/payment";
import { FAQ } from "@/components/whitelabel/faq";
import { CtaFinal } from "@/components/whitelabel/cta-final";

type ThemeMode = "switch" | "dark" | "light";

/**
 * White-label partner landing (homepage-like shell). Wrapped in HomeThemeProvider
 * so it shares the site's `--lm-*` light/dark palette. The partner's `themeMode`
 * (set in the admin) decides: "switch" shows the light/dark toggle in the header;
 * "dark"/"light" lock the theme with no toggle.
 */
export function WhitelabelLanding({
  logoUrl,
  heroImageUrl,
  partnershipSlug,
  partnerName,
  themeMode = "switch",
}: {
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  partnershipSlug?: string;
  partnerName?: string;
  themeMode?: ThemeMode;
}) {
  return (
    <HomeThemeProvider mode={themeMode}>
      <WhitelabelLandingInner
        logoUrl={logoUrl}
        heroImageUrl={heroImageUrl}
        partnershipSlug={partnershipSlug}
        partnerName={partnerName}
        showToggle={themeMode === "switch"}
      />
    </HomeThemeProvider>
  );
}

function WhitelabelLandingInner({
  logoUrl,
  heroImageUrl,
  partnershipSlug,
  partnerName,
  showToggle,
}: {
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  partnershipSlug?: string;
  partnerName?: string;
  showToggle: boolean;
}) {
  const { theme } = useHomeTheme();
  return (
    <>
      <Header
        whitelabel
        logoUrl={logoUrl}
        variant={theme === "dark" ? "dark" : "light"}
        themeToggle={showToggle ? <HomeThemeToggle /> : undefined}
      />
      <Hero
        whitelabel
        heroImageUrl={heroImageUrl}
        partnerName={partnerName}
        checkoutBasePath={partnershipSlug ? `/${partnershipSlug}` : ""}
      />
      <QualityProcess />
      <Testimonials />
      <Benefits />
      <Fleet />
      <Payment />
      <FAQ />
      <CtaFinal />
      <Footer whitelabel logoUrl={logoUrl} />
    </>
  );
}
