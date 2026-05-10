"use client"

import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

const ROW_DARK = "bg-[rgba(28,27,24,0.08)] h-2 rounded-[1px]"
const ROW_GOLD = "bg-[rgba(154,117,53,0.25)] h-2 rounded-[1px]"
const ROW_GOLD_STRONG = "bg-[rgba(154,117,53,0.3)] h-2 rounded-[1px]"
const MOCK_CARD_CLS =
  "border border-[rgba(28,27,24,0.08)] rounded-[1px] flex flex-col gap-[3px] px-[6.64px] py-[5.64px]"
const MOCK_CARD_GOLD_CLS =
  "border border-[rgba(154,117,53,0.4)] rounded-[1px] flex flex-col gap-[3px] px-[6.64px] py-[5.64px]"

function NumberBadge({ num }: { num: number }) {
  return (
    <div className="absolute top-[10px] left-[10px] size-7 rounded-full bg-[#111110] flex items-center justify-center z-10">
      <span
        className="text-[13px] lg:text-[13px] font-semibold leading-none text-[#C4973E]"
        style={SERIF_FONT}
      >
        {num}
      </span>
    </div>
  )
}

function MockTopbar() {
  return (
    <div className="bg-[#EDE8DF] border-b border-[rgba(28,27,24,0.08)] h-[20px] flex items-center gap-1 px-2 shrink-0">
      <span className="size-[5px] rounded-full bg-[#E74C3C]" />
      <span className="size-[5px] rounded-full bg-[#F39C12]" />
      <span className="size-[5px] rounded-full bg-[#2ECC71]" />
    </div>
  )
}

function MockWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-[12px] bg-white border border-[rgba(28,27,24,0.14)] rounded-[2px] shadow-[0_4px_16px_0_rgba(28,27,24,0.08)] flex flex-col overflow-hidden">
      <MockTopbar />
      <div className="flex-1 p-2 flex flex-col gap-1">{children}</div>
    </div>
  )
}

function Mockup1() {
  return (
    <>
      <div className={ROW_DARK} style={{ width: "78%" }} />
      <div className="h-1.5" />
      <div className={MOCK_CARD_CLS}>
        <div className={ROW_DARK} style={{ width: "57%" }} />
        <div className={ROW_GOLD} style={{ width: "38%" }} />
      </div>
      <div className={MOCK_CARD_CLS}>
        <div className={ROW_DARK} style={{ width: "75%" }} />
        <div className={ROW_DARK} style={{ width: "57%" }} />
      </div>
      <div className={MOCK_CARD_CLS}>
        <div className={ROW_DARK} style={{ width: "57%" }} />
        <div className={ROW_GOLD} style={{ width: "38%" }} />
      </div>
    </>
  )
}

function Mockup2() {
  return (
    <>
      <div className={ROW_DARK} style={{ width: "39%" }} />
      <div className="h-1" />
      <div className="flex-1 grid grid-cols-2 gap-1">
        <div className="flex flex-col gap-[3px]">
          <div className={`${MOCK_CARD_CLS} h-[26px]`}>
            <div className={ROW_GOLD_STRONG} style={{ width: "75%" }} />
          </div>
          <div className={`${MOCK_CARD_CLS} h-[26px]`}>
            <div className={ROW_DARK} style={{ width: "75%" }} />
          </div>
          <div className={`${MOCK_CARD_CLS} h-[26px]`}>
            <div className={ROW_DARK} style={{ width: "100%" }} />
          </div>
        </div>
        <div className="flex flex-col gap-[3px]">
          <div className={`${MOCK_CARD_GOLD_CLS} h-[26px]`}>
            <div className={ROW_GOLD} style={{ width: "100%" }} />
          </div>
          <div className={`${MOCK_CARD_CLS} h-[26px]`}>
            <div className={ROW_DARK} style={{ width: "75%" }} />
          </div>
        </div>
      </div>
    </>
  )
}

function Mockup3() {
  return (
    <>
      <div className="flex gap-1.5">
        <div className="flex-1 bg-[#F7F4EF] border border-[rgba(28,27,24,0.08)] rounded-[1px] flex flex-col gap-[3px] px-[4.64px] pt-[6.64px] pb-[4.64px]">
          <div className={ROW_DARK} style={{ width: "50%" }} />
          <div className="bg-[rgba(154,117,53,0.25)] h-[10px] rounded-[1px] w-full" />
        </div>
        <div className="flex-1 bg-[#F7F4EF] border border-[rgba(28,27,24,0.08)] rounded-[1px] flex flex-col gap-[3px] px-[4.64px] pt-[6.64px] pb-[4.64px]">
          <div className={ROW_DARK} style={{ width: "50%" }} />
          <div className="bg-[rgba(154,117,53,0.25)] h-[10px] rounded-[1px] w-[75%]" />
        </div>
        <div className="flex-1 bg-[#F7F4EF] border border-[rgba(28,27,24,0.08)] rounded-[1px] flex flex-col gap-[3px] px-[4.64px] pt-[6.64px] pb-[4.64px]">
          <div className={ROW_DARK} style={{ width: "50%" }} />
          <div className="bg-[rgba(154,117,53,0.25)] h-[10px] rounded-[1px] w-full" />
        </div>
      </div>
      <div className="h-1" />
      <div className={ROW_DARK} style={{ width: "78%" }} />
      <div className={ROW_DARK} style={{ width: "59%" }} />
      <div className={ROW_DARK} style={{ width: "78%" }} />
    </>
  )
}

type Step = {
  num: number
  preview: React.ReactNode
  headingPre: string
  headingAccent: string
  body: string
}

function StepCard({ step }: { step: Step }) {
  return (
    <article className="bg-white border border-[rgba(28,27,24,0.08)] flex flex-col self-stretch">
      <div className="relative bg-[#EDE8DF] h-[200px] border-b border-[rgba(28,27,24,0.08)] shrink-0">
        <NumberBadge num={step.num} />
        <MockWindow>{step.preview}</MockWindow>
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

  const steps: Step[] = [
    {
      num: 1,
      preview: <Mockup1 />,
      headingPre: t("step1.headingPre"),
      headingAccent: t("step1.headingAccent"),
      body: t("step1.body"),
    },
    {
      num: 2,
      preview: <Mockup2 />,
      headingPre: t("step2.headingPre"),
      headingAccent: t("step2.headingAccent"),
      body: t("step2.body"),
    },
    {
      num: 3,
      preview: <Mockup3 />,
      headingPre: t("step3.headingPre"),
      headingAccent: t("step3.headingAccent"),
      body: t("step3.body"),
    },
  ]

  return (
    <section className="bg-[#F7F4EF] px-4 lg:px-[82px] py-14 lg:py-24">
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
