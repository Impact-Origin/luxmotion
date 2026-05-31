"use client"

import { useTranslations } from "next-intl"
import { Check, X } from "lucide-react"

function Item({ included, children }: { included: boolean; children: React.ReactNode }) {
  return (
    <li className="flex w-full items-start gap-[10px]">
      <span
        className={
          included
            ? "mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[rgba(154,117,53,0.08)] text-[#a08248]"
            : "mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-white/70 text-[#8c8680]"
        }
      >
        {included ? <Check className="size-[10px]" strokeWidth={3} /> : <X className="size-[10px]" strokeWidth={3} />}
      </span>
      <span className="text-[12px] leading-[18.6px] text-[#696969]">{children}</span>
    </li>
  )
}

export function UltraTourIncludedExcluded({ included, excluded }: { included: string[]; excluded: string[] }) {
  const t = useTranslations("tourDetails")
  if (included.length === 0 && excluded.length === 0) return null

  return (
    <div className="flex flex-col items-stretch gap-[6px] md:flex-row">
      {included.length > 0 && (
        <div className="flex flex-1 flex-col gap-[18px] border border-[#a08248] bg-[rgba(201,169,110,0.1)] p-6">
          <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#a08248]">{t("included")}</span>
          <ul className="flex flex-col gap-[10px]">
            {included.map((item, i) => (
              <Item key={i} included>
                {item}
              </Item>
            ))}
          </ul>
        </div>
      )}
      {excluded.length > 0 && (
        <div className="flex flex-1 flex-col gap-[18px] border border-[rgba(28,27,24,0.08)] p-6">
          <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#696969]">{t("excluded")}</span>
          <ul className="flex flex-col gap-[10px]">
            {excluded.map((item, i) => (
              <Item key={i} included={false}>
                {item}
              </Item>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
