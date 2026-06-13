import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface BenefitCardProps {
  icon: ReactNode
  label: string
  iconClassName?: string
}

export function BenefitCard({ icon, label, iconClassName = "text-[#1c1b18]" }: BenefitCardProps) {
  return (
    <div className="group flex flex-col gap-4 items-start bg-white border border-[rgba(28,27,24,0.08)] px-6 py-3 min-h-[88px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(160,130,72,0.45)] hover:shadow-[0_12px_28px_-10px_rgba(160,130,72,0.4)]">
      <div
        className={cn(
          "transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <p className="text-[14px] font-semibold leading-[1.2] text-[#0d0d0d]">
        {label}
      </p>
    </div>
  )
}
