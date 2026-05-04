"use client"

import { useState } from "react"
import { ClockFading, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  LightFileUpload,
  NumberedSectionHeader,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

const QUESTION_KEYS = ["q1", "q2"] as const
const STRUCTURE_KEYS = ["s1", "s2", "s3", "s4"] as const

function VideoPlaceholder({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative w-full aspect-video bg-[#0d0d0d] flex items-center justify-center group"
    >
      <span className="size-12 bg-[#a08248] flex items-center justify-center group-hover:bg-[#b89558] transition-colors">
        <Play size={20} strokeWidth={1.6} className="text-white translate-x-[1px]" fill="currentColor" />
      </span>
    </button>
  )
}

function DurationBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-[14px] py-[6px] self-start">
      <ClockFading size={14} strokeWidth={1.6} className="text-[#a08248]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a08248] leading-none">
        {label}
      </span>
    </span>
  )
}

function QuestionCard({ eyebrow, prompt, translation }: { eyebrow: string; prompt: string; translation: string }) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.08)] flex flex-col gap-3 px-6 py-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a08248] leading-none">
        {eyebrow}
      </span>
      <p className="text-[16px] font-semibold text-[#1c1b18] leading-[1.35]">
        {prompt}
      </p>
      <p className="text-[13px] italic text-[#696969] leading-[1.4]">
        {translation}
      </p>
    </div>
  )
}

function StructureRow({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.08)] flex items-center gap-4 px-4 py-3">
      <div className="size-8 shrink-0 bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[14px] font-semibold text-[#9a7535]">
        {index}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#1c1b18] leading-none">{title}</span>
        <span className="text-[12px] text-[#696969] leading-[1.3]">{description}</span>
      </div>
    </div>
  )
}

export function DriverStepVideoIntro() {
  const t = useTranslations("driverApplication.stepVideoIntro")
  const tCommon = useTranslations("common")
  const { state, updateVideoIntro, nextStep, prevStep } = useDriverApplication()
  const { videoIntro } = state
  const [, setError] = useState<string>("")

  const removeLabel = tCommon("remove") || "Remove"
  const canContinue = videoIntro.videoFile !== null

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-col gap-3 w-full">
        <NumberedSectionHeader index={1} label={t("watch.label")} />
        <p className="text-[13px] italic text-[#696969] leading-[1.35]">
          {t("watch.subtitle")}
        </p>
        <VideoPlaceholder label={t("watch.label")} />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <NumberedSectionHeader index={2} label={t("questions.label")} />
        <DurationBadge label={t("questions.duration")} />
        <div className="flex flex-col gap-3">
          {QUESTION_KEYS.map((key, i) => (
            <QuestionCard
              key={key}
              eyebrow={t("questions.eyebrow", { index: i + 1 })}
              prompt={t(`questions.${key}.prompt`)}
              translation={t(`questions.${key}.translation`)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <NumberedSectionHeader index={3} label={t("structure.label")} />
        <p className="text-[12px] text-[#696969] leading-[1.3]">
          {t("structure.subtitle")}
        </p>
        <div className="bg-[#f3eee5] flex flex-col gap-2 p-4">
          {STRUCTURE_KEYS.map((key, i) => (
            <StructureRow
              key={key}
              index={i + 1}
              title={t(`structure.${key}.title`)}
              description={t(`structure.${key}.description`)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <NumberedSectionHeader index={4} label={t("upload.label")} />
        <LightFileUpload
          value={videoIntro.videoFile}
          onChange={(file) => updateVideoIntro({ videoFile: file })}
          accept="video/mp4,video/quicktime"
          maxSizeMb={100}
          idleTitle={t("upload.idleTitle")}
          idleSubtitle={t("upload.hint")}
          removeLabel={removeLabel}
          onError={setError}
          sizeErrorLabel={t("upload.sizeError")}
        />
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
