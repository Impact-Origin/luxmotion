"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"

export function HeroSection() {
  const t = useTranslations("aboutPage.hero")

  return (
    <section className="relative bg-white w-full min-w-0 overflow-x-hidden pl-4 pr-0 md:pl-8 lg:pl-[60px] xl:pl-[100px] pt-[clamp(1.5rem,3vw,4rem)] pb-[clamp(0.5rem,1vw,1.25rem)]">
      {/* Imagem ocupa a zona direita; título em absoluto por cima */}
      <div className="relative w-full min-w-0 flex flex-row">
        <div className="flex-1 min-w-0" aria-hidden />
        <div className="relative flex-[1.5] min-w-0 flex min-h-0 2xl:justify-end -translate-y-[8%]">
          <div
            className="relative w-full aspect-[4/3] overflow-hidden 2xl:max-w-[82%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, transparent 5%, black 14%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 5%, black 14%, black 92%, transparent 100%)",
            }}
          >
            <Image
              src="/aboutus_team.png"
              alt={t("imageAlt")}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
        </div>
      </div>
      {/* Título em posição absoluta por cima da imagem */}
      <div
        className="absolute left-0 md:left-0 lg:left-[max(0px,calc((100vw-1400px)/2))] xl:left-[max(0px,calc((100vw-1480px)/2))] top-1/2 -translate-y-[62%] z-10 w-full max-w-[440px] pointer-events-none pl-4 md:pl-8 lg:pl-[60px] xl:pl-[100px]"
        style={{ width: "min(440px, calc(100vw - 2rem))" }}
      >
        <h1
          className="leading-[1.15] tracking-tight font-semibold text-[#222] text-left text-[18px] sm:text-[19px] md:text-[1.875rem] lg:text-[2.375rem] xl:text-[2.875rem] 2xl:text-[3rem] pointer-events-auto"
        >
          <span className="block whitespace-nowrap">{t("line1")}</span>
          <span className="block whitespace-nowrap">{t("line2")}</span>
          <span className="block mt-0.5 text-[#27c7ff] whitespace-nowrap">{t("line3")}</span>
          <span className="block text-[#27c7ff] whitespace-nowrap">{t("line4")}</span>
        </h1>
      </div>
    </section>
  )
}
