"use client"

import { useEffect, type RefObject } from "react"

type Options = {
  speedPxPerSec?: number
  resumeDelay?: number
  activeBelow?: number
}

export function useAutoScrollMarquee<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: Options = {}
) {
  const { speedPxPerSec = 24, resumeDelay = 1800, activeBelow = 768 } = options

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const mql = window.matchMedia(`(max-width: ${activeBelow - 1}px)`)

    let rafId: number | null = null
    let paused = false
    let resumeTimer: ReturnType<typeof setTimeout> | null = null
    let virtual = 0
    let lastTs = 0

    const tick = (ts: number) => {
      const dt = lastTs === 0 ? 0 : (ts - lastTs) / 1000
      lastTs = ts

      if (paused) {
        virtual = el.scrollLeft
      } else {
        virtual += speedPxPerSec * dt
        const half = el.scrollWidth / 2
        if (half > 0 && virtual >= half) {
          virtual -= half
        }
        el.scrollLeft = virtual
      }
      rafId = requestAnimationFrame(tick)
    }

    const pause = () => {
      paused = true
      if (resumeTimer) clearTimeout(resumeTimer)
    }
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        paused = false
      }, resumeDelay)
    }
    const onWheel = () => {
      pause()
      scheduleResume()
    }

    const start = () => {
      if (rafId !== null) return
      virtual = el.scrollLeft
      lastTs = 0
      rafId = requestAnimationFrame(tick)
      el.addEventListener("touchstart", pause, { passive: true })
      el.addEventListener("touchend", scheduleResume, { passive: true })
      el.addEventListener("touchcancel", scheduleResume, { passive: true })
      el.addEventListener("pointerdown", pause)
      el.addEventListener("pointerup", scheduleResume)
      el.addEventListener("pointercancel", scheduleResume)
      el.addEventListener("wheel", onWheel, { passive: true })
    }

    const stop = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = null
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = null
      paused = false
      el.removeEventListener("touchstart", pause)
      el.removeEventListener("touchend", scheduleResume)
      el.removeEventListener("touchcancel", scheduleResume)
      el.removeEventListener("pointerdown", pause)
      el.removeEventListener("pointerup", scheduleResume)
      el.removeEventListener("pointercancel", scheduleResume)
      el.removeEventListener("wheel", onWheel)
    }

    const sync = () => {
      if (mql.matches) start()
      else stop()
    }
    sync()
    mql.addEventListener("change", sync)

    return () => {
      mql.removeEventListener("change", sync)
      stop()
    }
  }, [ref, speedPxPerSec, resumeDelay, activeBelow])
}
