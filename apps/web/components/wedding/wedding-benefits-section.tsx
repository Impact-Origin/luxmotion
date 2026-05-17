"use client"

import { useTranslations } from "next-intl"
import {
  CircleCheck,
  Clock,
  Pencil,
  Plane,
  Shield,
  type LucideIcon,
} from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

interface Benefit {
  icon: LucideIcon
  titleKey: string
  descKey: string
}

const BENEFITS: Benefit[] = [
  { icon: Shield, titleKey: "benefit1.title", descKey: "benefit1.desc" },
  { icon: Plane, titleKey: "benefit2.title", descKey: "benefit2.desc" },
  { icon: Clock, titleKey: "benefit3.title", descKey: "benefit3.desc" },
  { icon: CircleCheck, titleKey: "benefit4.title", descKey: "benefit4.desc" },
  { icon: Pencil, titleKey: "benefit5.title", descKey: "benefit5.desc" },
]

function BenefitCard({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon
  title: string
  desc: string
}) {
  return (
    <div className="group relative bg-white hover:bg-[#fbf4e3] border border-[rgba(168,131,58,0.1)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-colors duration-200 flex flex-col items-center gap-2 px-[22.8px] py-[32.8px] overflow-clip h-full w-full self-stretch">
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] w-0 group-hover:w-[70%] bg-gradient-to-r from-transparent via-[#a08248] to-transparent transition-[width] duration-300 ease-out" />
      <div className="size-12 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.15)] flex items-center justify-center shrink-0">
        <Icon className="size-6 text-[#a08248]" strokeWidth={1.5} />
      </div>
      <div className="pt-2 w-full">
        <h3
          className="text-[24px] leading-[1.05] font-medium text-[#1a1612] text-center"
          style={SERIF_FONT}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-[14px] leading-[1.2] text-[#7a746e] text-center w-full"
        style={SANS_FONT}
      >
        {desc}
      </p>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  headingStart,
  headingAccent,
}: {
  eyebrow: string
  headingStart: string
  headingAccent: string
}) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 items-center justify-center">
        <span className="h-px w-8 bg-[#a08248]" />
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-[#a08248]" />
      </div>
      <h2
        className="text-[32px] md:text-[48px] leading-[1.1] font-normal text-[#1a1612] text-center"
        style={SERIF_FONT}
      >
        <span>{headingStart} </span>
        <span className="italic text-[#a08248]">{headingAccent}</span>
      </h2>
    </div>
  )
}

export function WeddingBenefitsSection() {
  const t = useTranslations("wedding.benefits")

  return (
    <section className="bg-[#faf7f2] px-4 md:px-20 py-14 md:py-24 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-y-0 left-[70%] right-[-5%] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(104.6deg, rgba(201,169,110,0) 48%, rgba(201,169,110,0.024) 49%, rgba(201,169,110,0.024) 51%, rgba(201,169,110,0) 52%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto flex flex-col gap-[14px] relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          headingStart={t("headingStart")}
          headingAccent={t("headingAccent")}
        />

        <div className="hidden md:flex gap-[3px] items-stretch justify-center pt-[42px]">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex-1 min-w-0 flex">
              <BenefitCard Icon={b.icon} title={t(b.titleKey)} desc={t(b.descKey)} />
            </div>
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-[2px] pt-6">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex">
              <BenefitCard Icon={b.icon} title={t(b.titleKey)} desc={t(b.descKey)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
