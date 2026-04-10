"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MediaBentoGrid } from "@/components/shared/media-bento-grid"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"
import type { MediaItem } from "@/components/shared/media-bento-grid"

const CAROUSEL_IMAGES = [
  "/mercedes frota/C.png",
  "/mercedes frota/Maybach.png",
  "/mercedes frota/Van.png",
  "/mercedes frota/c class.png",
  "/mercedes frota/class E.png",
  "/mercedes frota/eqe.png",
  "/mercedes frota/eqs.png",
  "/mercedes frota/minbus.png",
  "/mercedes frota/mini bus 8.png",
  "/mercedes frota/s class.png",
  "/mercedes frota/van executiva.png",
  "/resto fotos frota/13.png",
  "/resto fotos frota/14.png",
  "/resto fotos frota/15.png",
  "/resto fotos frota/16.png",
  "/resto fotos frota/17.png",
  "/resto fotos frota/18.png",
  "/resto fotos frota/19.png",
  "/resto fotos frota/porsche-panamera-2 (1).png",
]

export function FleetCarousel() {
  const t = useTranslations("fleet")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const media: MediaItem[] = CAROUSEL_IMAGES.map((url) => ({ url, type: "image" }))

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleShowAll = () => {
    setLightboxIndex(0)
    setLightboxOpen(true)
  }

  return (
    <div className="relative w-full max-w-[1168px] mx-auto mt-20 md:mt-24 px-4">
      <div className="relative w-full rounded-xl overflow-hidden border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <MediaBentoGrid
          media={media}
          alt={t("title")}
          onMediaClick={handleMediaClick}
          onShowAll={handleShowAll}
          mobileUntil="lg"
        />
        <MediaGalleryModal
          media={media}
          alt={t("title")}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          currentIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />
      </div>
    </div>
  )
}
