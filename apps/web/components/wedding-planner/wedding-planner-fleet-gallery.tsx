"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const VEHICLES = [
  { src: "/wedding-planner/fleet-gallery/tesla-model-3.png", name: "Tesla Model 3" },
  { src: "/wedding-planner/fleet-gallery/bentley-flying-spur.png", name: "Bentley Flying Spur" },
  { src: "/wedding-planner/fleet-gallery/porsche-panamera.png", name: "Porsche Panamera" },
  { src: "/wedding-planner/fleet-gallery/mercedes-sprinter-1.png", name: "Mercedes Sprinter" },
  { src: "/wedding-planner/fleet-gallery/mercedes-v-class.png", name: "Mercedes V-Class" },
  { src: "/wedding-planner/fleet-gallery/mercedes-sprinter-2.png", name: "Mercedes Sprinter" },
  { src: "/wedding-planner/fleet-gallery/placeholder-7.png", name: "TBD" },
  { src: "/wedding-planner/fleet-gallery/placeholder-8.png", name: "TBD" },
  { src: "/wedding-planner/fleet-gallery/placeholder-9.png", name: "TBD" },
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

export function WeddingPlannerFleetGallery() {
  const { ref, reveal } = useScrollReveal<HTMLElement>()
  return (
    <section ref={ref} className="bg-[#0D0D0D] px-4 md:px-[82px] pb-16">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {VEHICLES.map((v, i) => (
            <div
              key={i}
              className={cn("flex flex-col gap-2", reveal())}
              style={{ transitionDelay: `${(i % 3) * 110 + Math.floor(i / 3) * 180}ms` }}
            >
              <div className="group relative w-full aspect-[324/323] overflow-hidden">
                <Image
                  src={v.src}
                  alt={v.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
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
      </div>
    </section>
  )
}
