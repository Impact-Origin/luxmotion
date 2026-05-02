"use client";

import { useState, useEffect } from "react";
import { User, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { getDailyNumber } from "@/lib/daily-number";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

interface DailyTravelersBadgeProps {
  /** Seed suffix for a different number per context (e.g. "tours" below tour checkout) */
  seedSuffix?: string;
  /** Custom min value (default: 90) */
  min?: number;
  /** Custom max value (default: 150) */
  max?: number;
  /** Optional className for the container */
  className?: string;
}

export function DailyTravelersBadge({
  seedSuffix = "",
  min = 90,
  max = 150,
  className = "",
}: DailyTravelersBadgeProps) {
  const t = useTranslations("hero");
  const { detailDailyTravelersMin, detailDailyTravelersMax } =
    useMarketingStats();
  const [count, setCount] = useState<number | null>(null);

  const effectiveMin = seedSuffix === "tours" ? detailDailyTravelersMin : min;
  const effectiveMax = seedSuffix === "tours" ? detailDailyTravelersMax : max;

  useEffect(() => {
    setCount(getDailyNumber(seedSuffix, effectiveMin, effectiveMax));

    const interval = setInterval(() => {
      setCount(getDailyNumber(seedSuffix, effectiveMin, effectiveMax));
    }, 3600000);

    return () => clearInterval(interval);
  }, [seedSuffix, effectiveMin, effectiveMax]);

  return (
    <div
      className={`flex items-center justify-center gap-[8px] pt-[16.8px] border-t-[0.8px] border-[rgba(255,255,255,0.04)] ${className}`}
    >
      <User
        className="size-[12px] text-[#999] shrink-0"
        strokeWidth={1.5}
      />
      <span
        className="text-[10px] font-semibold text-[#c9a96e] leading-none whitespace-nowrap"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t("travelersCount", { count: count ?? 0 })}
      </span>
      <span
        className="text-[10px] font-normal text-[#999] leading-none whitespace-nowrap"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t("bookedToday")}
      </span>
      <Star
        className="size-[10px] text-[#c9a96e] fill-[#c9a96e] shrink-0"
        strokeWidth={1.5}
      />
    </div>
  );
}
