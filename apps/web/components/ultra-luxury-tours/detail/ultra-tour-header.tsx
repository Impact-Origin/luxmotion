"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Clock, MapPin, Users, Globe } from "lucide-react"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

interface UltraTourHeaderProps {
  title: string
  rating: number
  reviewCount: number
  destination: string
  tourType: string
  duration: string
  groupSize: string
  languages: string[]
}

function MetaBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-[10px] border-[0.8px] border-[rgba(154,117,53,0.22)] px-[16px] py-[9px]">
      <span className="flex size-[32px] shrink-0 items-center justify-center border-[1.5px] border-[rgba(201,169,110,0.25)] bg-[rgba(201,169,110,0.08)] text-[#a08248]">
        {icon}
      </span>
      <div className="flex flex-col gap-[2px]">
        <span className="text-[8px] font-semibold uppercase tracking-[1.2px] text-[#696969]">{label}</span>
        <span className="text-[12px] font-medium leading-[1.2] text-[#0d0d0d]">{value}</span>
      </div>
    </div>
  )
}

export function UltraTourHeader({
  title,
  rating,
  reviewCount,
  destination,
  tourType,
  duration,
  groupSize,
  languages,
}: UltraTourHeaderProps) {
  const t = useTranslations("tourDetails")
  const words = title.trim().split(" ")
  const lastWord = words.length > 1 ? words.pop() : ""
  const lead = words.join(" ")
  const eyebrow = [tourType, destination].filter(Boolean).join(" · ")

  return (
    <div className="flex flex-col gap-[13px] pt-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[12px]">
          <Link href="/ultra-luxury-tours" className="text-[#696969] transition-colors hover:text-[#a08248]">
            Luxury Tours
          </Link>
          <span className="text-[#696969]">›</span>
          <span className="truncate text-[#0d0d0d]">{title}</span>
        </div>

        <div className="grid grid-cols-2 gap-[2px] lg:grid-cols-4">
          <MetaBadge icon={<Clock className="size-4" strokeWidth={1.6} />} label={t("duration")} value={duration} />
          <MetaBadge icon={<MapPin className="size-4" strokeWidth={1.6} />} label={t("location")} value={destination} />
          <MetaBadge icon={<Users className="size-4" strokeWidth={1.6} />} label={t("groupSize")} value={groupSize} />
          <MetaBadge icon={<Globe className="size-4" strokeWidth={1.6} />} label={t("languages")} value={languages.join(" · ")} />
        </div>
      </div>

      {eyebrow && (
        <div className="flex items-center gap-[10px] pt-2">
          <span className="h-px w-5 bg-[#a08248]" />
          <span className="text-[9px] font-semibold uppercase tracking-[2.25px] text-[#a08248]">{eyebrow}</span>
        </div>
      )}

      <div>
        <h1 className="text-[40px] leading-[1.15] text-[#0d0d0d] md:text-[48px]" style={{ fontFamily: SERIF_FONT }}>
          {lead}
          {lastWord && (
            <>
              {" "}
              <span className="italic text-[#a08248]">{lastWord}</span>
            </>
          )}
        </h1>

        <div className="flex items-center gap-[10px] pt-[3px]">
          <span className="text-[14px] tracking-[1px] text-[#a08248]">★★★★★</span>
          <span className="text-[16px] text-[#0d0d0d]" style={{ fontFamily: SERIF_FONT }}>
            {rating.toFixed(1)}
          </span>
          <span className="text-[12px] text-[#696969]">· {reviewCount} {t("reviews")}</span>
        </div>
      </div>
    </div>
  )
}
