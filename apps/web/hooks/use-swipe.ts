"use client"

import { useRef, useMemo } from "react"

const DEFAULT_THRESHOLD = 50

export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  options?: { threshold?: number }
) {
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD
  const touchStartX = useRef(0)
  const pointerStartX = useRef<number | null>(null)
  const pointerDragged = useRef(false)
  const suppressClick = useRef(false)
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
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === "touch") return
        pointerStartX.current = e.clientX
        pointerDragged.current = false
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (e.pointerType === "touch" || pointerStartX.current === null) return
        if (Math.abs(e.clientX - pointerStartX.current) > 5) {
          pointerDragged.current = true
        }
      },
      onPointerUp: (e: React.PointerEvent) => {
        if (e.pointerType === "touch" || pointerStartX.current === null) return
        const delta = pointerStartX.current - e.clientX
        pointerStartX.current = null
        if (pointerDragged.current && Math.abs(delta) > threshold) {
          suppressClick.current = true
          if (delta > 0) callbacks.current.onSwipeLeft()
          else callbacks.current.onSwipeRight()
        }
        pointerDragged.current = false
      },
      onPointerCancel: () => {
        pointerStartX.current = null
        pointerDragged.current = false
      },
      onClickCapture: (e: React.MouseEvent) => {
        if (suppressClick.current) {
          e.preventDefault()
          e.stopPropagation()
          suppressClick.current = false
        }
      },
    }),
    [threshold]
  )
}
