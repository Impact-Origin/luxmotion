"use client"

import { useState } from "react"
import { MediaBentoGrid } from "@/components/shared/media-bento-grid"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"

export type MediaItem = { url: string; type: "image" | "video" }

interface TourDetailsHeroProps {
  /** Banner principal - sempre imagem */
  image: string
  /** Extras - podem ser imagens ou vídeos */
  additionalBanners?: MediaItem[]
  alt?: string
}

export function TourDetailsHero({
  image,
  additionalBanners = [],
  alt = "Tour banner",
}: TourDetailsHeroProps) {
  const media: MediaItem[] = [
    { url: image, type: "image" },
    ...additionalBanners.map((b): MediaItem => ({
      url: b.url,
      type: b.type === "video" ? "video" : "image",
    })),
  ].filter((m): m is MediaItem => Boolean(m.url))
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
      <MediaBentoGrid
        media={media}
        alt={alt}
        onMediaClick={handleMediaClick}
        onShowAll={handleShowAll}
      />
      <MediaGalleryModal
        media={media}
        alt={alt}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
