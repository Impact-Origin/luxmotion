"use client"

import { type ReactNode } from "react"
import { Check } from "lucide-react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { cn } from "@workspace/ui/lib/utils"

interface InsuranceBenefit {
  text: string
  subtext?: string
}

interface InsuranceOptionCardProps {
  id: string
  title: string
  price: string
  subtitle?: string
  benefits: InsuranceBenefit[]
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  recommendedLabel?: string
  className?: string
}

export function InsuranceOptionCard({
  id,
  title,
  price,
  subtitle,
  benefits,
  checked,
  onCheckedChange,
  recommendedLabel,
  className,
}: InsuranceOptionCardProps) {
  return (
    <div className={cn("border border-[#e0e0e0] rounded-lg relative", className)}>
      {recommendedLabel && (
        <div className="absolute -top-3 right-4 z-20">
          <span className="bg-[#48d9a4] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
            {recommendedLabel}
          </span>
        </div>
      )}
      <div className="bg-[#48d9a4]/10 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={(c: boolean) => onCheckedChange(c)}
            />
            <label htmlFor={id} className="text-[16px] font-bold text-[#222222]">
              {title}
            </label>
          </div>
          <span className="text-[18px] font-bold text-[#222222]">{price}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-b-lg">
        {subtitle && (
          <h4 className="text-[14px] font-bold text-[#222222] mb-3">{subtitle}</h4>
        )}
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[#48d9a4] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] text-[#222222]">
                {benefit.text}
                {benefit.subtext && (
                  <>
                    <br />
                    <span className="text-[#808080]">{benefit.subtext}</span>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

