"use client"

import { useEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function useEnterAnimation(initialDelayMs = 100) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), initialDelayMs)
    return () => clearTimeout(timer)
  }, [initialDelayMs])

  const enter = (delay = "") =>
    cn(
      "transition-all duration-700 ease-out",
      delay,
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    )

  return { isVisible, enter }
}
