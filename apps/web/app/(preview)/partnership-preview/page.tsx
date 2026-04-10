"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Testimonials } from "@/components/landing/testimonials";
import { Fleet } from "@/components/landing/fleet";
import { PaymentMethods } from "@/components/landing/payment-methods";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { WhyScheduleSection } from "@/components/landing/why-schedule-section";
import { LisbonBanner } from "@/components/landing/lisbon-banner";
import { DynamicThemeProvider, defaultTheme, ThemeConfig } from "@/components/dynamic-theme-provider";

export default function PartnershipPreviewPage() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // preview mode iframe check
    setIsPreviewMode(window.self !== window.top);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_THEME") {
        setTheme(event.data.theme);
        if (typeof event.data.logoUrl !== "undefined") {
          setLogoUrl(event.data.logoUrl);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <DynamicThemeProvider theme={theme} logoUrl={logoUrl} isPreviewMode={isPreviewMode}>
      <div className="min-h-screen bg-white text-slate-900" style={{ backgroundColor: "var(--theme-background)" }}>
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
