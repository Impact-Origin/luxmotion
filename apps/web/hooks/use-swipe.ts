"use client"

import { useRef, useMemo } from "react"

const DEFAULT_THRESHOLD = 50

/**
 * Returns touch handlers for swipe-left / swipe-right on mobile.
 * Use on carousel containers so users can drag with finger to change slide.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  options?: { threshold?: number }
) {
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD
  const touchStartX = useRef(0)
  const callbacks = useRef({ onSwipeLeft, onSwipeRight })
  callbacks.current = { onSwipeLeft, onSwipeRight }

  return useMemo(
    () => ({
      onTouchStart: (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? 0
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const endX = e.changedTouches[0]?.clientX ?? 0
        const delta = touchStartX.current - endX
        if (delta > threshold) callbacks.current.onSwipeLeft()
        else if (delta < -threshold) callbacks.current.onSwipeRight()
      },
    }),
    [threshold]
  )
}
