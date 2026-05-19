"use client"

import { useTranslations } from "next-intl"
import { Award, Plane, ShieldCheck, MessageSquare, type LucideIcon } from "lucide-react"

type Stat = {
  icon: LucideIcon
  valueKey: string
  labelKey: string
}

const STATS: Stat[] = [
  { icon: Award, valueKey: "stats.rating.value", labelKey: "stats.rating.label" },
  { icon: Plane, valueKey: "stats.transfers.value", labelKey: "stats.transfers.label" },
  { icon: ShieldCheck, valueKey: "stats.safety.value", labelKey: "stats.safety.label" },
  { icon: MessageSquare, valueKey: "stats.support.value", labelKey: "stats.support.label" },
]

function StatCell({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="group relative bg-[#1a1a1a] hover:bg-[#222020] transition-colors duration-500 ease-out flex flex-col items-center justify-center gap-[6px] h-[170px] px-8 py-9 overflow-hidden">
      <Icon size={24} className="text-[#C9A96E] shrink-0" strokeWidth={1.5} />
      <p
        className="text-[#C9A96E] text-[42px] font-light leading-[42px] text-center whitespace-nowrap"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        {value}
      </p>
      <p
        className="text-[#8c8680] text-[12px] font-medium uppercase tracking-[1.2px] text-center"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {label}
      </p>
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-0 h-px w-full -translate-x-1/2 origin-center scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(201,169,110,0) 8%, #C9A96E 50%, rgba(201,169,110,0) 92%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-2px] h-[5px] w-[5px] rounded-full bg-[#C9A96E] -translate-x-1/2 opacity-0 scale-0 transition-all duration-500 ease-out delay-100 group-hover:opacity-100 group-hover:scale-100"
        style={{ boxShadow: "0 0 8px rgba(201,169,110,0.6)" }}
      />
    </div>
  )
}

export function WhoIsSection() {
  const t = useTranslations("aboutPage.whoIsSection")

  return (
    <section id="our-story" className="scroll-mt-[56px] bg-[#1a1a1a] border-y border-[rgba(201,169,110,0.08)] px-4 md:px-[82px] py-20">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-20 items-center">
        <div className="w-full lg:w-[598px] shrink-0 flex flex-col gap-[26px]">
          <div className="flex items-center gap-2">
            <div className="w-[82px] h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h2
            className="text-white font-normal leading-none"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block italic text-[#C9A96E]">{t("headingLine2")}</span>
          </h2>
          <p
            className="text-[14px] leading-[1.2] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("body1")}
          </p>
          <p
            className="text-[14px] leading-[1.2] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("body2")}
          </p>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-px bg-[rgba(201,169,110,0.08)]">
          {STATS.map((s) => (
            <StatCell
              key={s.labelKey}
              icon={s.icon}
              value={t(s.valueKey)}
              label={t(s.labelKey)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
