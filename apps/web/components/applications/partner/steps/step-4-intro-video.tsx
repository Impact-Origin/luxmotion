"use client"

import { ClockFading, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  NumberedSectionHeader,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication } from "../partner-application-context"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

function VideoPlaceholder({ ariaLabel }: { ariaLabel: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="relative w-full h-[300px] bg-[#0d0d0d] flex items-center justify-center group"
    >
      <span className="size-12 rounded-full bg-[#c9a96e] flex items-center justify-center transition-transform group-hover:scale-105">
        <Play size={20} strokeWidth={2} className="text-white translate-x-[1px]" fill="white" />
      </span>
    </button>
  )
}

function QuestionCard({
  index,
  question,
  translation,
  eyebrowPrefix,
}: {
  index: number
  question: string
  translation: string
  eyebrowPrefix: string
}) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.08)] flex flex-col gap-3 px-6 py-4 w-full">
      <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#a08248] leading-none">
        {eyebrowPrefix} {index}
      </span>
      <p
        className="text-[18px] font-semibold leading-tight text-black"
        style={SERIF_FONT}
      >
        {question}
      </p>
      <p className="text-[14px] leading-tight text-[#696969]">{translation}</p>
    </div>
  )
}

function StructureRow({
  index,
  title,
  detail,
  isLast,
}: {
  index: number
  title: string
  detail: string
  isLast?: boolean
}) {
  return (
    <div
      className={
        "flex items-start gap-3 px-4 py-2 w-full" +
        (isLast ? "" : " border-b border-[rgba(28,27,24,0.08)]")
      }
    >
      <div className="size-8 shrink-0 bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[14px] font-semibold text-[#a08248] leading-none">
        {index}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <p className="text-[14px] font-semibold text-[#0d0d0d] leading-tight">{title}</p>
        <p className="text-[14px] text-[#696969] leading-tight">{detail}</p>
      </div>
    </div>
  )
}

export function PartnerStepIntroVideo() {
  const t = useTranslations("partnerApplication.stepIntroVideo")
  const tCommon = useTranslations("common")
  const { nextStep, prevStep } = usePartnerApplication()

  const questions = [
    { question: t("questions.q1.question"), translation: t("questions.q1.translation") },
    { question: t("questions.q2.question"), translation: t("questions.q2.translation") },
  ]

  const structure = [
    { title: t("structure.s1.title"), detail: t("structure.s1.detail") },
    { title: t("structure.s2.title"), detail: t("structure.s2.detail") },
    { title: t("structure.s3.title"), detail: t("structure.s3.detail") },
    { title: t("structure.s4.title"), detail: t("structure.s4.detail") },
  ]

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="flex flex-col gap-4 w-full">
        <NumberedSectionHeader index={1} label={t("section1.label")} />
        <p className="text-[14px] italic leading-tight text-[#696969]">
          {t("section1.description")}
        </p>
        <VideoPlaceholder ariaLabel={t("section1.label")} />
      </section>

      <section className="flex flex-col gap-4 w-full">
        <NumberedSectionHeader index={2} label={t("section2.label")} />
        <div className="inline-flex self-start items-center gap-2 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-[14.8px] py-[5.8px]">
          <ClockFading size={16} strokeWidth={1.6} className="text-[#a08248]" />
          <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#a08248] leading-none">
            {t("section2.durationBadge")}
          </span>
        </div>
        {questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            index={idx + 1}
            question={q.question}
            translation={q.translation}
            eyebrowPrefix={t("section2.questionPrefix")}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4 w-full">
        <NumberedSectionHeader index={3} label={t("section3.label")} />
        <p className="text-[10px] leading-tight text-[#696969]">{t("section3.description")}</p>
        <div className="bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex flex-col gap-4 p-4 w-full">
          {structure.map((row, idx) => (
            <StructureRow
              key={idx}
              index={idx + 1}
              title={row.title}
              detail={row.detail}
              isLast={idx === structure.length - 1}
            />
          ))}
        </div>
      </section>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue
      />
    </form>
  )
}
