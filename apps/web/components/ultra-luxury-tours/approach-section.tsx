"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

export function UltraLuxuryApproachSection() {
  const t = useTranslations("ultraLuxuryTours.approach")

  return (
    <section className="bg-[#0D0D0D] px-4 py-12 md:px-[82px] md:py-[60px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 md:flex-row md:items-center md:gap-20">
        <div className="w-full md:flex-1">
          <div className="relative aspect-[600/450] w-full overflow-hidden rounded-[4px]">
            <Image
              src="/ultra/approach-belem.webp"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-1">
          <div className="flex items-center gap-[10px]">
            <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold uppercase tracking-[1.8px] text-[#C9A96E]">
              {t("label")}
            </span>
          </div>

          <h2
            className="text-[32px] leading-none text-white md:text-[48px]"
            style={{ fontFamily: SERIF_FONT }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="italic text-[#C9A96E]">{t("headingLine2")}</span>.
          </h2>

          <div className="flex flex-col gap-4 text-[14px] leading-[1.5] text-[#999]">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
          </div>

          <Link
            href="/about-us"
            className="mt-1 flex h-[48px] w-full items-center justify-center gap-2 border border-[#C9A96E] px-6 text-[14px] font-medium uppercase tracking-[1.1px] text-[#C9A96E] transition-colors hover:bg-[rgba(201,169,110,0.08)] md:w-auto md:self-start"
          >
            <span className="px-2">{t("cta")}</span>
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
