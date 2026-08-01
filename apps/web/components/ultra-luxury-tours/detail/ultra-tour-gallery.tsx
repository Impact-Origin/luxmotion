"use client"

import { useState } from "react"
import { MediaBentoGrid } from "@/components/shared/media-bento-grid"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"

type MediaItem = { url: string; type: "image" | "video" }
type MediaInput = MediaItem | string | null | undefined

interface UltraTourGalleryProps {
  image: string
  additionalBanners?: MediaInput[]
  alt?: string
}

function normalizeMediaItem(item: MediaInput): MediaItem | null {
  if (typeof item === "string") {
    return item ? { url: item, type: "image" } : null
  }

  if (!item?.url) return null

  return {
    url: item.url,
    type: item.type === "video" ? "video" : "image",
  }
}

export function UltraTourGallery({ image, additionalBanners = [], alt = "Tour" }: UltraTourGalleryProps) {
  const media: MediaItem[] = [
    { url: image, type: "image" as const },
    ...additionalBanners.map(normalizeMediaItem),
  ].filter((m): m is MediaItem => Boolean(m?.url))

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleMediaClick = (index: number) => {
    if (!media[index]) return
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
