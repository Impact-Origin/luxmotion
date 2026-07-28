"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react"
import { MediaGalleryModal } from "@/components/shared/media-gallery-modal"
import type { MediaItem } from "@/components/shared/media-bento-grid"

// Todas as fotos da frota. Exteriores primeiro, interiores no fim.
const HERO_IMAGES = [
  // As duas fotos de conjunto abrem a galeria.
  "/fleet/v/geral-frota-belem.webp",
  "/fleet/v/geral-airport-cascais.webp",
  "/fleet/v/bentley-1.webp",
  "/fleet/v/bentley-2.webp",
  "/fleet/v/bentley-3.webp",
  "/fleet/v/bentley-flying-spur-front-partner.webp",
  "/fleet/v/byd-atto-3-back.webp",
  "/fleet/v/byd-atto-3-front.webp",
  "/fleet/v/carocha-branco-1.webp",
  "/fleet/v/carocha-branco-2.webp",
  "/fleet/v/carocha-branco-3.webp",
  "/fleet/v/carocha-preto-1.webp",
  "/fleet/v/carocha-preto-2.webp",
  "/fleet/v/carocha-preto-3.webp",
  "/fleet/v/class-e-back.webp",
  "/fleet/v/class-e-front.webp",
  "/fleet/v/coach-1.webp",
  "/fleet/v/coach-2.webp",
  "/fleet/v/dacia-jogger-1.webp",
  "/fleet/v/dacia-jogger-2.webp",
  "/fleet/v/dacia-sandero-1.webp",
  "/fleet/v/dacia-sandero-2.webp",
  "/fleet/v/e-station-1.webp",
  "/fleet/v/e-station-2.webp",
  "/fleet/v/eqe-1.webp",
  "/fleet/v/eqe-2.webp",
  "/fleet/v/eqs-1.webp",
  "/fleet/v/eqs-2.webp",
  "/fleet/v/eqv-1.webp",
  "/fleet/v/eqv-2.webp",
  "/fleet/v/ferrari-f8-spider-front.webp",
  "/fleet/v/fiat-tipo-1.webp",
  "/fleet/v/fiat-tipo-2.webp",
  "/fleet/v/grand-scenic-1.webp",
  "/fleet/v/grand-scenic-2.webp",
  "/fleet/v/harley-davidson-motorbke-front.webp",
  "/fleet/v/jaguar-etype-1.webp",
  "/fleet/v/jaguar-etype-2.webp",
  "/fleet/v/jaguar-etype-3.webp",
  "/fleet/v/jaguar-stype-1.webp",
  "/fleet/v/jaguar-stype-2.webp",
  "/fleet/v/kombi-1.webp",
  "/fleet/v/lamborghini-huracan-spider-front.webp",
  "/fleet/v/maybach-van-1.webp",
  "/fleet/v/maybach-van-2.webp",
  "/fleet/v/maybach-van-3.webp",
  "/fleet/v/mg-branco-1.webp",
  "/fleet/v/mg-branco-2.webp",
  "/fleet/v/mg-branco-3.webp",
  "/fleet/v/mg-preto-1.webp",
  // Novas fotos de frota, a meio da lista.
  "/fleet/v/frota-ponte.webp",
  "/fleet/v/frota-belem.webp",
  "/fleet/v/vw-t2-mafra.webp",
  "/fleet/v/mg-preto-2.webp",
  "/fleet/v/mg-preto-3.webp",
  "/fleet/v/mini-branco-1.webp",
  "/fleet/v/mini-branco-2.webp",
  "/fleet/v/mini-branco-3.webp",
  "/fleet/v/mini-preto-1.webp",
  "/fleet/v/mini-preto-2.webp",
  "/fleet/v/mini-preto-3.webp",
  "/fleet/v/panamera-1.webp",
  "/fleet/v/panamera-2.webp",
  "/fleet/v/peugeot-e208-1.webp",
  "/fleet/v/peugeot-e208-2.webp",
  "/fleet/v/porsche-911-front.webp",
  "/fleet/v/renault-clio-1.webp",
  "/fleet/v/renault-clio-2.webp",
  "/fleet/v/rolls-royce-ghost-front-partner.webp",
  "/fleet/v/rolls-royce-phantom-back.webp",
  "/fleet/v/rolls-royce-phantom-front.webp",
  "/fleet/v/s-class-1.webp",
  "/fleet/v/s-class-2.webp",
  "/fleet/v/silver-cloud-1.webp",
  "/fleet/v/silver-cloud-2.webp",
  "/fleet/v/silver-cloud-3.webp",
  "/fleet/v/silver-shadow-1.webp",
  "/fleet/v/silver-shadow-2.webp",
  "/fleet/v/silver-shadow-3.webp",
  "/fleet/v/sprinter-1.webp",
  "/fleet/v/sprinter-2.webp",
  "/fleet/v/sprinter-back.webp",
  "/fleet/v/tesla-model-3-back.webp",
  "/fleet/v/tesla-model-3-front.webp",
  "/fleet/v/toyota-corolla-e20-front.webp",
  "/fleet/v/traveller-1.webp",
  "/fleet/v/traveller-2.webp",
  "/fleet/v/v-class-1.webp",
  "/fleet/v/v-class-2.webp",
  "/fleet/v/van-maybach-front-open-seats.webp",
  "/fleet/v/vespa-1.webp",
  "/fleet/v/vespa-2.webp",
  "/fleet/v/mini-classico-branco-interior-back.webp",
  "/fleet/v/mini-classico-preto-interior-back.webp",
  "/fleet/v/rolls-royce-ghost-interior.webp",
  "/fleet/v/silver-cloud-interior-back.webp",
  "/fleet/v/silver-shadow-interior-back.webp",
  "/fleet/v/van-maybach-interior-2.webp",
  "/fleet/v/van-maybach-interior-blue.webp",
  "/fleet/v/vw-carocha-branco-back-interior.webp",
  "/fleet/v/vw-carocha-preto-interior-back.webp",
]

const MOBILE_HERO = "/fleet/hero/main-mobile.webp"

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
      <div className="hidden md:flex w-full h-[420px] lg:h-[460px] gap-[2px] relative">
        <Tile offset={0} className="basis-0 grow-[959] shrink min-w-0" />
        <div className="flex flex-col gap-[2px] basis-0 grow-[479] shrink min-w-0">
          <Tile offset={1} className="flex-1 min-h-0" />
          <Tile offset={2} className="flex-1 min-h-0" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
        <Controls />
      </div>

      <div className="md:hidden relative w-full h-[280px]">
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
