"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

interface TrustBannerProps {
  translations: {
    exclusive: string;
    flexibleCancellation: string;
    excellent: string;
    reviewsOn: string;
  };
}

function HalfStar() {
  return (
    <svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="halfStarGradient">
          <stop offset="50%" stopColor="#00b67a" />
          <stop offset="50%" stopColor="#dcdce6" />
        </linearGradient>
      </defs>
      <path
        d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z"
        fill="url(#halfStarGradient)"
      />
    </svg>
  );
}

export function TrustBanner({ translations: t }: TrustBannerProps) {
  const { trustpilotReviewCount } = useMarketingStats();

  return (
    <div
      className={cn(
        // Mobile: ligeiramente maior (ícones, texto, padding)
        "flex flex-row items-center gap-[10px] px-[14px] py-[10px] rounded-full bg-white border border-[#f0f0f0] shadow-sm",
        // Desktop
        "md:gap-[24px] md:px-[16px] md:py-[8px] md:rounded-[8px] md:border-[#e8e8e8] md:shadow-[0px_-1.41px_22.55px_0px_rgba(0,0,0,0.05),0px_31px_33.83px_0px_rgba(0,0,0,0.07)]",
        "TrustBanner shrink-0",
      )}
    >
      <div className="flex items-center gap-[6px] md:gap-[8px] shrink-0">
        <BadgeCheck className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-[#27C7FF]" />
        <span className="text-[12px] md:text-[14px] font-semibold text-black whitespace-nowrap font-[family-name:var(--font-poppins)]">
          {t.exclusive}
        </span>
      </div>

      <div className="h-[14px] md:h-full w-[1px] bg-[#e0e0e0] md:bg-[#d0d0d0]" />

      <div className="flex items-center gap-[6px] md:gap-[8px] shrink-0">
        <ShieldCheck className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-[#27C7FF]" />
        <span className="text-[12px] md:text-[14px] font-semibold text-black whitespace-nowrap font-[family-name:var(--font-poppins)]">
          {t.flexibleCancellation}
        </span>
      </div>

      <div className="hidden md:block h-full w-[1px] bg-[#d0d0d0]" />

      <div className="hidden md:flex items-center gap-[8px] shrink-0">
        <span className="text-[14px] font-extrabold text-black whitespace-nowrap">
          {t.excellent}
        </span>

        <div className="flex items-center gap-[2px]">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[18px] text-[#00b67a] leading-none">
              ★
            </span>
          ))}
          <HalfStar />
        </div>

        <span className="text-[14px] text-[#222] whitespace-nowrap">
          <span className="font-extrabold">{trustpilotReviewCount}</span>
          <span className="font-normal"> {t.reviewsOn}</span>
        </span>

        <span className="text-[14px] font-extrabold text-black whitespace-nowrap">
          Trustpilot
        </span>
      </div>
    </div>
  );
}
