"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"
import type { MediaItem } from "@/components/shared/media-bento-grid"

const HERO_IMAGES = [
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

const MOBILE_HERO = "/fleet/hero/main-mobile.png"

const CONTROL_BTN =
  "size-[48px] flex items-center justify-center bg-[#0d0d0d] border-[1.714px] border-[rgba(154,117,53,0.22)] hover:border-[rgba(201,169,110,0.5)] hover:bg-[rgba(201,169,110,0.08)] transition-colors"

export function FleetCarousel() {
  const t = useTranslations("fleet")
  const tPage = useTranslations("fleetPage")
  const [startIdx, setStartIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const len = HERO_IMAGES.length
  const at = (offset: number) => HERO_IMAGES[(startIdx + offset + len) % len] as string
  const indexAt = (offset: number) => (startIdx + offset + len) % len

  const media: MediaItem[] = HERO_IMAGES.map((url) => ({ url, type: "image" }))

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  const handlePrev = () => setStartIdx((i) => (i - 1 + len) % len)
  const handleNext = () => setStartIdx((i) => (i + 1) % len)

  const Controls = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`absolute z-10 flex gap-[8px] items-center ${
        mobile ? "bottom-[16px] right-[16px]" : "bottom-[24px] right-[24px]"
      }`}
    >
      <button type="button" onClick={handlePrev} aria-label={t("previousImage")} className={CONTROL_BTN}>
        <ArrowLeft className="size-[24px] text-[#c9a96e]" strokeWidth={1.5} />
      </button>
      <button type="button" onClick={handleNext} aria-label={t("nextImage")} className={CONTROL_BTN}>
        <ArrowRight className="size-[24px] text-[#c9a96e]" strokeWidth={1.5} />
      </button>
      {mobile ? (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          aria-label={tPage("gallery")}
          className={CONTROL_BTN}
        >
          <ImageIcon className="size-[24px] text-[#c9a96e]" strokeWidth={1.5} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className={`${CONTROL_BTN} w-[110px]`}
        >
          <span
            className="text-[14px] font-medium tracking-[1.1px] uppercase text-[#c9a96e]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {tPage("gallery")}
          </span>
        </button>
      )}
    </div>
  )

  const Tile = ({ offset, className }: { offset: number; className: string }) => (
    <button
      type="button"
      onClick={() => openLightbox(indexAt(offset))}
      className={`relative overflow-hidden bg-[#1a1a1a] group ${className}`}
    >
      <Image
        src={at(offset)}
        alt={t("title")}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={offset === 0}
      />
    </button>
  )

  return (
    <section className="relative w-full bg-[#0d0d0d]">
      <div className="hidden md:flex w-full h-[497px] gap-[2px] relative">
        <Tile offset={0} className="basis-0 grow-[959] shrink min-w-0" />
        <div className="flex flex-col gap-[2px] basis-0 grow-[479] shrink min-w-0">
          <Tile offset={1} className="flex-1 min-h-0" />
          <Tile offset={2} className="flex-1 min-h-0" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
        <Controls />
      </div>

      <div className="md:hidden relative w-full h-[340px]">
        <button
          type="button"
          onClick={() => openLightbox(startIdx)}
          className="relative block w-full h-full overflow-hidden bg-[#1a1a1a]"
        >
          <Image
            src={MOBILE_HERO}
            alt={t("title")}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </button>
        <Controls mobile />
      </div>

      <MediaGalleryModal
        media={media}
        alt={t("title")}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </section>
  )
}
