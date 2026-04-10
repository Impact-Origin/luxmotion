"use client";

import { useState, useEffect } from "react";
import { User, Flame } from "lucide-react";
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
    <div className={`flex items-center gap-1.5 md:gap-2 ${className}`}>
      <div className="bg-[#f7f7f7] p-1.5 md:p-2 rounded-full shrink-0">
        <User className="w-3 h-3 md:w-4 md:h-4 text-[#808080]" />
      </div>
      <p className="text-[11px] md:text-[12px] font-normal tracking-[0.1px] text-[#808080] whitespace-nowrap shrink-0">
        {count ?? 0}{" "}
        <span className="font-bold text-[#222222]">{t("travelers")}</span>{" "}
        {t("bookedRide")}{" "}
        <span className="font-bold text-[#222222]">{t("today")}</span>
      </p>
      <Flame className="w-3 h-3 md:w-4 md:h-4 text-[#F97316] fill-[#F97316] shrink-0" />
    </div>
  );
}
