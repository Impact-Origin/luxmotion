"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useIsMobile } from "@/hooks/use-is-mobile"

const logos = [
  { name: "American Airlines", src: "/shared/logos/american-airlines.webp" },
  { name: "Bentley", src: "/shared/logos/bentley.webp" },
  { name: "BMW", src: "/shared/logos/bmw.webp" },
  { name: "Emirates", src: "/shared/logos/emirates.webp" },
  { name: "Four Seasons", src: "/shared/logos/four-seasons.webp" },
  { name: "Hilton", src: "/shared/logos/hilton.webp" },
  { name: "Mercedes-Benz", src: "/shared/logos/mercedes-benz.webp" },
  { name: "NetJets", src: "/shared/logos/netjets.webp" },
  { name: "Pestana", src: "/shared/logos/pestana.webp" },
  { name: "TAP", src: "/shared/logos/tap.webp" },
  { name: "Vila Galé", src: "/shared/logos/vila-gale.webp" },
]

function LogoStrip() {
  return (
    <div className="flex gap-[24px] md:gap-[48px] px-4 py-2 shrink-0">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="group relative w-[140px] md:w-[160px] lg:w-[180px] h-[70px] md:h-[80px] lg:h-[90px] shrink-0 select-none cursor-pointer"
          draggable={false}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            className="object-contain pointer-events-none transition-all duration-500 ease-out [filter:grayscale(100%)_brightness(0.38)_contrast(1.5)] group-hover:[filter:none] group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(201,169,110,0.45)]"
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}

export function TrustedBy() {
  const t = useTranslations("trustedBy")
  const isMobile = useIsMobile(1024)
  const scrollRef = useRef<HTMLDivElement>(null)
  const userInteractingRef = useRef(false)
  const resumeAtRef = useRef<number>(0)

  useEffect(() => {
    if (!isMobile) return
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrame: number
    const animate = () => {
      if (userInteractingRef.current) {
        animationFrame = requestAnimationFrame(animate)
        return
      }
      scrollContainer.scrollLeft += 0.5
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - scrollContainer.scrollWidth / 3
      }
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isMobile])

  const pauseAutoScroll = () => {
    userInteractingRef.current = true
    resumeAtRef.current = Date.now() + 150
  }

  const tryResumeAutoScroll = () => {
    const now = Date.now()
    if (now < resumeAtRef.current) {
      setTimeout(tryResumeAutoScroll, resumeAtRef.current - now)
      return
    }
    userInteractingRef.current = false
  }

  return (
    <div data-theme-color="trustedByBg" className="w-full max-w-full overflow-hidden flex flex-col items-center gap-6 md:gap-8 py-[40px] md:py-[64px] px-0" style={{ backgroundColor: "var(--theme-trusted-by-bg, #ffffff)" }}>
      <h2 data-theme-color="headingText" className="text-[28px] md:text-[36px] font-bold font-sans mb-8 md:mb-12 text-center px-4" style={{ color: "var(--theme-heading-text, #222222)" }}>
        {t("title")}
      </h2>

      <div className="relative w-full max-w-full overflow-hidden min-w-0">
        <div data-theme-color="trustedByBg" className="absolute left-0 top-0 bottom-0 w-[80px] md:w-[200px] z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--theme-trusted-by-bg, #ffffff), color-mix(in srgb, var(--theme-trusted-by-bg, #ffffff) 90%, transparent), transparent)" }} />
        <div data-theme-color="trustedByBg" className="absolute right-0 top-0 bottom-0 w-[80px] md:w-[200px] z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--theme-trusted-by-bg, #ffffff), color-mix(in srgb, var(--theme-trusted-by-bg, #ffffff) 90%, transparent), var(--theme-trusted-by-bg, #ffffff))" }} />

        {isMobile ? (
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory select-none touch-pan-x min-h-[90px] w-full"
            onTouchStart={pauseAutoScroll}
            onTouchEnd={tryResumeAutoScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex w-max min-w-full">
              <LogoStrip />
              <LogoStrip />
              <LogoStrip />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden select-none w-full">
            <div
              className="flex w-max will-change-transform"
              style={{
                animation: "trusted-by-marquee 45s linear infinite",
              }}
            >
              <LogoStrip />
              <LogoStrip />
              <LogoStrip />
            </div>
          </div>
        )}

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          @keyframes trusted-by-marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
        `}</style>
      </div>
    </div>
  )
}
