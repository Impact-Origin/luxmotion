"use client"

import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const STAT_KEYS = [
  { value: "stat1.value", label: "stat1.label" },
  { value: "stat2.value", label: "stat2.label" },
  { value: "stat3.value", label: "stat3.label" },
  { value: "stat4.value", label: "stat4.label" },
] as const

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="group relative bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 px-[28.8px] pt-[37.6px] pb-[36.8px] flex-1 min-w-0 self-stretch">
      <span className="absolute top-0 inset-x-0 h-[2px] bg-[#a8833a] opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out" />
      <div
        className="text-[60px] leading-[60px] font-light text-[#a8833a] text-center whitespace-nowrap"
        style={SERIF_FONT}
      >
        {value}
      </div>
      <div
        className="text-[12px] leading-[1.2] font-semibold uppercase tracking-[1px] text-[#7a746e] text-center whitespace-pre-line"
        style={SANS_FONT}
      >
        {label}
      </div>
    </div>
  )
}

export function WeddingWhitelabelMetrics() {
  const t = useTranslations("weddingWhitelabel.metrics")
  const { ref, reveal } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#faf7f2] border-y border-y-[rgba(168,131,58,0.1)] px-4 md:px-20 py-10 md:py-20">
      <div ref={ref} className="max-w-[1280px] mx-auto flex flex-col items-center gap-2">
        <h2
          className={cn(
            "text-[32px] md:text-[48px] leading-[1.1] md:leading-[52.8px] font-normal md:font-light text-[#1a1612] text-center",
            reveal(),
          )}
          style={SERIF_FONT}
        >
          <span className="md:whitespace-nowrap">{t("taglineStart")} </span>
          <span className="italic font-normal text-[#a8833a]" style={SERIF_FONT}>
            {t("taglineAccent")}
          </span>
          <span className="md:whitespace-nowrap">{t("taglineEnd")}</span>
        </h2>

        <p
          className={cn(
            "text-[18px] leading-[1.3] text-[#696969] text-center max-w-[520px] md:max-w-[760px] text-balance",
            reveal(),
          )}
          style={{ ...SANS_FONT, transitionDelay: "120ms" }}
        >
          {t("subtitle")}
        </p>

        <div className="w-full pt-12 flex flex-col md:flex-row md:items-stretch gap-[3px]">
          {STAT_KEYS.map((s, i) => (
            <div
              key={i}
              className={cn("flex flex-1 min-w-0", reveal())}
              style={{ transitionDelay: `${240 + i * 110}ms` }}
            >
              <StatCard value={t(s.value)} label={t(s.label)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
