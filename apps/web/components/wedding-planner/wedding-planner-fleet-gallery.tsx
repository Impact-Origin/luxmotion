"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const VEHICLES = [
  { src: "/wedding-planner/fleet-gallery/rolls-royce-phantom.webp", name: "Rolls-Royce Phantom" },
  { src: "/wedding-planner/fleet-gallery/mercedes-s-class.webp", name: "Mercedes S-Class" },
  { src: "/wedding-planner/fleet-gallery/mini-classico.webp", name: "Mini Clássico" },
  { src: "/wedding-planner/fleet-gallery/mercedes-v-class.webp", name: "Mercedes V-Class" },
  { src: "/wedding-planner/fleet-gallery/mercedes-sprinter.webp", name: "Mercedes Sprinter" },
  { src: "/wedding-planner/fleet-gallery/man-coach.webp", name: "MAN Coach" },
] as const

function StarRow() {
  return (
    <div className="flex items-center gap-[3px] shrink-0 px-[14px] h-[36px] border-r-[0.889px] border-[rgba(255,255,255,0.22)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="bg-[#c9a96e] w-6 h-6 flex items-center justify-center">
          <Star className="w-3 h-3 text-[#0d0d0d]" fill="#0d0d0d" strokeWidth={0} />
        </span>
      ))}
    </div>
  )
}

function NavArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right"
  onClick: () => void
  disabled?: boolean
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Anterior" : "Seguinte"}
      className="size-11 shrink-0 border border-[rgba(201,169,110,0.35)] flex items-center justify-center text-[#c9a96e] hover:border-[#c9a96e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Icon className="size-[18px]" strokeWidth={1.5} />
    </button>
  )
}

export function WeddingPlannerFleetGallery() {
  const { ref, reveal } = useScrollReveal<HTMLElement>()
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  // Anda um cartão de cada vez, seja qual for a largura do ecrã.
  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = card ? card.offsetWidth + 8 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  return (
    <section ref={ref} className="bg-[#0D0D0D] px-4 md:px-[82px] py-16 md:py-24">
      <div className={cn("max-w-[1280px] mx-auto flex flex-col gap-6", reveal())}>
        <div
          ref={trackRef}
          onScroll={sync}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VEHICLES.map((v) => (
            <div
              key={v.src}
              data-card
              className="shrink-0 snap-start flex flex-col gap-2 w-[calc(100%-8px)] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-8px)]"
            >
              <div className="group relative w-full aspect-[324/323] overflow-hidden">
                <Image
                  src={v.src}
                  alt={v.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  /* cover: são fotos de local, não recortes — preenchem o
                     cartão em vez de deixarem bandas à volta. */
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-stretch gap-[10px]">
                <StarRow />
                <div className="flex-1 min-w-0 bg-[#e8e3db] flex items-center justify-center px-4 py-[14px]">
                  <span
                    className="text-[14px] text-[#070d0f] text-center tracking-[0.28px] leading-[15px]"
                    style={SANS}
                  >
                    {v.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <NavArrow direction="left" onClick={() => scrollByCard(-1)} disabled={atStart} />
          <NavArrow direction="right" onClick={() => scrollByCard(1)} disabled={atEnd} />
        </div>
      </div>
    </section>
  )
}
