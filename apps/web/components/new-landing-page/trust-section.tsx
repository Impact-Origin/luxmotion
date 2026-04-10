"use client"

import { Star } from "lucide-react"
import { ExclusiveBadge } from "@/components/new-landing-page/exclusive-badge"
import { useTranslations } from "next-intl"

export function TrustSection() {
  const t = useTranslations("trustSection")

  return (
    <section className="py-[40px] md:py-[64px] bg-white w-full px-4 md:px-8 lg:px-[60px] xl:px-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <ExclusiveBadge />

          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-[#FBB03B] text-[#FBB03B]" />
            ))}
          </div>

          <h2 className="text-[28px] md:text-[36px] font-bold text-center">
            <span className="text-[#222222]">{t("trustedBy")} </span>
            <span className="text-[#27C7FF]">{t("clientsAndCompanies")}</span>
          </h2>
        </div>
      </div>
    </section>
  )
}