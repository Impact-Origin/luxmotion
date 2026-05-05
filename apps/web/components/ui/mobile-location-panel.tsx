"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

type ViewportRect = { top: number; left: number; width: number; height: number }

function getViewportRect(): ViewportRect {
  if (typeof window === "undefined") return { top: 0, left: 0, width: 0, height: 0 }
  const vv = window.visualViewport
  if (vv) {
    return {
      top: vv.offsetTop,
      left: vv.offsetLeft,
      width: vv.width,
      height: vv.height,
    }
  }
  return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
}

function shouldUseViewportPosition(rect: ViewportRect): boolean {
  if (typeof window === "undefined") return false
  const innerHeight = window.innerHeight
  if (innerHeight <= 0) return false
  return rect.height < innerHeight * 0.75
}

export interface MobileLocationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  /** When true, applies LuxMotion dark theme to the panel chrome */
  dark?: boolean
}

export function MobileLocationPanel({
  open,
  onOpenChange,
  title,
  trigger,
  children,
  className,
  dark = false,
}: MobileLocationPanelProps) {
  const [rect, setRect] = React.useState<ViewportRect | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const triggerContainerRef = React.useRef<HTMLDivElement>(null)
  const wasOpenRef = React.useRef(false)

  React.useEffect(() => {
    setMounted(typeof document !== "undefined")
  }, [])

  React.useEffect(() => {
    if (wasOpenRef.current && !open) {
      wasOpenRef.current = false
      requestAnimationFrame(() => {
        setTimeout(() => {
          triggerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      })
    } else if (open) {
      wasOpenRef.current = true
    }
  }, [open])

  React.useEffect(() => {
    if (!open) {
      setRect(null)
      return
    }
    setRect(getViewportRect())
    const handler = () => setRect(getViewportRect())
    window.visualViewport?.addEventListener("resize", handler)
    window.visualViewport?.addEventListener("scroll", handler)
    return () => {
      window.visualViewport?.removeEventListener("resize", handler)
      window.visualViewport?.removeEventListener("scroll", handler)
    }
  }, [open])

  const useViewportPosition = rect !== null && shouldUseViewportPosition(rect)
  const panelStyle =
    useViewportPosition && rect !== null
      ? {
          position: "fixed" as const,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          maxHeight: rect.height,
        }
      : undefined

  const handleOverlayClick = () => onOpenChange(false)

  if (!mounted) return <>{trigger}</>

  const panel = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-0 z-[100] bg-black/40",
              useViewportPosition && "pointer-events-none"
            )}
            onClick={useViewportPosition ? undefined : handleOverlayClick}
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              ...panelStyle,
              zIndex: 101,
            }}
            className={cn(
              "flex flex-col outline-none overflow-hidden",
              dark ? "bg-[#1e1d1b] border-t border-[rgba(201,169,110,0.18)]" : "bg-white",
              !useViewportPosition && "fixed bottom-0 left-0 right-0 rounded-t-[20px] min-h-0 max-h-[92vh] h-[92vh]",
              useViewportPosition && "rounded-none",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-location-panel-title"
          >
            <div className="relative shrink-0">
              <div className={cn(
                "mx-auto mt-3 mb-2 h-1.5 w-12 rounded-full",
                dark ? "bg-[rgba(255,255,255,0.2)]" : "bg-gray-300"
              )} />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={cn(
                  "absolute top-1 right-1 p-1.5 rounded-full transition-colors touch-manipulation",
                  dark
                    ? "text-white bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.14)] active:bg-[rgba(255,255,255,0.2)]"
                    : "text-[#222] bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                )}
                aria-label="Fechar"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex flex-col flex-1 px-4 pb-8 overflow-hidden min-h-0">
              <h2
                id="mobile-location-panel-title"
                className={cn(
                  "text-xl font-bold shrink-0 mb-1 pr-12",
                  dark ? "text-white" : "text-[#222222]"
                )}
              >
                {title}
              </h2>
              <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div
        ref={triggerContainerRef}
        className="w-full h-full"
        onClick={() => onOpenChange(true)}
        role="presentation"
      >
        {trigger}
      </div>
      {createPortal(panel, document.body)}
    </>
  )
}
