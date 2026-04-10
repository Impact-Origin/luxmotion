"use client"

import { ShieldCheck } from "lucide-react"

interface FreeCancellationBannerProps {
  title: string
  description: string
}

export function FreeCancellationBanner({ title, description }: FreeCancellationBannerProps) {
  return (
    <div className="bg-[#e9f9ff] border border-[#1d95bf] rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-8 h-8 text-[#0e4659] shrink-0" />
        <div className="flex flex-col gap-2 text-[#0e4659]">
          <h4 className="text-[14px] font-bold tracking-[0.14px]">{title}</h4>
          <p className="text-[12px] font-normal leading-[1.2] tracking-[0.12px]">{description}</p>
        </div>
      </div>
    </div>
  )
}

