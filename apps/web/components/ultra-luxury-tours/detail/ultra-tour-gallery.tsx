"use client"

import { useState } from "react"
import { MediaBentoGrid } from "@/components/shared/media-bento-grid"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"

type MediaItem = { url: string; type: "image" | "video" }

interface UltraTourGalleryProps {
  image: string
  additionalBanners?: { url: string; type: "image" | "video" }[]
  alt?: string
}

export function UltraTourGallery({ image, additionalBanners = [], alt = "Tour" }: UltraTourGalleryProps) {
  const media: MediaItem[] = [
    { url: image, type: "image" as const },
    ...additionalBanners.map((b): MediaItem => ({ url: b.url, type: b.type === "video" ? "video" : "image" })),
  ].filter((m) => Boolean(m.url))

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleShowAll = () => {
    setLightboxIndex(0)
    setLightboxOpen(true)
  }

  return (
    <>
      <MediaBentoGrid media={media} alt={alt} onMediaClick={handleMediaClick} onShowAll={handleShowAll} light mobileUntil="lg" />
      <MediaGalleryModal
        media={media}
        alt={alt}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        light
      />
    </>
  )
}
