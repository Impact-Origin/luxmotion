"use client"

import { type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface CollapsibleSectionProps {
  title: string
  titleExtra?: ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function CollapsibleSection({
  title,
  titleExtra,
  isExpanded,
  onToggle,
  children,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleSectionProps) {
  return (
    <div className={className}>
      <button
        onClick={onToggle}
        className={cn("w-full flex items-center justify-between", headerClassName)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-[20px] font-bold text-[#222222]">{title}</h3>
          {titleExtra}
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-[#222222] transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className={cn("overflow-hidden", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}

