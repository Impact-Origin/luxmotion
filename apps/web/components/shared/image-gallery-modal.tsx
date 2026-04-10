"use client"

import { useCallback, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@workspace/ui/components/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ImageGalleryModalProps {
  images: string[]
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function ImageGalleryModal({
  images,
  alt,
  open,
  onOpenChange,
  currentIndex,
  onIndexChange,
}: ImageGalleryModalProps) {
  const goToPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onIndexChange])

  const goToNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onIndexChange])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, goToPrev, goToNext])

  if (images.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none flex flex-col [&>button]:hidden">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-0 px-14">
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]!}
              alt={currentIndex === 0 ? alt : `${alt} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="shrink-0 px-4 py-3 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={cn(
                    "relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-200",
                    index === currentIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-75"
                  )}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
