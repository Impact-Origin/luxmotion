"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Testimonials } from "@/components/landing/testimonials";
import { Features } from "@/components/landing/features";
import { Fleet } from "@/components/landing/fleet";
import { PaymentMethods } from "@/components/landing/payment-methods";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/common/footer";
import { DynamicThemeProvider, defaultTheme, ThemeConfig } from "@/components/dynamic-theme-provider";

export default function PartnershipPreviewPage() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_THEME") {
        setTheme(event.data.theme);
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <DynamicThemeProvider theme={theme} isPreviewMode={true}>
      <div className="min-h-screen bg-white text-slate-900" style={{ backgroundColor: "var(--background)" }}>
        <Header />
        <Hero />
        <Testimonials />
        <Features />
        <Fleet />
        <PaymentMethods />
        <FAQ />
        <Footer />
      </div>
    </DynamicThemeProvider>
  );
}

