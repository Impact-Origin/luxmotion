"use client"

import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const


import {
  MobileSkeleton,
  PhoneStep1,
  PhoneStep2,
  PhoneStep3,
} from "@/components/shared/driver-app-phones"

function StepCard({
  num,
  variant,
  phone,
  headingPre,
  headingAccent,
  headingPost,
  body,
}: {
  num: string
  variant: 1 | 2 | 3
  phone: React.ReactNode
  headingPre: string
  headingAccent: string
  headingPost?: string
  body: string
}) {
  return (
    <div className="group bg-white border border-[rgba(28,27,24,0.08)] flex flex-col flex-1 min-w-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[rgba(154,117,53,0.35)] hover:shadow-[0_18px_40px_-16px_rgba(28,27,24,0.28)]">
      <div className="relative bg-[#F4EFE6] border-b border-[rgba(28,27,24,0.08)] h-[230px] lg:h-[320px]">
        {/* O telemóvel é desenhado em px fixos e minúsculos, por isso cresce por
            escala — assim o ecrã inteiro aumenta em proporção, sem mexer em
            nenhuma das medidas internas. */}
        <div className="hidden lg:flex h-full items-center justify-center transition-transform duration-300 ease-out scale-[1.32] group-hover:scale-[1.39]">
          {phone}
        </div>
        <div className="flex lg:hidden h-full">
          <MobileSkeleton variant={variant} />
        </div>
        <div className="absolute bg-[#111110] left-3.5 top-3.5 rounded-full size-9 flex items-center justify-center">
          <span
            className="text-[#c4973e] text-[16px] font-semibold leading-none"
            style={SERIF_FONT}
          >
            {num}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[9px] pt-7 pb-8 px-7">
        <h3
          className="text-[22px] text-[#1C1B18] leading-normal"
          style={SERIF_FONT}
        >
          {headingPre}{" "}
          <span className="italic text-[#9A7535]">{headingAccent}</span>
          {headingPost && <> {headingPost}</>}
        </h3>
        <p
          className="text-[16px] leading-[24px] text-[rgba(28,27,24,0.62)]"
          style={SANS_FONT}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

export function DailyOps2() {
  const t = useTranslations("driversPage2.dailyOps")
  const tNav = useTranslations("driversPage2.dailyOps.phone")

  return (
    <section id="how-it-works" className="scroll-mt-[72px] bg-[#F7F4EF] px-4 lg:px-[82px] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-px w-[82px] bg-[#9A7535]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none whitespace-nowrap"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>

        <h2
          className="mt-3 text-[32px] lg:text-[44px] leading-[1.2] font-light text-[#1C1B18]"
          style={SERIF_FONT}
        >
          {t("titleStart")}
          <br />
          {t("titlePre")}{" "}
          <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
        </h2>

        <p
          className="mt-3 text-[14px] leading-[1.2] text-[#696969] max-w-[480px]"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-[2.3px] mt-11">
          <StepCard
            num="1"
            variant={1}
            phone={<PhoneStep1 tNav={tNav} />}
            headingPre={t("step1.headingPre")}
            headingAccent={t("step1.headingAccent")}
            body={t("step1.body")}
          />
          <StepCard
            num="2"
            variant={2}
            phone={<PhoneStep2 tNav={tNav} />}
            headingPre={t("step2.headingPre")}
            headingAccent={t("step2.headingAccent")}
            headingPost={t("step2.headingPost")}
            body={t("step2.body")}
          />
          <StepCard
            num="3"
            variant={3}
            phone={<PhoneStep3 tNav={tNav} />}
            headingPre={t("step3.headingPre")}
            headingAccent={t("step3.headingAccent")}
            body={t("step3.body")}
          />
        </div>
      </div>
    </section>
  )
}
