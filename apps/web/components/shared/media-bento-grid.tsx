"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export type MediaItem = { url: string; type: "image" | "video" }

interface MediaBentoGridProps {
  media: MediaItem[]
  alt: string
  onMediaClick: (index: number) => void
  onShowAll: () => void
  /** Breakpoint até ao qual se usa o carrossel mobile (uma imagem, dots). "md" = <768px, "lg" = <1024px. Default "md". */
  mobileUntil?: "md" | "lg"
}

export function MediaBentoGrid({ media, alt, onMediaClick, onShowAll, mobileUntil = "md" }: MediaBentoGridProps) {
  const count = media.length

  if (count === 0) return null

  const first = media[0]!

  const mobileHidden = mobileUntil === "lg" ? "lg:hidden" : "md:hidden"
  const desktopHidden = mobileUntil === "lg" ? "hidden lg:block" : "hidden md:block"

  if (count === 1) {
    return (
      <div className="relative w-full h-[250px] md:h-[320px] lg:h-[380px] overflow-hidden bg-slate-900">
        {first.type === "video" ? (
          <video
            src={first.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={() => onMediaClick(0)}
          >
            <source src={first.url} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={first.url}
            alt={alt}
            fill
            className="object-cover cursor-pointer"
            priority
            onClick={() => onMediaClick(0)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-[250px] md:h-[320px] lg:h-[380px] overflow-hidden">
      <div className={`${mobileHidden} h-full`}>
        <MobileMediaCarousel
          media={media}
          alt={alt}
          onMediaClick={onMediaClick}
        />
      </div>

      <div className={`${desktopHidden} w-full h-full`}>
        {count === 2 && <TwoMediaLayout media={media} alt={alt} onMediaClick={onMediaClick} />}
        {count === 3 && <ThreeMediaLayout media={media} alt={alt} onMediaClick={onMediaClick} />}
        {count === 4 && <FourMediaLayout media={media} alt={alt} onMediaClick={onMediaClick} />}
        {count >= 5 && (
          <ScrollableMediaLayout
            media={media}
            alt={alt}
            onMediaClick={onMediaClick}
            onShowAll={onShowAll}
            totalCount={count}
          />
        )}
      </div>
    </div>
  )
}

function MobileMediaCarousel({
  media,
  alt,
  onMediaClick,
}: {
  media: MediaItem[]
  alt: string
  onMediaClick: (index: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el || media.length === 0) return
    const { scrollLeft, offsetWidth } = el
    if (offsetWidth <= 0) return
    const index = Math.round(scrollLeft / offsetWidth)
    setActiveIndex(Math.min(Math.max(0, index), media.length - 1))
  }, [media.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateActiveIndex()
    const observer = new ResizeObserver(updateActiveIndex)
    observer.observe(el)
    el.addEventListener("scroll", updateActiveIndex)
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", updateActiveIndex)
    }
  }, [updateActiveIndex])

  const goToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const slideWidth = el.offsetWidth
    el.scrollTo({ left: index * slideWidth, behavior: "smooth" })
  }

  return (
    <div className="relative h-full min-h-0">
      <div
        ref={scrollRef}
        className="h-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:hidden select-none"
        style={{ scrollbarWidth: "none", cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        {media.map((item, index) => (
          <div
            key={index}
            className="relative shrink-0 w-full h-full cursor-pointer snap-start flex-[0_0_100%]"
            style={{ scrollSnapStop: "always" }}
            onClick={() => onMediaClick(index)}
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                autoPlay={index === 0}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={item.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={item.url}
                alt={index === 0 ? alt : `${alt} - ${index + 1}`}
                fill
                className="object-cover"
                priority={index < 3}
                sizes="100vw"
              />
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        {media.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === activeIndex ? "bg-white/95 scale-125" : "bg-white/50"
            )}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function GridMedia({
  item,
  alt,
  onClick,
  className,
  priority = false,
}: {
  item: MediaItem
  alt: string
  onClick: () => void
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden cursor-pointer group", className)} onClick={onClick}>
      {item.type === "video" ? (
        <video
          src={item.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        >
          <source src={item.url} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={item.url}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  )
}

function TwoMediaLayout({
  media,
  alt,
  onMediaClick,
}: {
  media: MediaItem[]
  alt: string
  onMediaClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[3fr_2fr] gap-1.5 h-full">
      <GridMedia item={media[0]!} alt={alt} onClick={() => onMediaClick(0)} className="rounded-xl" priority />
      <GridMedia item={media[1]!} alt={`${alt} - 2`} onClick={() => onMediaClick(1)} className="rounded-xl" />
    </div>
  )
}

function ThreeMediaLayout({
  media,
  alt,
  onMediaClick,
}: {
  media: MediaItem[]
  alt: string
  onMediaClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-1.5 h-full">
      <GridMedia item={media[0]!} alt={alt} onClick={() => onMediaClick(0)} className="rounded-xl" priority />
      <div className="flex flex-col gap-1.5 h-full">
        <GridMedia item={media[1]!} alt={`${alt} - 2`} onClick={() => onMediaClick(1)} className="flex-1 min-h-0 rounded-xl" />
        <GridMedia item={media[2]!} alt={`${alt} - 3`} onClick={() => onMediaClick(2)} className="flex-1 min-h-0 rounded-xl" />
      </div>
    </div>
  )
}

function FourMediaLayout({
  media,
  alt,
  onMediaClick,
}: {
  media: MediaItem[]
  alt: string
  onMediaClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-1.5 h-full">
      <GridMedia item={media[0]!} alt={alt} onClick={() => onMediaClick(0)} className="rounded-xl" priority />
      <GridMedia item={media[1]!} alt={`${alt} - 2`} onClick={() => onMediaClick(1)} className="rounded-xl" />
      <div className="flex flex-col gap-1.5 h-full">
        <GridMedia item={media[2]!} alt={`${alt} - 3`} onClick={() => onMediaClick(2)} className="flex-1 min-h-0 rounded-xl" />
        <GridMedia item={media[3]!} alt={`${alt} - 4`} onClick={() => onMediaClick(3)} className="flex-1 min-h-0 rounded-xl" />
      </div>
    </div>
  )
}

function useDragScroll(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const hasDragged = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.clientX
    scrollStart.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
    el.style.cursor = "grabbing"
  }, [scrollRef])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 5) hasDragged.current = true
    const el = scrollRef.current
    if (el) el.scrollLeft = scrollStart.current - dx
  }, [scrollRef])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false
    const el = scrollRef.current
    if (el) {
      el.releasePointerCapture(e.pointerId)
      el.style.cursor = "grab"
    }
  }, [scrollRef])

  const shouldPreventClick = useCallback(() => hasDragged.current, [])

  return { onPointerDown, onPointerMove, onPointerUp, shouldPreventClick }
}

function buildColumns(
  media: MediaItem[],
  alt: string,
  onMediaClick: (i: number) => void,
  keyPrefix = ""
): React.ReactNode[] {
  const cols: React.ReactNode[] = []
  let i = 0
  let colIdx = 0
  while (i < media.length) {
    const pattern = colIdx % 3
    const item = media[i]!
    if (pattern === 0) {
      cols.push(
        <div key={`${keyPrefix}col-${colIdx}`} className="shrink-0 w-[28%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
          <GridMedia
            item={item}
            alt={i === 0 ? alt : `${alt} - ${i + 1}`}
            onClick={() => onMediaClick(i)}
            className="h-full rounded-xl"
            priority={i === 0}
          />
        </div>
      )
      i++
    } else if (pattern === 1) {
      cols.push(
        <div key={`${keyPrefix}col-${colIdx}`} className="shrink-0 w-[50%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
          <GridMedia
            item={item}
            alt={`${alt} - ${i + 1}`}
            onClick={() => onMediaClick(i)}
            className="h-full rounded-xl"
          />
        </div>
      )
      i++
    } else {
      if (i + 1 < media.length) {
        const topItem = media[i]!
        const bottomItem = media[i + 1]!
        cols.push(
          <div key={`${keyPrefix}col-${colIdx}`} className="shrink-0 w-[28%] h-full flex flex-col gap-1.5 snap-start" style={{ scrollSnapStop: "always" }}>
            <GridMedia
              item={topItem}
              alt={`${alt} - ${i + 1}`}
              onClick={() => onMediaClick(i)}
              className="flex-1 min-h-0 rounded-xl"
            />
            <GridMedia
              item={bottomItem}
              alt={`${alt} - ${i + 2}`}
              onClick={() => onMediaClick(i + 1)}
              className="flex-1 min-h-0 rounded-xl"
            />
          </div>
        )
        i += 2
      } else {
        cols.push(
          <div key={`${keyPrefix}col-${colIdx}`} className="shrink-0 w-[28%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
            <GridMedia
              item={item}
              alt={`${alt} - ${i + 1}`}
              onClick={() => onMediaClick(i)}
              className="h-full rounded-xl"
            />
          </div>
        )
        i++
      }
    }
    colIdx++
  }
  return cols
}

function ScrollableMediaLayout({
  media,
  alt,
  onMediaClick,
  onShowAll,
  totalCount,
}: {
  media: MediaItem[]
  alt: string
  onMediaClick: (i: number) => void
  onShowAll: () => void
  totalCount: number
}) {
  const t = useTranslations("tourDetails")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(true)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const copyWidth = el.scrollWidth / 2
    if (copyWidth <= 0) return
    // Ao chegar ao fim direito: salta para a primeira cópia (scroll infinito)
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
      el.scrollLeft -= copyWidth
      return
    }
    // Não saltar quando em 0 — assim a seta direita funciona ao início
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    requestAnimationFrame(handleScroll)
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(handleScroll)
    observer.observe(el)
    const t = setTimeout(handleScroll, 150)
    return () => {
      observer.disconnect()
      clearTimeout(t)
    }
  }, [handleScroll])

  const scrollToNext = () => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" })
  }

  const scrollToPrev = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollLeft <= 0) {
      el.scrollLeft = el.scrollWidth / 2 - el.clientWidth
      return
    }
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" })
  }

  const { onPointerDown, onPointerMove, onPointerUp, shouldPreventClick } = useDragScroll(scrollRef)

  const handleMediaClick = (index: number) => {
    if (shouldPreventClick()) return
    onMediaClick(index)
  }

  const columns1 = buildColumns(media, alt, handleMediaClick, "a-")
  const columns2 = buildColumns(media, alt, handleMediaClick, "b-")
  const duplicatedColumns = [...columns1, ...columns2]

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="flex gap-1.5 h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden select-none"
        style={{ scrollbarWidth: "none", cursor: "grab", WebkitOverflowScrolling: "touch" }}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {duplicatedColumns}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={scrollToPrev}
          className={cn(
            "w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
            canScrollLeft ? "bg-white/90 hover:bg-white" : "bg-white/40"
          )}
          aria-label="Anterior"
        >
          <ChevronLeft className={cn("h-4 w-4", canScrollLeft ? "text-zinc-700" : "text-zinc-400")} />
        </button>
        <button
          type="button"
          onClick={scrollToNext}
          className={cn(
            "w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
            canScrollRight ? "bg-white/90 hover:bg-white" : "bg-white/40"
          )}
          aria-label="Seguinte"
        >
          <ChevronRight className={cn("h-4 w-4", canScrollRight ? "text-zinc-700" : "text-zinc-400")} />
        </button>
        <button
          onClick={onShowAll}
          className="bg-white/90 hover:bg-white text-zinc-800 text-xs font-semibold px-3 py-2 rounded-full shadow-lg transition-colors"
        >
          {t("showAllPhotos", { count: totalCount })}
        </button>
      </div>
    </div>
  )
}
