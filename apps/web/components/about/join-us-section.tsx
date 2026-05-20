"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight, HeartHandshake, Car, type LucideIcon } from "lucide-react"

type JoinCard = {
  id: string
  icon: LucideIcon
  href: string
}

const CARDS: JoinCard[] = [
  { id: "partner", icon: HeartHandshake, href: "/partners/apply" },
  { id: "chauffeur", icon: Car, href: "/drivers/apply" },
]

function JoinCardBlock({ card, t }: { card: JoinCard; t: ReturnType<typeof useTranslations> }) {
  const Icon = card.icon
  return (
    <div className="group relative bg-[#1a1a1a] hover:bg-[#221f1c] transition-colors duration-500 ease-out flex flex-col gap-5 items-start px-6 md:px-12 py-10 md:py-14 flex-1">
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
        style={{
          background:
            "linear-gradient(to right, #C9A96E 0%, rgba(201,169,110,0.4) 50%, transparent 85%)",
        }}
      />
      <div className="size-14 border border-[rgba(201,169,110,0.2)] flex items-center justify-center shrink-0">
        <Icon className="size-6 text-[#C9A96E]" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-4 items-start w-full">
        <h3
          className="text-white font-normal leading-none"
          style={{
            fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
            fontSize: "clamp(1.75rem, 2.4vw, 2rem)",
          }}
        >
          <span className="block">{t(`${card.id}.titleLine1`)}</span>
          <span className="block italic text-[#C9A96E]">{t(`${card.id}.titleLine2`)}</span>
        </h3>
        <p
          className="text-[14px] text-[#999] leading-[1.3]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t(`${card.id}.body`)}
        </p>
      </div>
      <Link
        href={card.href}
        className="h-10 px-[22px] flex items-center gap-2 border border-[#C9A96E] text-[#C9A96E] bg-transparent group-hover:bg-[#C9A96E] group-hover:text-[#0D0D0D] hover:bg-[#C9A96E] hover:text-[#0D0D0D] transition-colors duration-500 ease-out"
      >
        <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">
          {t(`${card.id}.cta`)}
        </span>
        <ArrowRight className="size-[18px]" strokeWidth={2} />
      </Link>
    </div>
  )
}

export function JoinUsSection() {
  const t = useTranslations("aboutPage.joinUs")

  return (
    <section className="relative bg-[#0D0D0D] px-4 md:px-[82px] py-20 md:py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden
      >
        <div
          className="w-[1100px] h-[700px] max-w-full opacity-60"
          style={{
            background: "radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="relative flex flex-col gap-14 items-center w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-6 items-center w-full">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="text-white font-normal text-center leading-[1.2]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block italic text-[#C9A96E]">{t("headingLine2")}</span>
          </h2>
          <p
            className="text-[14px] text-center text-[#999] leading-[1.3] max-w-[440px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-[3px] w-full">
          {CARDS.map((c) => (
            <JoinCardBlock key={c.id} card={c} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
