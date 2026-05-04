import type { ReactNode } from "react"

interface BenefitCardProps {
  icon: ReactNode
  label: string
  iconClassName?: string
}

export function BenefitCard({ icon, label, iconClassName = "text-[#1c1b18]" }: BenefitCardProps) {
  return (
    <div className="flex flex-col gap-4 items-start bg-white border border-[rgba(28,27,24,0.08)] px-6 py-3 min-h-[88px]">
      <div className={iconClassName}>{icon}</div>
      <p className="text-[14px] font-semibold leading-[1.2] text-[#0d0d0d]">
        {label}
      </p>
    </div>
  )
}
