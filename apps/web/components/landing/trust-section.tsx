"use client"

import { Star } from "lucide-react"
import { ExclusiveBadge } from "@/components/landing/exclusive-badge"
import { useTranslations } from "next-intl"

export function TrustSection() {
  const t = useTranslations("trustSection")

  return (
    <section data-theme-color="background" className="py-[40px] md:py-[64px] w-full px-4 md:px-8 lg:px-[60px] xl:px-[100px]" style={{ backgroundColor: "var(--theme-background, #ffffff)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <ExclusiveBadge />

          <div className="flex gap-2" data-theme-color="primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8" style={{ fill: "var(--theme-primary, #FBB03B)", color: "var(--theme-primary, #FBB03B)" }} />
            ))}
          </div>

          <h2 data-theme-color="headingText" className="text-[28px] md:text-[36px] font-bold text-center" style={{ color: "var(--theme-heading-text, #222222)" }}>
            <span>{t("trustedBy")} </span>
            <span data-theme-color="primary" style={{ color: "var(--theme-primary, #27C7FF)" }}>{t("clientsAndCompanies")}</span>
          </h2>
        </div>
      </div>
    </section>
  )
}
