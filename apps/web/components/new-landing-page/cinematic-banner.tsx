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

      <div className="relative px-6 md:px-12 lg:px-[82px] pt-10 md:pt-12 lg:pt-[39px] pb-12 md:pb-16 lg:pb-[39px]">
        <div className="relative max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          <div
            className="flex flex-col lg:flex-1"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            <p className="font-light text-[32px] md:text-[40px] leading-none text-white">
              {t("line1")}
            </p>
            <p className="font-light italic text-[32px] md:text-[40px] leading-none text-[#C9A96E]">
              {t("line2")}
            </p>
          </div>

          <Link
            href="/#services"
            className="group inline-flex items-center justify-center h-12 border border-[#C9A96E] px-[22px] py-[9px] hover:bg-[rgba(201,169,110,0.08)] transition-colors w-full lg:w-fit shrink-0 self-stretch lg:self-auto"
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
