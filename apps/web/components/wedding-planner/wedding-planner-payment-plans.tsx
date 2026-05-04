"use client"

import { useTranslations } from "next-intl"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type Plan = {
  name: string
  sub: string
  text: string
  recommended?: boolean
  badge?: string
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative bg-white flex flex-col gap-1 items-stretch p-[24.8px] flex-1 min-w-0 ${
        plan.recommended
          ? "border border-[#9a7535]"
          : "border border-[rgba(28,27,24,0.08)]"
      }`}
    >
      {plan.recommended && plan.badge && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-px bg-[#9a7535] px-[8px] py-[4px]">
          <span
            className="text-[9px] font-semibold text-white text-center tracking-[1px] uppercase leading-none whitespace-nowrap"
            style={SANS}
          >
            {plan.badge}
          </span>
        </div>
      )}
      <p
        className="text-[18px] font-semibold text-[#1c1b18] text-center leading-[31.68px] w-full"
        style={SERIF}
      >
        {plan.name}
      </p>
      <p
        className="text-[14px] font-semibold text-[#9a7535] text-center leading-[17.95px] w-full"
        style={SANS}
      >
        {plan.sub}
      </p>
      <p
        className="text-[14px] text-[rgba(28,27,24,0.62)] text-center leading-[1.2] w-full pt-2"
        style={SANS}
      >
        {plan.text}
      </p>
    </div>
  )
}

export function WeddingPlannerPaymentPlans() {
  const t = useTranslations("weddingPlanner.paymentPlans")

  const plans: Plan[] = [
    { name: t("p1.name"), sub: t("p1.sub"), text: t("p1.text") },
    { name: t("p2.name"), sub: t("p2.sub"), text: t("p2.text"), recommended: true, badge: t("recommended") },
    { name: t("p3.name"), sub: t("p3.sub"), text: t("p3.text") },
  ]

  return (
    <section className="bg-white px-4 md:px-[82px] pt-[71px] pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-2 items-center">
        <div className="flex gap-2 items-center justify-center">
          <div className="w-8 h-px bg-[#a08248]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
            style={SANS}
          >
            {t("eyebrow")}
          </span>
          <div className="w-8 h-px bg-[#a08248]" />
        </div>
        <h2
          className="text-[36px] md:text-[48px] text-[#1c1b18] text-center leading-none"
          style={SERIF}
        >
          {t("titleStart")} <em className="not-italic italic text-[#a08248]" style={SERIF}>{t("titleAccent")}</em>
        </h2>

        <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-6 md:gap-4 items-stretch justify-center pt-8">
          {plans.map((p, i) => (
            <PlanCard key={i} plan={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
