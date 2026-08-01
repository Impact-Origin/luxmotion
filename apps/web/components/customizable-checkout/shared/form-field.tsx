"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("mb-6", className)}>
      <label className="block text-[16px] font-bold text-[#222222] mb-2">
        {label}
        {required && <span className="text-[#ff0000]">*</span>}
      </label>
      {children}
    </div>
  )
}

