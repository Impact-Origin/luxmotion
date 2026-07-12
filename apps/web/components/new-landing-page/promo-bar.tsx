"use client"

import { useEffect, useRef } from "react"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"
import { useSiteSettings } from "@/hooks/use-site-settings"

// Height of the announcement strip. Exposed to the layout as the CSS var
// `--promo-h` so the fixed header (and header-height sticky offsets) can shift
// down by exactly this amount when the bar is shown, and sit flush when it isn't.
const PROMO_HEIGHT = 36

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

export function PromoBar() {
  const { announcementsEnabled, announcements } = useSiteSettings()
  const marqueeRef = useRef<HTMLDivElement>(null)
  useAutoScrollMarquee(marqueeRef, { activeBelow: 99999, speedPxPerSec: 32 })

  const messages = announcements.filter((m) => m.trim().length > 0)
  const show = Boolean(announcementsEnabled && messages.length > 0)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--promo-h", show ? `${PROMO_HEIGHT}px` : "0px")
    return () => {
      root.style.setProperty("--promo-h", "0px")
    }
  }, [show])

  if (!show) return null

  // Repeat until there are enough items to overflow the viewport, then duplicate
  // the whole set once more so the marquee loops seamlessly (reset happens at
  // scrollWidth/2 — see use-auto-scroll-marquee).
  const oneSet =
    messages.length >= 4
      ? messages
      : Array.from({ length: Math.ceil(4 / messages.length) }, () => messages).flat()
  const loop = [...oneSet, ...oneSet]

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[45] bg-[#0D0D0D] border-b border-[rgba(201,169,110,0.25)]"
      style={{ height: PROMO_HEIGHT }}
      role="region"
      aria-label="Announcements"
    >
      <div
        ref={marqueeRef}
        className="h-full w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
      >
        <div className="flex h-full items-center w-max px-6">
          {loop.map((msg, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span
                className="text-[12px] font-medium tracking-[0.5px] text-[#C9A96E] whitespace-nowrap"
                style={sans}
              >
                {msg}
              </span>
              <span
                aria-hidden
                className="mx-8 text-[10px] text-[rgba(201,169,110,0.4)]"
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
