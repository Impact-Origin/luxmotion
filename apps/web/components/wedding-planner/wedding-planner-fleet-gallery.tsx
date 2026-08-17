"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const VEHICLES = [
  { src: "/planners/fleet/rolls-royce-phantom.webp", name: "Rolls-Royce Phantom" },
  { src: "/planners/fleet/mercedes-s-class.webp", name: "Mercedes S-Class" },
  { src: "/planners/fleet/mini-classico.webp", name: "Mini Clássico" },
  { src: "/planners/fleet/mercedes-v-class.webp", name: "Mercedes V-Class" },
  { src: "/planners/fleet/mercedes-sprinter.webp", name: "Mercedes Sprinter" },
  { src: "/planners/fleet/man-coach.webp", name: "MAN Coach" },
] as const

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
              className="group relative shrink-0 snap-start w-[calc(100%-8px)] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-8px)] aspect-[324/323] overflow-hidden"
            >
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
