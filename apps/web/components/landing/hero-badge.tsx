"use client"

import { BadgeEuro, ShieldCheck, BadgeCheck } from "lucide-react"
import { Themed } from "@/components/themed"
import { cn } from "@workspace/ui/lib/utils"

type BadgeIconType = "price" | "shield" | "driver"

interface HeroBadgeProps {
  icon: BadgeIconType
  text: string
  className?: string
}

const icons = {
  price: <BadgeEuro className="w-[20px] h-[20px]" />,
  shield: <ShieldCheck className="w-[20px] h-[20px]" />,
  driver: <BadgeCheck className="w-[20px] h-[20px]" />,
}

export function HeroBadge({ icon, text, className }: HeroBadgeProps) {
  return (
    <div
      data-theme-color="heroBadgeBg"
      className={cn(
        "inline-flex items-center gap-[8px] pl-[8px] pr-[16px] py-[9px] rounded-[48px] shrink-0",
        "bg-[#E9F9FF]",
        className
      )}
      style={{ 
        backgroundColor: "var(--theme-hero-badge-bg, #E9F9FF)" 
      }}
    >
      <Themed 
        as="span" 
        colorType="heroBadgeIcon" 
        style={{ color: "var(--theme-hero-badge-icon, #0E4659)" }}
        className="flex items-center justify-center"
      >
      {icons[icon]}
      </Themed>
      <Themed 
        as="span" 
        colorType="heroBadgeText" 
        className="text-[14px] md:text-[16px] font-medium whitespace-nowrap" 
        style={{ color: "var(--theme-hero-badge-text, #0E4659)" }}
      >
        {text}
      </Themed>
    </div>
  )
}
