"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useIsMobile } from "@/hooks/use-is-mobile"

const logos = [
  { name: "American Airlines", src: "/trustedby/american-airlines-easy-transfer.png" },
  { name: "Bentley", src: "/trustedby/bentley-logo-easy-transfer.png" },
  { name: "BMW", src: "/trustedby/BMW-logo-easy-transfer.png" },
  { name: "Emirates", src: "/trustedby/Emirates-Logo-easy-transfer.png" },
  { name: "Four Seasons", src: "/trustedby/Four-Seasons-Logo-easy-transfer.png" },
  { name: "Hilton", src: "/trustedby/Hilton-Logo-easy-transfer.png" },
  { name: "Mercedes-Benz", src: "/trustedby/mercedes-benz-logo-easy-transfer.png" },
  { name: "NetJets", src: "/trustedby/NetJets-logo-easy-transfer.png" },
  { name: "Pestana", src: "/trustedby/pestana-logo-easy-transfer.png" },
  { name: "TAP", src: "/trustedby/tap-logo-easy-transfer.png" },
  { name: "Vila Galé", src: "/trustedby/vila-gale-easy-transfer.png" },
]

const logoStyle = {
  filter: "grayscale(100%) brightness(0.38) contrast(1.5)",
}

function LogoStrip() {
  return (
    <div className="flex gap-[24px] md:gap-[48px] px-4 py-2 shrink-0">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="relative w-[140px] md:w-[160px] lg:w-[180px] h-[70px] md:h-[80px] lg:h-[90px] shrink-0 select-none"
          draggable={false}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            className="object-contain pointer-events-none"
            draggable={false}
            style={logoStyle}
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
    <div className="w-full max-w-full overflow-hidden flex flex-col items-center gap-6 md:gap-8 py-[40px] md:py-[64px] px-0">
      <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] font-sans mb-8 md:mb-12 text-center px-4">
        {t("title")}
      </h2>

      <div className="relative w-full max-w-full overflow-hidden min-w-0">
        <div className="absolute left-0 top-0 bottom-0 w-[80px] md:w-[200px] bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[80px] md:w-[200px] bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

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
