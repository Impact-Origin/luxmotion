"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"

const FALLBACK_ASPECT = 4 / 3

interface FleetMobileCarouselProps {
  images: string[]
}

export function FleetMobileCarousel({ images }: FleetMobileCarouselProps) {
  const t = useTranslations("fleet")
  const [current, setCurrent] = useState(0)
  /** Aspect ratio do viewport = da primeira imagem, para todos os slides terem as mesmas dimensões */
  const [aspectRatio, setAspectRatio] = useState<number>(FALLBACK_ASPECT)
  const scrollRef = useRef<HTMLDivElement>(null)
  const skipScrollSync = useRef(false)
  const n = images.length

  const onFirstImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight)
    }
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el || n === 0) return
    const i = Math.max(0, Math.min(index, n - 1))
    skipScrollSync.current = true
    const slidePct = 100 / n
    const scrollLeft = (el.scrollWidth * (i * slidePct)) / 100
    el.scrollTo({ left: scrollLeft, behavior: "smooth" })
    setCurrent(i)
    setTimeout(() => {
      skipScrollSync.current = false
    }, 350)
  }, [n])

  const onScroll = useCallback(() => {
    if (skipScrollSync.current) return
    const el = scrollRef.current
    if (!el || n === 0) return
    const slidePct = 100 / n
    const progress = (el.scrollLeft / el.scrollWidth) * 100
    const index = Math.round(progress / slidePct)
    const clamped = Math.max(0, Math.min(index, n - 1))
    setCurrent(clamped)
  }, [n])

  const goPrev = useCallback(() => {
    scrollToIndex(current - 1)
  }, [current, scrollToIndex])

  const goNext = useCallback(() => {
    scrollToIndex(current + 1)
  }, [current, scrollToIndex])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [onScroll])

  if (n === 0) return null

  return (
    <div className="w-full">
      {/* Viewport: uma imagem por vez, swipe = scroll nativo */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth touch-pan-x select-none"
        style={{
          aspectRatio,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .fleet-mobile-carousel-track::-webkit-scrollbar { display: none; }
        `}</style>
        <div
          className="fleet-mobile-carousel-track flex h-full"
          style={{ width: `${n * 100}%` }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="h-full flex-shrink-0 snap-start snap-always relative"
              style={{ width: `${100 / n}%` }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                draggable={false}
                priority={i === 0}
                onLoad={i === 0 ? onFirstImageLoad : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controles: setas + dots */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label={t("previousImage")}
          data-theme-color="buttonBg"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "color-mix(in srgb, var(--theme-button-bg, #27c7ff) 35%, white)" }}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
        </button>

        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Slide ${i + 1}`}
              data-theme-color="buttonBg"
              className={`h-2 rounded-full transition-all duration-200 ${i === current ? "w-6" : "w-2"}`}
              style={{
                backgroundColor:
                  i === current
                    ? "var(--theme-button-bg, #27c7ff)"
                    : "color-mix(in srgb, var(--theme-button-bg, #27c7ff) 45%, white)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label={t("nextImage")}
          data-theme-color="buttonBg"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "color-mix(in srgb, var(--theme-button-bg, #27c7ff) 35%, white)" }}
        >
          <ChevronRight className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
        </button>
      </div>
    </div>
  )
}
