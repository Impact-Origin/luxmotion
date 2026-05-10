"use client"

import * as React from "react"
import { Drawer } from "vaul"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MobileDrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
  className?: string
  /** When true, drawer opens to full height (e.g. for location picker with suggestions below) */
  fullHeight?: boolean
  /** When true, applies LuxMotion dark theme to the drawer chrome */
  dark?: boolean
}

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

/** Use viewport positioning only when keyboard is likely open (visible area shrunk). */
function shouldUseViewportPosition(rect: ViewportRect): boolean {
  if (typeof window === "undefined") return false
  const innerHeight = window.innerHeight
  if (innerHeight <= 0) return false
  return rect.height < innerHeight * 0.75
}

export function MobileDrawer({
  children,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  className,
  fullHeight = false,
  dark = false,
}: MobileDrawerProps) {
  const [rect, setRect] = React.useState<ViewportRect | null>(null)

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
  const contentStyle =
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

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "fixed inset-0 bg-black/40 z-[100]",
            useViewportPosition && "pointer-events-none"
          )}
        />
        <Drawer.Content
          style={contentStyle}
          className={cn(
            "z-[101] flex flex-col outline-none overflow-hidden",
            dark ? "bg-[#1e1d1b] border-t border-[rgba(201,169,110,0.18)]" : "bg-white",
            !useViewportPosition && "fixed bottom-0 left-0 right-0",
            useViewportPosition && "rounded-none",
            !useViewportPosition && (fullHeight ? "h-[92vh] max-h-[92vh]" : "max-h-[96vh]"),
            className
          )}
        >
          <div className={cn(
            "mx-auto mt-3 mb-5 h-1.5 w-12 rounded-full flex-shrink-0",
            dark ? "bg-[rgba(255,255,255,0.2)]" : "bg-gray-300"
          )} />

          <div className="flex flex-col flex-1 px-4 pb-8 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="shrink-0"
                >
                  <Drawer.Title className={cn(
                    "text-xl font-bold mb-1",
                    dark ? "text-white" : "text-[#222222]"
                  )}>
                    {title}
                  </Drawer.Title>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {description && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="shrink-0"
                >
                  <Drawer.Description className={cn(
                    "text-sm mb-6",
                    dark ? "text-[rgba(255,255,255,0.6)]" : "text-[#808080]"
                  )}>
                    {description}
                  </Drawer.Description>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

