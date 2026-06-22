"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-8 lg:w-[82px] bg-[#9A7535]" />
      <span
        className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function MetricCard({
  value,
  label,
}: {
  value: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <div className="bg-white px-4 py-[18px] flex flex-col gap-2 lg:gap-1 h-[150px] lg:h-auto">
      <div
        className="text-[32px] leading-[30px] flex-1 lg:flex-initial flex items-start"
        style={SERIF_FONT}
      >
        {value}
      </div>
      <p
        className="text-[12px] leading-[14px] text-[#696969] lg:text-[rgba(28,27,24,0.38)]"
        style={SANS_FONT}
      >
        {label}
      </p>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] px-[9px] py-[7px] cursor-default transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-[rgba(154,117,53,0.14)] hover:border-[rgba(154,117,53,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(154,117,53,0.45)]">
      <Check className="size-3 text-[#9A7535] shrink-0" strokeWidth={2.5} />
      <span
        className="text-[12px] font-medium text-[#9A7535] whitespace-nowrap leading-none"
        style={SANS_FONT}
      >
        {children}
      </span>
    </div>
  )
}

export function DriversHero() {
  const t = useTranslations("driversPage.hero")
  const { enter } = useEnterAnimation()

  return (
    <section className="relative isolate bg-white lg:min-h-[856px]">
      <div className="relative flex flex-col lg:flex-row items-stretch lg:min-h-[856px]">
        <div className="relative z-[3] flex flex-1 min-w-0 flex-col items-start justify-center px-4 py-10 lg:px-12 lg:py-[120px]">
          <div className={enter("delay-0")}>
            <Eyebrow label={t("eyebrow")} />
          </div>

          <h1
            className={cn(
              "mt-4 lg:mt-6 mb-6 lg:mb-[22px] text-[#1C1B18] font-light text-[48px] lg:text-[82px] leading-none",
              enter("delay-100")
            )}
            style={SERIF_FONT}
          >
            <span className="block">{t("titleLine1")}</span>
            <span>
              {t("titleLine2Pre")}{" "}
              <span className="italic text-[#9A7535]">
                {t("titleLine2Accent")}
              </span>{" "}
              <span className="lg:block font-semibold text-[#111110]">
                {t("titleLine3")}
              </span>
            </span>
          </h1>

          <div className="flex flex-col gap-6 w-full">
            <p
              className={cn(
                "text-[18px] leading-[1.3] text-[#696969]",
                enter("delay-200")
              )}
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>

            <div className={cn(
              "bg-[rgba(28,27,24,0.08)] border border-[rgba(28,27,24,0.08)] grid grid-cols-3 gap-px p-px",
              enter("delay-300")
            )}>
              <MetricCard
                value={
                  <span className="italic text-[#9A7535]">
                    €0,70–
                    <span className="not-italic text-[#111110]">€0,90</span>
                  </span>
                }
                label={t("metric1Label")}
              />
              <MetricCard
                value={
                  <span className="text-[#111110]">
                    +<span className="italic text-[#9A7535] ml-0.5">5</span>
                  </span>
                }
                label={t("metric2Label")}
              />
              <MetricCard
                value={<span className="italic text-[#9A7535]">48h</span>}
                label={t("metric3Label")}
              />
            </div>
          </div>

          <div className={cn(
            "flex flex-col gap-4 lg:gap-6 w-full mt-6 lg:mt-10",
            enter("delay-[400ms]")
          )}>
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:gap-[9px]">
              <Tag>{t("tagPayments")}</Tag>
              <Tag>{t("tagSchedule")}</Tag>
              <Tag>{t("tagExclusivity")}</Tag>
              <Tag>{t("tagSupport")}</Tag>
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-3 items-stretch lg:items-center">
              <Link
                href="/partners/apply"
                className="group h-12 inline-flex items-center justify-center px-6 py-[9px] bg-[#0D0D0D] text-white hover:bg-[#9A7535] hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
              >
                <span
                  className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]"
                  style={SANS_FONT}
                >
                  {t("ctaPrimary")}
                </span>
                <ArrowRight
                  className="size-[18px] transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
              <Link
                href="#how-it-works"
                className="group h-12 inline-flex items-center justify-center px-6 py-[9px] border border-[rgba(28,27,24,0.08)] text-[#999] hover:text-[#9A7535] hover:border-[#9A7535] transition-colors duration-200"
              >
                <span
                  className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]"
                  style={SANS_FONT}
                >
                  {t("ctaSecondary")}
                </span>
                <Info className="size-[18px]" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-px w-px z-[2]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(154,117,53,0), rgba(154,117,53,0.6) 50%, rgba(154,117,53,0))",
          }}
        />

        <div className="hidden lg:flex flex-1 min-w-0 self-stretch z-[1] bg-[#E2DAD0] gap-[2px]">
          <div className="relative w-1/2 overflow-hidden bg-[#EDE8DF]">
            <Image
              src="/drivers/hero-mercedes-interior.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw"
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="relative w-1/2 flex flex-col gap-[2px]">
            <div className="relative flex-[441] overflow-hidden">
              <Image
                src="/drivers/hero-chauffeur.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw"
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="relative flex-[412] overflow-hidden">
              <Image
                src="/drivers/hero-van.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw"
                className="object-cover object-[39%_center]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
