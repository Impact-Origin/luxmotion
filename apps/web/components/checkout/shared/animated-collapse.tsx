"use client"

import { cn } from "@workspace/ui/lib/utils"
import type { ReactNode } from "react"

interface AnimatedCollapseProps {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export function AnimatedCollapse({ isOpen, children, className }: AnimatedCollapseProps) {
  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

