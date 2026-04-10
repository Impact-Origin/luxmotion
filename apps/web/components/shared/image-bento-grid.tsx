"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ImageBentoGridProps {
  images: string[]
  alt: string
  onImageClick: (index: number) => void
  onShowAll: () => void
}

export function ImageBentoGrid({ images, alt, onImageClick, onShowAll }: ImageBentoGridProps) {
  const t = useTranslations("tourDetails")
  const count = images.length

  if (count === 0) return null

  if (count === 1) {
    return (
      <div className="relative w-full h-[250px] md:h-[320px] lg:h-[380px] overflow-hidden">
        <Image
          src={images[0]!}
          alt={alt}
          fill
          className="object-cover cursor-pointer"
          priority
          onClick={() => onImageClick(0)}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-[250px] md:h-[320px] lg:h-[380px] overflow-hidden">
      <div className="md:hidden relative w-full h-full">
        <Image
          src={images[0]!}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        <button
          onClick={onShowAll}
          className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-zinc-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          {t("showAllPhotos", { count })}
        </button>
      </div>

      <div className="hidden md:block w-full h-full">
        {count === 2 && <TwoImageLayout images={images} alt={alt} onImageClick={onImageClick} />}
        {count === 3 && <ThreeImageLayout images={images} alt={alt} onImageClick={onImageClick} />}
        {count === 4 && <FourImageLayout images={images} alt={alt} onImageClick={onImageClick} />}
        {count >= 5 && (
          <ScrollableLayout
            images={images}
            alt={alt}
            onImageClick={onImageClick}
            onShowAll={onShowAll}
            totalCount={count}
          />
        )}
      </div>
    </div>
  )
}

function GridImage({
  src,
  alt,
  onClick,
  className,
  priority = false,
}: {
  src: string
  alt: string
  onClick: () => void
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden cursor-pointer group", className)} onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  )
}

function TwoImageLayout({
  images,
  alt,
  onImageClick,
}: {
  images: string[]
  alt: string
  onImageClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[3fr_2fr] gap-1.5 h-full">
      <GridImage src={images[0]!} alt={alt} onClick={() => onImageClick(0)} className="rounded-xl" priority />
      <GridImage src={images[1]!} alt={`${alt} - 2`} onClick={() => onImageClick(1)} className="rounded-xl" />
    </div>
  )
}

function ThreeImageLayout({
  images,
  alt,
  onImageClick,
}: {
  images: string[]
  alt: string
  onImageClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-1.5 h-full">
      <GridImage
        src={images[0]!}
        alt={alt}
        onClick={() => onImageClick(0)}
        className="rounded-xl"
        priority
      />
      <div className="flex flex-col gap-1.5 h-full">
        <GridImage src={images[1]!} alt={`${alt} - 2`} onClick={() => onImageClick(1)} className="flex-1 min-h-0 rounded-xl" />
        <GridImage src={images[2]!} alt={`${alt} - 3`} onClick={() => onImageClick(2)} className="flex-1 min-h-0 rounded-xl" />
      </div>
    </div>
  )
}

function FourImageLayout({
  images,
  alt,
  onImageClick,
}: {
  images: string[]
  alt: string
  onImageClick: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-1.5 h-full">
      <GridImage src={images[0]!} alt={alt} onClick={() => onImageClick(0)} className="rounded-xl" priority />
      <GridImage src={images[1]!} alt={`${alt} - 2`} onClick={() => onImageClick(1)} className="rounded-xl" />
      <div className="flex flex-col gap-1.5 h-full">
        <GridImage src={images[2]!} alt={`${alt} - 3`} onClick={() => onImageClick(2)} className="flex-1 min-h-0 rounded-xl" />
        <GridImage src={images[3]!} alt={`${alt} - 4`} onClick={() => onImageClick(3)} className="flex-1 min-h-0 rounded-xl" />
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

function ScrollableLayout({
  images,
  alt,
  onImageClick,
  onShowAll,
  totalCount,
}: {
  images: string[]
  alt: string
  onImageClick: (i: number) => void
  onShowAll: () => void
  totalCount: number
}) {
  const t = useTranslations("tourDetails")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }, [])

  useEffect(() => {
    requestAnimationFrame(checkScroll)
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)
    return () => observer.disconnect()
  }, [checkScroll])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  const { onPointerDown, onPointerMove, onPointerUp, shouldPreventClick } = useDragScroll(scrollRef)

  const handleImageClick = (index: number) => {
    if (shouldPreventClick()) return
    onImageClick(index)
  }

  const columns: React.ReactNode[] = []
  let i = 0
  let colIdx = 0

  while (i < images.length) {
    const pattern = colIdx % 3

    if (pattern === 0) {
      columns.push(
        <div key={`col-${colIdx}`} className="shrink-0 w-[28%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
          <GridImage
            src={images[i]!}
            alt={i === 0 ? alt : `${alt} - ${i + 1}`}
            onClick={() => handleImageClick(i)}
            className="h-full rounded-xl"
            priority={i === 0}
          />
        </div>
      )
      i++
    } else if (pattern === 1) {
      columns.push(
        <div key={`col-${colIdx}`} className="shrink-0 w-[50%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
          <GridImage
            src={images[i]!}
            alt={`${alt} - ${i + 1}`}
            onClick={() => handleImageClick(i)}
            className="h-full rounded-xl"
          />
        </div>
      )
      i++
    } else {
      if (i + 1 < images.length) {
        const topIdx = i
        const bottomIdx = i + 1
        columns.push(
          <div key={`col-${colIdx}`} className="shrink-0 w-[28%] h-full flex flex-col gap-1.5 snap-start" style={{ scrollSnapStop: "always" }}>
            <GridImage
              src={images[topIdx]!}
              alt={`${alt} - ${topIdx + 1}`}
              onClick={() => handleImageClick(topIdx)}
              className="flex-1 min-h-0 rounded-xl"
            />
            <GridImage
              src={images[bottomIdx]!}
              alt={`${alt} - ${bottomIdx + 1}`}
              onClick={() => handleImageClick(bottomIdx)}
              className="flex-1 min-h-0 rounded-xl"
            />
          </div>
        )
        i += 2
      } else {
        columns.push(
          <div key={`col-${colIdx}`} className="shrink-0 w-[28%] h-full snap-start" style={{ scrollSnapStop: "always" }}>
            <GridImage
              src={images[i]!}
              alt={`${alt} - ${i + 1}`}
              onClick={() => handleImageClick(i)}
              className="h-full rounded-xl"
            />
          </div>
        )
        i++
      }
    }
    colIdx++
  }

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="flex gap-1.5 h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden select-none"
        style={{ scrollbarWidth: "none", cursor: "grab", WebkitOverflowScrolling: "touch" }}
        onScroll={checkScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {columns}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() => scrollByAmount(-400)}
          disabled={!canScrollLeft}
          className={cn(
            "w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95",
            canScrollLeft ? "bg-white/90 hover:bg-white" : "bg-white/40 cursor-default"
          )}
        >
          <ChevronLeft className={cn("h-4 w-4", canScrollLeft ? "text-zinc-700" : "text-zinc-400")} />
        </button>
        <button
          onClick={() => scrollByAmount(400)}
          disabled={!canScrollRight}
          className={cn(
            "w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95",
            canScrollRight ? "bg-white/90 hover:bg-white" : "bg-white/40 cursor-default"
          )}
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
