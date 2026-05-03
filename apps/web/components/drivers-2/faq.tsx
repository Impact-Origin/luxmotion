"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { AnimatedCollapse } from "@/components/checkout/shared/animated-collapse"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span
          className="text-[14px] lg:text-[12px] font-medium text-[#1C1B18] leading-[1.2] flex-1"
          style={SANS_FONT}
        >
          {question}
        </span>
        <span className="size-8 border border-[rgba(160,159,158,0.19)] flex items-center justify-center shrink-0 transition-colors hover:border-[#9A7535]">
          {isOpen ? (
            <Minus className="size-[18px] text-[#1C1B18]" strokeWidth={1.5} />
          ) : (
            <Plus className="size-[18px] text-[#1C1B18]" strokeWidth={1.5} />
          )}
        </span>
      </button>
      <AnimatedCollapse isOpen={isOpen}>
        <p
          className="px-6 pb-5 -mt-1 text-[13px] leading-[1.55] text-[#696969]"
          style={SANS_FONT}
        >
          {answer}
        </p>
      </AnimatedCollapse>
    </div>
  )
}

export function FaqDrivers2() {
  const t = useTranslations("driversPage2.faq")
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <section className="bg-[#F7F4EF] px-4 lg:px-[82px] py-14 lg:py-20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-[82px] bg-[#9A7535]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>
        <h2
          className="text-[32px] lg:text-[44px] font-light leading-[1.2] text-[#1C1B18]"
          style={SERIF_FONT}
        >
          {t("titlePre")}{" "}
          <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 grid-flow-row lg:grid-flow-col gap-x-0 lg:gap-x-[2.64px] gap-y-[2.3px] mt-8 lg:mt-10">
          {FAQ_KEYS.map((key) => (
            <FaqItem
              key={key}
              question={t(`${key}.question`)}
              answer={t(`${key}.answer`)}
              isOpen={openKey === key}
              onToggle={() => setOpenKey(openKey === key ? null : key)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
