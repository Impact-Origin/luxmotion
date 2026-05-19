"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || isVisible) return
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -80px 0px",
      }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [isVisible, options?.threshold, options?.rootMargin])

  const base =
    "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"

  const reveal = (delay = "") =>
    cn(base, delay, isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")

  const revealFromLeft = (delay = "") =>
    cn(base, delay, isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")

  const revealFromRight = (delay = "") =>
    cn(base, delay, isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")

  return { ref, isVisible, reveal, revealFromLeft, revealFromRight }
}
