"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"
const SANS_FONT = "var(--font-sans), system-ui, sans-serif"

const COLLAGE_SRC = "/ultra-luxury-tours/story-collage.png"

export function UltraLuxuryTourStory() {
  const t = useTranslations("ultraLuxuryTours.story")

  return (
    <section className="bg-[#0D0D0D] px-4 pt-12 pb-16 md:px-[82px]">
      <div className="relative mx-auto flex max-w-[1280px] flex-col md:h-[457px] md:flex-row md:items-center">
        <div className="mb-6 w-full md:hidden">
          <Image
            src={COLLAGE_SRC}
            alt={t("collageAlt")}
            width={1820}
            height={1246}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="flex flex-col gap-[29px] md:flex-1">
          <div className="flex items-center gap-2">
            <div className="h-px w-[82px] bg-[#C9A96E]" />
            <span
              className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
              style={{ fontFamily: SANS_FONT }}
            >
              {t("label")}
            </span>
          </div>

          <h2
            className="text-[32px] leading-none text-white md:w-[538px] md:text-[48px]"
            style={{ fontFamily: SERIF_FONT }}
          >
            <span className="block">{t("headingPart1")}</span>
            <span className="italic text-[#a08248]">{t("headingPart2")}</span>.
          </h2>

          <div
            className="flex flex-col gap-4 text-[14px] leading-[1.3] text-[#999] md:w-[639px]"
            style={{ fontFamily: SANS_FONT }}
          >
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
          </div>
        </div>

        <div className="absolute top-[calc(50%+20px)] right-[-59.61px] hidden h-[432.634px] w-[647.607px] -translate-y-1/2 md:block">
          <Image src={COLLAGE_SRC} alt="" fill className="object-contain" priority />
        </div>
      </div>
    </section>
  )
}
