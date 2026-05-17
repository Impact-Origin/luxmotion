"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Clock,
  DollarSign,
  Heart,
  MessageSquare,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

type Benefit = {
  key: "punctual" | "comfort" | "drivers" | "chaperone" | "support" | "pricing"
  Icon: LucideIcon
}

const BENEFITS: Benefit[] = [
  { key: "punctual", Icon: Clock },
  { key: "comfort", Icon: Shield },
  { key: "drivers", Icon: Heart },
  { key: "chaperone", Icon: User },
  { key: "support", Icon: MessageSquare },
  { key: "pricing", Icon: DollarSign },
]

function BenefitCard({
  Icon,
  title,
  body,
}: {
  Icon: LucideIcon
  title: string
  body: string
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-[rgba(154,117,53,0.4)] hover:bg-[rgba(154,117,53,0.04)] transition-colors duration-200 flex flex-col gap-[6.4px] items-start px-[24.8px] py-[28.8px] overflow-hidden h-full">
      <div className="size-12 bg-[rgba(154,117,53,0.07)] flex items-center justify-center shrink-0">
        <Icon className="size-[22px] text-[#a08248]" strokeWidth={1.75} />
      </div>
      <div className="pt-[7.6px] w-full">
        <h3
          className="text-[14px] md:text-[15px] font-semibold leading-[1.2] text-[#0d0d0d]"
          style={SANS_FONT}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-[13px] md:text-[13px] leading-[1.45] text-[#696969] w-full"
        style={SANS_FONT}
      >
        {body}
      </p>
    </div>
  )
}

export function SchoolsBenefits() {
  const t = useTranslations("schools.benefits")
  const headerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-[#fafafa] px-4 md:px-[52px] py-[72px]">
      <div className="flex flex-col gap-6 items-center max-w-[1280px] mx-auto">
        <div
          ref={headerRef}
          className={`flex flex-col gap-2 items-center w-full transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 md:w-[82px] bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 md:w-[82px] bg-[#a08248]" />
          </div>

          <h2
            className="text-[32px] md:text-[48px] leading-none text-[#0d0d0d] text-center font-normal px-2"
            style={SERIF_FONT}
          >
            {t("title1")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>{" "}
            {t("title2")}
          </h2>
        </div>

        <p
          className={`text-[18px] leading-[1.3] text-[#696969] text-center max-w-[820px] px-2 transition-all duration-700 ease-out delay-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px] w-full">
          {BENEFITS.map(({ key, Icon }) => (
            <BenefitCard
              key={key}
              Icon={Icon}
              title={t(`items.${key}.title`)}
              body={t(`items.${key}.body`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
