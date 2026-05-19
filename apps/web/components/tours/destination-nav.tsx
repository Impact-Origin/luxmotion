"use client"

import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

interface DestinationNavProps {
  currentSlug: string
}

const DESTINATIONS: { slug: string; label: string }[] = [
  { slug: "lisboa", label: "Lisboa" },
  { slug: "porto", label: "Porto" },
  { slug: "algarve", label: "Algarve" },
  { slug: "alentejo", label: "Alentejo" },
  { slug: "acores", label: "Açores" },
  { slug: "madeira", label: "Madeira" },
]

export function DestinationNav({ currentSlug }: DestinationNavProps) {
  return (
    <nav className="sticky top-[46px] z-30 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b-[0.8px] border-[rgba(201,169,110,0.1)]">
      <div
        className="max-w-[1440px] mx-auto px-4 md:px-[60px] overflow-x-auto scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <ul className="flex items-start justify-start md:justify-center min-w-max">
          {DESTINATIONS.map((d) => {
            const isActive = d.slug === currentSlug
            return (
              <li key={d.slug} className="shrink-0">
                <Link
                  href={`/tours/${d.slug}`}
                  className={cn(
                    "group relative block px-[20px] md:px-[28px] pt-[16px] pb-[17.6px] text-[12px] font-semibold uppercase tracking-[1.2px] whitespace-nowrap transition-colors duration-300 ease-out",
                    isActive ? "text-[#c9a96e]" : "text-[#8c8680] hover:text-[#c9a96e]"
                  )}
                  style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
                >
                  {d.label}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute left-[20px] right-[20px] md:left-[28px] md:right-[28px] bottom-0 h-[1.6px] bg-[#c9a96e] origin-center transition-transform duration-300 ease-out",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100 bg-[rgba(201,169,110,0.6)]"
                    )}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
