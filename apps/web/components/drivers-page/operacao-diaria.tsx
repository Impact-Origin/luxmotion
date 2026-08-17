"use client"

import { useTranslations } from "next-intl"

import {
  MobileSkeleton,
  PhoneStep1,
  PhoneStep2,
  PhoneStep3,
} from "@/components/shared/driver-app-phones"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

function NumberBadge({ num }: { num: number }) {
  return (
    <div className="absolute top-3.5 left-3.5 size-9 rounded-full bg-[#111110] flex items-center justify-center z-10">
      <span
        className="text-[16px] font-semibold leading-none text-[#C4973E]"
        style={SERIF_FONT}
      >
        {num}
      </span>
    </div>
  )
}

type Step = {
  num: number
  /** O ecrã da app, em px fixos; cresce por escala dentro da área de pré-visualização. */
  phone: React.ReactNode
  /** Qual dos esboços mostrar em ecrã pequeno. */
  variant: 1 | 2 | 3
  headingPre: string
  headingAccent: string
  body: string
}

function StepCard({ step }: { step: Step }) {
  return (
    <article className="group bg-white border border-[rgba(28,27,24,0.08)] flex flex-col self-stretch">
      {/* Os mesmos ecrãs da página dos motoristas individuais, e com as mesmas
          medidas: são desenhados em px minúsculos e crescem por escala, para o
          ecrã inteiro aumentar em proporção sem mexer nas medidas internas. */}
      <div className="relative bg-[#F4EFE6] h-[230px] lg:h-[320px] border-b border-[rgba(28,27,24,0.08)] shrink-0">
        <NumberBadge num={step.num} />
        <div className="hidden lg:flex h-full items-center justify-center transition-transform duration-300 ease-out scale-[1.32] group-hover:scale-[1.39]">
          {step.phone}
        </div>
        <div className="flex lg:hidden h-full">
          <MobileSkeleton variant={step.variant} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6 pb-7 flex-1">
        <h3
          className="text-[24px] leading-tight text-[#1C1B18]"
          style={SERIF_FONT}
        >
          {step.headingPre}{" "}
          <span className="italic text-[#9A7535]">{step.headingAccent}</span>
        </h3>
        <p
          className="text-[14px] leading-[1.45] text-[#696969]"
          style={SANS_FONT}
        >
          {step.body}
        </p>
      </div>
    </article>
  )
}

export function OperacaoDiaria() {
  const t = useTranslations("driversPage.operacaoDiaria")
  /* Os títulos e o texto são os desta página (empresas parceiras); o que se vê
     no telemóvel é a app, que é a mesma, e por isso vem do namespace onde
     nasceu. */
  const tNav = useTranslations("driversPage2.dailyOps.phone")

  const steps: Step[] = [
    {
      num: 1,
      phone: <PhoneStep1 tNav={tNav} />,
      variant: 1,
      headingPre: t("step1.headingPre"),
      headingAccent: t("step1.headingAccent"),
      body: t("step1.body"),
    },
    {
      num: 2,
      phone: <PhoneStep2 tNav={tNav} />,
      variant: 2,
      headingPre: t("step2.headingPre"),
      headingAccent: t("step2.headingAccent"),
      body: t("step2.body"),
    },
    {
      num: 3,
      phone: <PhoneStep3 tNav={tNav} />,
      variant: 3,
      headingPre: t("step3.headingPre"),
      headingAccent: t("step3.headingAccent"),
      body: t("step3.body"),
    },
  ]

  return (
    <section id="how-it-works" className="scroll-mt-[72px] bg-[#F7F4EF] px-4 lg:px-[82px] py-14 lg:py-24">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-2 items-start">
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
            className="text-[40px] lg:text-[48px] font-light leading-[1.05] text-[#1C1B18]"
            style={SERIF_FONT}
          >
            {t("titlePre")}{" "}
            <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
          </h2>
          <p
            className="text-[14px] leading-[1.4] text-[#696969] max-w-[480px]"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 lg:mt-10 flex flex-col lg:flex-row gap-[2px] lg:gap-[2.3px]">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex">
              <StepCard step={step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
