"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { Shield, Home, SquareCheck, Users, Briefcase, BarChart3, type LucideIcon } from "lucide-react"

type Value = {
  icon: LucideIcon
  titleKey: string
  descKey: string
}

const VALUES: Value[] = [
  { icon: Shield, titleKey: "safety", descKey: "safetyDesc" },
  { icon: Home, titleKey: "hospitality", descKey: "hospitalityDesc" },
  { icon: SquareCheck, titleKey: "transparency", descKey: "transparencyDesc" },
  { icon: Users, titleKey: "personalization", descKey: "personalizationDesc" },
  { icon: Briefcase, titleKey: "quality", descKey: "qualityDesc" },
  { icon: BarChart3, titleKey: "sustainability", descKey: "sustainabilityDesc" },
]

function ValueCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[rgba(154,117,53,0.22)] flex flex-col gap-[15px] items-start px-6 md:px-9 py-10">
      <div className="flex items-center justify-center size-10">
        <Icon className="size-7 text-[#C9A96E]" strokeWidth={1.5} />
      </div>
      <h3
        className="text-white text-[24px] font-medium leading-none"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        {title}
      </h3>
      <p
        className="text-[#999] text-[14px] leading-[1.3]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {desc}
      </p>
    </div>
  )
}

export function ValuesSection() {
  const t = useTranslations("aboutPage.values")

  return (
    <section className="bg-[#1a1a1a] flex flex-col gap-6 items-center px-4 md:px-[82px] pt-20 md:pt-24 pb-14 md:pb-24">
      <div className="flex flex-col gap-[14px] items-center max-w-[1280px] w-full">
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
          className="text-[#999] text-[14px] text-center max-w-[540px]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("subtitle")}
        </p>
      </div>

      <div
        className="relative w-full max-w-[1280px] h-[180px] sm:h-[260px] md:h-[415px] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
        }}
      >
        <Image
          src="/about/values-fleet.png"
          alt={t("imageAlt")}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px] w-full max-w-[1280px]">
        {VALUES.map((v) => (
          <ValueCard key={v.titleKey} icon={v.icon} title={t(v.titleKey)} desc={t(v.descKey)} />
        ))}
      </div>
    </section>
  )
}
