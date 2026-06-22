"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight, Calculator } from "lucide-react"
import { SocialProofBar } from "@/components/new-landing-page/hero"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function HotelsHero() {
  const t = useTranslations("hotels.hero")

  return (
    <section className="relative flex flex-col-reverse bg-[#0D0D0D] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
      {/* Left — content */}
      <div className="flex flex-col justify-center px-4 py-14 sm:px-6 lg:py-24 lg:pl-12 lg:pr-10 xl:pl-[6vw]">
        <div className="w-full max-w-[700px]">
          <div className="mb-7 inline-flex w-fit items-center border border-[rgba(201,169,110,0.35)] px-3.5 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
              {t("badge")}
            </span>
          </div>

          <h1 className="text-[42px] leading-[1.04] text-white sm:text-[54px] lg:text-[62px]" style={serif}>
            {t("titleLine1")}
            <br />
            <span className="italic text-[#C9A96E]">{t("titleAccent")}</span> {t("titleSuffix")}
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.6] text-[#9a9a9a]" style={sans}>
            {t("intro")}
          </p>

          <div className="mt-7">
            <SocialProofBar />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/hotels/candidatura"
              className="inline-flex h-[54px] items-center justify-center gap-2 bg-[#C9A96E] px-7 text-[13px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]"
              style={sans}
            >
              {t("cta1")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#calcular"
              className="inline-flex h-[54px] items-center justify-center gap-2 border border-[rgba(255,255,255,0.25)] px-7 text-[13px] font-semibold uppercase tracking-[1.2px] text-white transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
              style={sans}
            >
              {t("cta2")} <Calculator className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right — image + revenue badge */}
      <div className="relative h-[340px] min-h-[340px] sm:h-[420px] lg:h-auto">
        <Image
          src="/partnership/partnership_top.png"
          alt="LuxMotion partnership"
          fill
          priority
          className="object-cover object-center"
          sizes="(min-width:1024px) 50vw, 100vw"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-transparent to-transparent lg:w-1/4" />
        <div className="absolute bottom-5 right-5 border border-[rgba(201,169,110,0.3)] bg-[#0d0d0d]/75 px-6 py-4 text-right backdrop-blur-sm">
          <div className="text-[30px] italic leading-none text-[#C9A96E]" style={serif}>
            {t("badgeValue")}
          </div>
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-[1.5px] text-[rgba(255,255,255,0.6)]" style={sans}>
            {t("badgeLabel")}
          </div>
        </div>
      </div>
    </section>
  )
}
