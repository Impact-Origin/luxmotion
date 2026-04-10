"use client"

import { AlertCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface InvoiceLineItemProps {
  label: string
  value: string
  showInfo?: boolean
  isBold?: boolean
  className?: string
}

export function InvoiceLineItem({ label, value, showInfo, isBold, className }: InvoiceLineItemProps) {
  return (
    <div className={cn("flex items-center justify-between text-[12px]", isBold ? "text-[#222222] font-bold" : "text-[#808080]", className)}>
      <div className="flex items-center gap-1">
        <span className={isBold ? "font-bold" : "font-normal"}>{label}</span>
        {showInfo && (
          <div className="p-1 rounded">
            <AlertCircle className="w-4 h-4 text-[#27c7ff]" />
          </div>
        )}
      </div>
      <span className={isBold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  )
}

