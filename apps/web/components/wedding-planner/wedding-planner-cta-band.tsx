"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const RADIAL_BG =
  "radial-gradient(ellipse 864px 149px at 50% 46%, rgba(26,16,5,1) 0%, rgba(13,13,13,1) 100%), linear-gradient(90deg, #111110 0%, #111110 100%)"

export function WeddingPlannerCtaBand() {
  const t = useTranslations("weddingPlanner.ctaBand")

  return (
    <section
      className="flex flex-col gap-6 items-center justify-center px-10 py-12"
      style={{ backgroundImage: RADIAL_BG }}
    >
      <h2
        className="text-[36px] md:text-[48px] text-[#f7f4ef] text-center leading-[0.99] max-w-[460px]"
        style={SERIF}
      >
        {t("titleStart")}{" "}
        <em className="not-italic italic text-[#c9a96e]" style={SERIF}>
          {t("titleAccent")}
        </em>
      </h2>
      <p
        className="text-[16px] md:text-[18px] text-white text-center leading-[1.3] max-w-[581px] pb-4"
        style={SANS}
      >
        {t("subtitle")}
      </p>
      <Link
        href="/partners/apply?type=wedding"
        className="bg-[#a08248] hover:bg-[#8e7240] transition-colors h-12 inline-flex items-center px-6 py-[9px]"
      >
        <span
          className="text-[14px] font-medium text-white tracking-[1.1px] uppercase px-2"
          style={SANS}
        >
          {t("cta")}
        </span>
        <ArrowRight className="w-[14px] h-[14px] text-white" strokeWidth={2} />
      </Link>
    </section>
  )
}
