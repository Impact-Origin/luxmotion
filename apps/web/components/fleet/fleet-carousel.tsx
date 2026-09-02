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
  "/fleet/gallery/geral-frota-belem.webp",
  "/fleet/gallery/geral-airport-cascais.webp",
  "/fleet/gallery/bentley-1.webp",
  "/fleet/gallery/bentley-2.webp",
  "/fleet/gallery/bentley-3.webp",
  "/fleet/gallery/bentley-flying-spur-front-partner.webp",
  "/fleet/gallery/byd-atto-3-back.webp",
  "/fleet/gallery/byd-atto-3-front.webp",
  "/fleet/gallery/carocha-branco-1.webp",
  "/fleet/gallery/carocha-branco-2.webp",
  "/fleet/gallery/carocha-branco-3.webp",
  "/fleet/gallery/carocha-preto-1.webp",
  "/fleet/gallery/carocha-preto-2.webp",
  "/fleet/gallery/carocha-preto-3.webp",
  "/fleet/gallery/class-e-back.webp",
  "/fleet/gallery/class-e-front.webp",
  "/fleet/gallery/coach-1.webp",
  "/fleet/gallery/coach-2.webp",
  "/fleet/gallery/dacia-jogger-1.webp",
  "/fleet/gallery/dacia-jogger-2.webp",
  "/fleet/gallery/dacia-sandero-1.webp",
  "/fleet/gallery/dacia-sandero-2.webp",
  "/fleet/gallery/e-station-1.webp",
  "/fleet/gallery/e-station-2.webp",
  "/fleet/gallery/eqe-1.webp",
  "/fleet/gallery/eqe-2.webp",
  "/fleet/gallery/eqs-1.webp",
  "/fleet/gallery/eqs-2.webp",
  "/fleet/gallery/eqv-1.webp",
  "/fleet/gallery/eqv-2.webp",
  "/fleet/gallery/ferrari-f8-spider-front.webp",
  "/fleet/gallery/fiat-tipo-1.webp",
  "/fleet/gallery/fiat-tipo-2.webp",
  "/fleet/gallery/grand-scenic-1.webp",
  "/fleet/gallery/grand-scenic-2.webp",
  "/fleet/gallery/harley-davidson-motorbke-front.webp",
  "/fleet/gallery/jaguar-etype-1.webp",
  "/fleet/gallery/jaguar-etype-2.webp",
  "/fleet/gallery/jaguar-etype-3.webp",
  "/fleet/gallery/jaguar-stype-1.webp",
  "/fleet/gallery/jaguar-stype-2.webp",
  "/fleet/gallery/kombi-1.webp",
  "/fleet/gallery/lamborghini-huracan-spider-front.webp",
  "/fleet/gallery/maybach-van-1.webp",
  "/fleet/gallery/maybach-van-2.webp",
  "/fleet/gallery/maybach-van-3.webp",
  "/fleet/gallery/mg-branco-1.webp",
  "/fleet/gallery/mg-branco-2.webp",
  "/fleet/gallery/mg-branco-3.webp",
  "/fleet/gallery/mg-preto-1.webp",
  // Novas fotos de frota, a meio da lista.
  "/fleet/gallery/frota-ponte.webp",
  "/fleet/gallery/frota-belem.webp",
  "/fleet/gallery/vw-t2-mafra.webp",
  "/fleet/gallery/mg-preto-2.webp",
  "/fleet/gallery/mg-preto-3.webp",
  "/fleet/gallery/mini-branco-1.webp",
  "/fleet/gallery/mini-branco-2.webp",
  "/fleet/gallery/mini-branco-3.webp",
  "/fleet/gallery/mini-preto-1.webp",
  "/fleet/gallery/mini-preto-2.webp",
  "/fleet/gallery/mini-preto-3.webp",
  "/fleet/gallery/panamera-1.webp",
  "/fleet/gallery/panamera-2.webp",
  "/fleet/gallery/peugeot-e208-1.webp",
  "/fleet/gallery/peugeot-e208-2.webp",
  "/fleet/gallery/porsche-911-front.webp",
  "/fleet/gallery/renault-clio-1.webp",
  "/fleet/gallery/renault-clio-2.webp",
  "/fleet/gallery/rolls-royce-ghost-front-partner.webp",
  "/fleet/gallery/rolls-royce-phantom-back.webp",
  "/fleet/gallery/rolls-royce-phantom-front.webp",
  "/fleet/gallery/s-class-1.webp",
  "/fleet/gallery/s-class-2.webp",
  "/fleet/gallery/silver-cloud-1.webp",
  "/fleet/gallery/silver-cloud-2.webp",
  "/fleet/gallery/silver-cloud-3.webp",
  "/fleet/gallery/silver-shadow-1.webp",
  "/fleet/gallery/silver-shadow-2.webp",
  "/fleet/gallery/silver-shadow-3.webp",
  "/fleet/gallery/sprinter-1.webp",
  "/fleet/gallery/sprinter-2.webp",
  "/fleet/gallery/sprinter-back.webp",
  "/fleet/gallery/tesla-model-3-back.webp",
  "/fleet/gallery/tesla-model-3-front.webp",
  "/fleet/gallery/toyota-corolla-e20-front.webp",
  "/fleet/gallery/traveller-1.webp",
  "/fleet/gallery/traveller-2.webp",
  "/fleet/gallery/v-class-1.webp",
  "/fleet/gallery/v-class-2.webp",
  "/fleet/gallery/van-maybach-front-open-seats.webp",
  "/fleet/gallery/vespa-1.webp",
  "/fleet/gallery/vespa-2.webp",
  "/fleet/gallery/mini-classico-branco-interior-back.webp",
  "/fleet/gallery/mini-classico-preto-interior-back.webp",
  "/fleet/gallery/rolls-royce-ghost-interior.webp",
  "/fleet/gallery/silver-cloud-interior-back.webp",
  "/fleet/gallery/silver-shadow-interior-back.webp",
  "/fleet/gallery/van-maybach-interior-2.webp",
  "/fleet/gallery/van-maybach-interior-blue.webp",
  "/fleet/gallery/vw-carocha-branco-back-interior.webp",
  "/fleet/gallery/vw-carocha-preto-interior-back.webp",
]

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
          {/* Era uma fotografia fixa, fora da galeria: as setas mudavam o
              índice e a imagem ficava na mesma, portanto pareciam avariadas.
              Passa a mostrar a foto do carrossel, como no ecrã grande. */}
          <Image
            key={at(0)}
            src={at(0)}
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
