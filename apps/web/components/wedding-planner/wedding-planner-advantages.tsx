"use client"

import { useTranslations } from "next-intl"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const ITEMS = [1, 2, 3, 4, 5, 6] as const

function AdvantageCard({
  n,
  question,
  answer,
}: {
  n: number
  question: string
  answer: string
}) {
  return (
    <div
      className="bg-white border border-[rgba(28,27,24,0.08)] p-[25px] flex flex-col gap-2"
      style={SANS_FONT}
    >
      <div className="flex items-center gap-[10px]">
        <span className="size-7 shrink-0 inline-flex items-center justify-center bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)]">
          <span className="text-[14px] font-extrabold leading-[17.16px] text-[#9a7535] opacity-50">
            {n}
          </span>
        </span>
        <span className="flex-1 min-w-0 text-[14px] font-semibold text-[#1c1b18] leading-[23.23px]">
          {question}
        </span>
      </div>
      <p className="pl-[38px] text-[14px] text-[#696969] leading-[1.2]">{answer}</p>
    </div>
  )
}

export function WeddingPlannerAdvantages() {
  const t = useTranslations("weddingPlanner.advantages")

  return (
    <section className="bg-white px-4 md:px-12 pt-10 pb-14">
      <div className="max-w-[1100px] mx-auto flex flex-col">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#a08248]" />
          </div>
          <h2
            className="text-[32px] md:text-[48px] leading-[1.1] text-[#1c1b18] text-center font-normal"
            style={SERIF_FONT}
          >
            {t("titleStart")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>
            {t("titleEnd")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-[2px] mt-8">
          {ITEMS.map((n) => (
            <AdvantageCard
              key={n}
              n={n}
              question={t(`q${n}`)}
              answer={t(`a${n}`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
