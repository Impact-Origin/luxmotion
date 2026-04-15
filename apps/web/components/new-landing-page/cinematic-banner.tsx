"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function CinematicBanner() {
  const t = useTranslations("cinematicBanner")

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to right, #0a0a0a 0%, #1a1005 50%, #0a0a0a 100%)",
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1535px] h-[960px] pointer-events-none select-none">
        <Image
          src="/cinematic/lines-grid.svg"
          alt=""
          fill
          className="object-cover"
          unoptimized
          aria-hidden
        />
      </div>

      <div className="relative w-full h-[340px] md:h-[480px] lg:h-[590px]">
        <div
          className="absolute inset-0"
          style={{
            maskImage: "url('/cinematic/mask.svg')",
            WebkitMaskImage: "url('/cinematic/mask.svg')",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          <Image
            src="/cinematic/hero.png"
            alt={t("photoAlt")}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <div className="relative px-4 pb-16 md:pb-20">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,169,110,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto flex flex-col items-center gap-5 pt-4">
          <div
            className="flex flex-col items-center text-center"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            <p className="font-light text-[32px] md:text-[40px] leading-none text-white">
              {t("line1")}
            </p>
            <p className="font-light italic text-[32px] md:text-[40px] leading-tight text-[#C9A96E]">
              {t("line2")}
            </p>
          </div>

          <p
            className="text-[14px] text-[#999] text-center max-w-[420px] leading-[1.4]"
            style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>

          <Link
            href="/#services"
            className="group inline-flex items-center h-12 border border-[#C9A96E] px-[22px] py-[9px] hover:bg-[rgba(201,169,110,0.08)] transition-colors w-fit shrink-0 mt-2"
          >
            <span
              className="px-2 text-[14px] tracking-[1.1px] uppercase text-[#C9A96E] font-medium whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
            >
              {t("cta")}
            </span>
            <ArrowRight
              className="size-[18px] text-[#C9A96E] transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
