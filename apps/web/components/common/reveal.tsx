"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Scroll-reveal wrapper — fades + slides its children in as they enter the
 * viewport, using the project-wide `useScrollReveal` hook so the motion is
 * congruent with the rest of the site.
 */
export function Reveal({
  children,
  className,
  delay,
  from = "up",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  from?: "up" | "left" | "right"
}) {
  const { ref, reveal, revealFromLeft, revealFromRight } = useScrollReveal<HTMLDivElement>()
  const fn = from === "left" ? revealFromLeft : from === "right" ? revealFromRight : reveal
  return (
    <div
      ref={ref}
      className={cn(fn(), className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
