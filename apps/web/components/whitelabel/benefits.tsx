"use client"

import {
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  SquareCheckBig,
  User,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

type Benefit = { id: string; Icon: LucideIcon }

const BENEFITS: Benefit[] = [
  { id: "reliable", Icon: Shield },
  { id: "certified", Icon: User },
  { id: "always", Icon: Clock },
  { id: "cancellation", Icon: SquareCheckBig },
  { id: "support", Icon: MessageSquare },
  { id: "meetingPoint", Icon: MapPin },
]

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const t = useTranslations(`whitelabel.benefits.${benefit.id}`)
  const { Icon } = benefit
  return (
    <div className="bg-[#141414] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(201,169,110,0.4)] transition-colors duration-200 flex flex-col gap-[5px] p-6">
      <div className="size-10 flex items-center justify-center bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.22)]">
        <Icon className="size-[18px] text-[#C9A96E]" strokeWidth={1.5} />
      </div>
      <h3
        className="text-[22px] lg:text-[24px] font-medium text-white leading-normal pt-2"
        style={SERIF_FONT}
      >
        {t("title")}
      </h3>
      <p
        className="text-[14px] leading-[1.2] text-[rgba(255,255,255,0.4)]"
        style={SANS_FONT}
      >
        {t("body")}
      </p>
    </div>
  )
}

export function Benefits() {
  const t = useTranslations("whitelabel.benefits")
  return (
    <section className="bg-[#0D0D0D] px-4 lg:px-[82px] pt-14 lg:pt-[72px] pb-14 lg:pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2 items-center text-center">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span
              className="text-[12px] font-medium uppercase tracking-[2px] text-[#C9A96E] leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h2
            className="text-[32px] lg:text-[48px] font-light leading-[1.1] text-white"
            style={SERIF_FONT}
          >
            {t("titlePre")}{" "}
            <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
