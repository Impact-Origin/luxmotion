"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const RADIAL_BG =
  "radial-gradient(ellipse 864px 149px at 50% 46%, rgba(26,16,5,1) 0%, rgba(13,13,13,1) 100%), linear-gradient(90deg, #111110 0%, #111110 100%)"

export function WeddingPlannerCtaBand() {
  const t = useTranslations("weddingPlanner.ctaBand")
  const { ref, reveal } = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      className="px-10 py-12"
      style={{ backgroundImage: RADIAL_BG }}
    >
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2
          className={cn("text-[36px] md:text-[48px] text-[#f7f4ef] text-center leading-[0.99] max-w-[460px]", reveal())}
          style={SERIF}
        >
          {t("titleStart")}{" "}
          <em className="not-italic italic text-[#c9a96e]" style={SERIF}>
            {t("titleAccent")}
          </em>
        </h2>
        <p
          className={cn("text-[16px] md:text-[18px] text-white text-center leading-[1.3] max-w-[581px] pb-4", reveal())}
          style={{ ...SANS, transitionDelay: "140ms" }}
        >
          {t("subtitle")}
        </p>
        <Link
          href="https://www.easytransferportugal.com/hotels/candidatura"
          target="_blank"
          rel="noopener noreferrer"
          className={cn("group bg-[#a08248] hover:bg-[#8e7240] transition-colors h-12 inline-flex items-center px-6 py-[9px]", reveal())}
          style={{ transitionDelay: "280ms" }}
      >
        <span
          className="text-[14px] font-medium text-white tracking-[1.1px] uppercase px-2"
          style={SANS}
        >
          {t("cta")}
        </span>
        <ArrowRight className="w-[14px] h-[14px] text-white transition-transform duration-300 ease-out group-hover:translate-x-1" strokeWidth={2} />
      </Link>
      </div>
    </section>
  )
}
