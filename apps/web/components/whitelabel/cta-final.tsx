"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

export function CtaFinal() {
  const { ref, reveal } = useScrollReveal<HTMLDivElement>()

  const t = useTranslations("whitelabel.ctaFinal")

  return (
    <section
      className="relative px-4 lg:px-[82px] pt-14 lg:pt-[72px] pb-14 lg:pb-[72px] overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(145.66deg, rgb(8,16,26) 0%, rgb(13,24,16) 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 1018px 604px at 50% 0%, rgba(201,169,110,0.12), rgba(201,169,110,0) 55%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent pointer-events-none"
      />

      <div
        ref={ref}
        className={cn(
          "relative max-w-[640px] mx-auto flex flex-col gap-6 items-center text-center",
          reveal(),
        )}
      >
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span
              className="text-[12px] font-medium uppercase tracking-[2px] text-[#C9A96E] leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h2
            className="font-light text-white text-[36px] lg:text-[48px] leading-none"
            style={SERIF_FONT}
          >
            <span className="block">{t("titleLine1")}</span>
            <span className="block italic text-[#C9A96E]">
              {t("titleLine2")}
            </span>
          </h2>
        </div>

        <p
          className="text-[16px] lg:text-[18px] leading-[1.3] text-[#999]"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="flex flex-col items-center gap-2 w-full">
          {/* Âncora sem barra à frente: "/#booking" saía da página do parceiro
              para a homepage principal, que é o oposto do que este botão quer.
              O widget de reserva está nesta mesma página, no topo. */}
          <Link
            href="#booking"
            className="bg-[#C9A96E] border border-[#C9A96E] hover:bg-[#d4b87c] hover:border-[#d4b87c] transition-colors h-12 px-[22px] flex items-center justify-center gap-2"
          >
            <span
              className="text-[14px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] px-2"
              style={SANS_FONT}
            >
              {t("cta")}
            </span>
            <ArrowRight className="size-[18px] text-[#0D0D0D]" strokeWidth={2} />
          </Link>
          <p
            className="text-[12px] text-[#999] leading-none pt-1"
            style={SANS_FONT}
          >
            {t("note")}
          </p>
        </div>
      </div>
    </section>
  )
}
