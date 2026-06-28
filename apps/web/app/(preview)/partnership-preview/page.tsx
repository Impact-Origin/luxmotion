"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  defaultTheme,
  type ThemeConfig,
} from "@/components/dynamic-theme-provider";
import { PartnershipLanding } from "@/components/partnerships/partnership-landing";
import {
  resolvePartnershipLandingTemplate,
  type PartnershipLandingTemplate,
} from "@/lib/partnership-landing-templates";

function PartnershipPreviewContent() {
  const searchParams = useSearchParams();
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string>("");
  const [landingTemplate, setLandingTemplate] =
    useState<PartnershipLandingTemplate>(
      resolvePartnershipLandingTemplate(searchParams.get("template")),
    );
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    setLandingTemplate(
      resolvePartnershipLandingTemplate(searchParams.get("template")),
    );
  }, [searchParams]);

  useEffect(() => {
    setIsPreviewMode(window.self !== window.top);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_THEME") {
        if (event.data.theme) {
          setTheme(event.data.theme);
        }
        if (typeof event.data.logoUrl !== "undefined") {
          setLogoUrl(event.data.logoUrl);
        }
        if (typeof event.data.partnerName === "string") {
          setPartnerName(event.data.partnerName);
        }
        if (event.data.landingTemplate) {
          setLandingTemplate(
            resolvePartnershipLandingTemplate(event.data.landingTemplate),
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <PartnershipLanding
      template={landingTemplate}
      theme={theme}
      logoUrl={logoUrl}
      partnerName={partnerName || undefined}
      isPreviewMode={isPreviewMode}
    />
  );
}

export default function PartnershipPreviewPage() {
  return (
    <Suspense fallback={null}>
      <PartnershipPreviewContent />
    </Suspense>
  );
}
