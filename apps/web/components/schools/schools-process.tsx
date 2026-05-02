"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const STEP_KEYS = ["pickup", "transit", "arrival"] as const

function StepBadge({ n, withTrail }: { n: number; withTrail: boolean }) {
  return (
    <div className="relative size-[44px] shrink-0">
      <div className="size-full rounded-full bg-[#a08248] flex items-center justify-center">
        <span
          className="text-[18px] font-bold text-white leading-none"
          style={SERIF_FONT}
        >
          {n}
        </span>
      </div>
      {withTrail ? (
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-full w-[2px] h-[68px] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #a08248, rgba(201,169,110,0))",
          }}
        />
      ) : null}
    </div>
  )
}

function ProcessStep({
  n,
  title,
  body,
  divider,
  withTrail,
}: {
  n: number
  title: string
  body: string
  divider: boolean
  withTrail: boolean
}) {
  return (
    <div
      className={
        "flex gap-5 items-start pt-6 " +
        (divider ? "pb-[24.8px] border-b-[0.8px] border-[#e2e8f0]" : "pb-6")
      }
    >
      <StepBadge n={n} withTrail={withTrail} />
      <div className="flex flex-col gap-[5.35px] items-start min-w-0 flex-1">
        <h3
          className="text-[14px] font-semibold leading-[1.2] text-[#0d0d0d]"
          style={SANS_FONT}
        >
          {title}
        </h3>
        <p
          className="text-[14px] leading-[1.2] text-[#696969]"
          style={SANS_FONT}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

export function SchoolsProcess() {
  const t = useTranslations("schools.process")

  return (
    <section className="bg-[#fafafa] px-4 md:px-[82px] pt-[72px] pb-[56px] md:pb-[101px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[7.1px] items-center">
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#a08248]" />
          </div>

          <h2
            className="text-[40px] md:text-[48px] leading-none text-[#0d0d0d] text-center font-normal"
            style={SERIF_FONT}
          >
            {t("title")}
          </h2>
        </div>

        <p
          className="text-[14px] leading-[1.2] text-[#696969] text-center max-w-[480px] px-2"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-center pt-[40.9px] w-full">
          <div className="flex flex-col w-full md:max-w-[604px]">
            {STEP_KEYS.map((key, i) => (
              <ProcessStep
                key={key}
                n={i + 1}
                title={t(`steps.${key}.title`)}
                body={t(`steps.${key}.body`)}
                divider={i < STEP_KEYS.length - 1}
                withTrail={i < STEP_KEYS.length - 1}
              />
            ))}
          </div>

          <div className="relative w-full md:w-[648.572px] aspect-[648/401] mx-auto">
            <Image
              src="/schools/process-bus.png"
              alt={t("photoAlt")}
              fill
              sizes="(max-width: 768px) 430px, 648px"
              className="object-contain pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute pointer-events-none w-[639.264px] h-[154.563px] left-1/2 -translate-x-1/2 bottom-0"
              style={{
                background:
                  "linear-gradient(to top, #fafafa 29.07%, rgba(255,255,255,0) 87.541%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
