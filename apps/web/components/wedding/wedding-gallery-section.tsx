"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSwipe } from "@/hooks/use-swipe"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const PHOTOS = [
  { src: "/wedding/gallery-1.png", primary: "Douro", subtitle: "Portugal", tagline: "Vinhas e votos" },
  { src: "/wedding/gallery-2.png", primary: "Sintra", subtitle: "Portugal", tagline: "Floresta encantada" },
  { src: "/wedding/gallery-3.png", primary: "Algarve", subtitle: "Portugal", tagline: "Falésias ao pôr-do-sol" },
] as const

function TiltCard({
  src,
  alt,
  primary,
  subtitle,
  tagline,
  className,
  restRotateY = 0,
}: {
  src: string
  alt: string
  primary: string
  subtitle: string
  tagline: string
  /** Substitui o dimensionamento por omissão (usado para destacar o do meio). */
  className?: string
  /**
   * Rotação 3D em repouso. As laterais viram para dentro (aresta exterior
   * afastada), o centro fica direito. A inclinação do rato soma-se a esta.
   */
  restRotateY?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const ry = (x - 0.5) * 22
    const rx = -(y - 0.5) * 22
    setTilt({ rx, ry, mx: x * 100, my: y * 100 })
  }

  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 })

  return (
    <div
      className={cn("relative min-w-0", className ?? "flex-1 self-stretch")}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full w-full bg-white overflow-hidden shadow-[0_10px_30px_-10px_rgba(13,13,13,0.25)] hover:shadow-[0_40px_70px_-20px_rgba(13,13,13,0.5)]"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${restRotateY + tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease-out",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover select-none"
            draggable={false}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)`,
            mixBlendMode: "overlay",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(13,13,13,0.78)] from-0% via-[rgba(13,13,13,0.25)] via-35% to-transparent to-65%" />

        <div
          className="pointer-events-none absolute left-7 right-7 bottom-7 flex flex-col gap-1"
          style={{
            transform: `translate3d(${-(tilt.mx - 50) * 0.18}px, ${-(tilt.my - 50) * 0.18}px, 90px)`,
            transformStyle: "preserve-3d",
            transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span
            className="text-[34px] md:text-[40px] leading-none font-semibold uppercase tracking-[2.5px] text-white drop-shadow-[0_6px_22px_rgba(0,0,0,0.65)]"
            style={SANS_FONT}
          >
            {primary}
          </span>
          <span
            className="text-[14px] md:text-[15px] font-semibold uppercase tracking-[3.5px] text-white/85 drop-shadow-[0_3px_14px_rgba(0,0,0,0.6)]"
            style={SANS_FONT}
          >
            {subtitle}
          </span>
          <span
            className="mt-2 text-[14px] md:text-[15px] italic text-white/80 drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]"
            style={SERIF_FONT}
          >
            {tagline}
          </span>
        </div>
      </div>
    </div>
  )
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="size-12 border-[1.714px] border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] transition-colors shrink-0 cursor-pointer"
    >
      <Icon className="size-[18px] text-[#a08248]" strokeWidth={1.5} />
    </button>
  )
}

function Dots({ pages, current }: { pages: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: pages }).map((_, i) => (
        <span
          key={i}
          className={`size-[5.352px] rounded-full transition-colors duration-300 ${
            i === current ? "bg-[#a08248]" : "bg-[rgba(168,131,58,0.3)]"
          }`}
        />
      ))}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  headingStart,
  headingAccent,
}: {
  eyebrow: string
  headingStart: string
  headingAccent: string
}) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 items-center justify-center">
        <span className="h-px w-8 bg-[#a08248]" />
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-[#a08248]" />
      </div>
      <h2
        className="text-[32px] md:text-[48px] leading-[1.1] font-normal text-[#1a1612] text-center"
        style={SERIF_FONT}
      >
        <span>{headingStart} </span>
        <span className="italic text-[#a08248]">{headingAccent}</span>
      </h2>
    </div>
  )
}

export function WeddingGallerySection() {
  const t = useTranslations("wedding.gallery")
  const [page, setPage] = useState(0)

  const next = useCallback(() => setPage((p) => (p + 1) % PHOTOS.length), [])
  const prev = useCallback(
    () => setPage((p) => (p - 1 + PHOTOS.length) % PHOTOS.length),
    [],
  )
  const swipe = useSwipe(next, prev)

  return (
    <section className="bg-[#f7f4ef] px-4 md:px-20 py-14 md:py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-4 items-center">
        <SectionHeading
          eyebrow={t("eyebrow")}
          headingStart={t("headingStart")}
          headingAccent={t("headingAccent")}
        />

        {/* A do meio domina: mais larga e à altura toda; as laterais recolhem. */}
        <div className="hidden md:flex gap-[10px] items-center justify-center w-full pt-[42px] h-[608.21px]">
          {PHOTOS.map((p, i) => (
            <TiltCard
              key={i}
              src={p.src}
              primary={p.primary}
              subtitle={p.subtitle}
              tagline={p.tagline}
              alt={t("photoAlt", { index: i + 1 })}
              // Filho direto do flex: sem wrapper, senão perde a altura.
              className={
                i === 1
                  ? "flex-[1.35] self-stretch"
                  : "flex-[0.85] self-center h-[86%]"
              }
              // Laterais viram para dentro; a do meio fica de frente. 6.1° dá
              // o rácio 0.970 entre arestas medido na referência.
              restRotateY={i === 0 ? -6.1 : i === 2 ? 6.1 : 0}
            />
          ))}
        </div>

        <div className="md:hidden w-full pt-2" {...swipe}>
          <div className="relative h-[531.21px] w-full">
            <TiltCard
              src={PHOTOS[page]!.src}
              primary={PHOTOS[page]!.primary}
              subtitle={PHOTOS[page]!.subtitle}
              tagline={PHOTOS[page]!.tagline}
              alt={t("photoAlt", { index: page + 1 })}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <NavArrow direction="left" onClick={prev} />
          <Dots pages={PHOTOS.length} current={page} />
          <NavArrow direction="right" onClick={next} />
        </div>
      </div>
    </section>
  )
}
