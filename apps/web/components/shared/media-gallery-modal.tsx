"use client"

import { useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@workspace/ui/components/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export type MediaItem = { url: string; type: "image" | "video" }

interface MediaGalleryModalProps {
  media: MediaItem[]
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentIndex: number
  onIndexChange: (index: number) => void
  light?: boolean
}

export function MediaGalleryModal({
  media,
  alt,
  open,
  onOpenChange,
  currentIndex,
  onIndexChange,
  light = false,
}: MediaGalleryModalProps) {
  const ui = light
    ? {
        content: "bg-[#f7f4ef]",
        topText: "text-[#1c1b18]",
        close: "text-[#696969] hover:text-[#1c1b18]",
        nav: "bg-[rgba(28,27,24,0.06)] hover:bg-[rgba(28,27,24,0.12)]",
        navIcon: "text-[#a08248]",
        thumbActive: "ring-2 ring-[#a08248] opacity-100",
      }
    : {
        content: "bg-black/95",
        topText: "text-white/80",
        close: "text-white/70 hover:text-white",
        nav: "bg-white/10 hover:bg-white/20",
        navIcon: "text-white",
        thumbActive: "ring-2 ring-white opacity-100",
      }
  const goToPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + media.length) % media.length)
  }, [currentIndex, media.length, onIndexChange])

  const goToNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % media.length)
  }, [currentIndex, media.length, onIndexChange])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, goToPrev, goToNext])

  const stripRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ down: false, moved: false, startX: 0, startScroll: 0 })

  useEffect(() => {
    if (!open) return
    const strip = stripRef.current
    if (!strip) return
    const active = strip.querySelector<HTMLElement>(`[data-thumb-index="${currentIndex}"]`)
    if (active) {
      const stripRect = strip.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const offset = activeRect.left - stripRect.left - stripRect.width / 2 + activeRect.width / 2
      strip.scrollBy({ left: offset, behavior: "smooth" })
    }
  }, [currentIndex, open])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const strip = stripRef.current
    if (!strip) return
    dragState.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: strip.scrollLeft,
    }
    strip.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const strip = stripRef.current
    const state = dragState.current
    if (!strip || !state.down) return
    const dx = e.clientX - state.startX
    if (Math.abs(dx) > 4) state.moved = true
    strip.scrollLeft = state.startScroll - dx
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const strip = stripRef.current
    if (strip && strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId)
    setTimeout(() => (dragState.current.down = false), 0)
  }

  if (media.length === 0) return null

  const current = media[currentIndex]!

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none flex flex-col [&>button]:hidden", ui.content)}>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <span className={cn("text-sm font-medium", ui.topText)}>
            {currentIndex + 1} / {media.length}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className={cn("transition-colors p-1", ui.close)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-0 px-14">
          <div className="relative w-full h-full">
            {current.type === "video" ? (
              <video
                src={current.url}
                controls
                autoPlay
                muted={false}
                playsInline
                className="w-full h-full max-h-[70vh] object-contain"
              >
                <source src={current.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={current.url}
                alt={currentIndex === 0 ? alt : `${alt} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          {media.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className={cn("absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors", ui.nav)}
              >
                <ChevronLeft className={cn("h-6 w-6", ui.navIcon)} />
              </button>
              <button
                onClick={goToNext}
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors", ui.nav)}
              >
                <ChevronRight className={cn("h-6 w-6", ui.navIcon)} />
              </button>
            </>
          )}
        </div>

        {media.length > 1 && (
          <div
            ref={stripRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="shrink-0 px-4 py-3 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none scrollbar-hide touch-pan-x"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-2 w-max mx-auto">
              {media.map((item, index) => (
                <button
                  key={index}
                  data-thumb-index={index}
                  onClick={(e) => {
                    if (dragState.current.moved) {
                      e.preventDefault()
                      e.stopPropagation()
                      return
                    }
                    onIndexChange(index)
                  }}
                  draggable={false}
                  className={cn(
                    "relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-200",
                    index === currentIndex ? ui.thumbActive : "opacity-50 hover:opacity-75"
                  )}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
