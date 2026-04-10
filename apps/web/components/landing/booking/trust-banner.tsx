"use client";

import { BadgeCheck, ShieldX, Star } from "lucide-react";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

interface TrustBannerProps {
  translations: {
    exclusive: string;
    flexibleCancellation: string;
    excellent: string;
    reviewsOn: string;
  };
}

export function TrustBanner({ translations: t }: TrustBannerProps) {
  const { trustpilotReviewCount } = useMarketingStats();

  return (
    <div
      data-theme-color="heroBookingBg"
      className="flex flex-col md:flex-row items-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-100 rounded-2xl md:rounded-full overflow-hidden w-full md:w-auto TrustBanner"
      style={{
        backgroundColor: "var(--theme-hero-booking-bg, #ffffff)",
        borderColor: "var(--theme-hero-booking-border, #f3f4f6)",
      }}
    >
      <div
        data-theme-color="heroBookingBorder"
        className="flex w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100"
        style={{ borderColor: "var(--theme-hero-booking-border, #f3f4f6)" }}
      >
        <div
          data-theme-color="heroBookingBorder"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 border-r md:border-r-0 border-gray-100"
          style={{ borderColor: "var(--theme-hero-booking-border, #f3f4f6)" }}
        >
          <BadgeCheck
            data-theme-color="heroBookingIcon"
            className="w-5 h-5"
            style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
          />
          <span
            data-theme-color="heroBookingText"
            className="font-bold text-xs md:text-base"
            style={{ color: "var(--theme-hero-booking-text, #1A1A1A)" }}
          >
            {t.exclusive}
          </span>
        </div>

        <div className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2">
          <ShieldX
            data-theme-color="heroBookingIcon"
            className="w-5 h-5"
            style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
          />
          <span
            data-theme-color="heroBookingText"
            className="font-bold text-xs md:text-base text-center leading-tight"
            style={{ color: "var(--theme-hero-booking-text, #1A1A1A)" }}
          >
            {t.flexibleCancellation}
          </span>
        </div>
      </div>

      <div
        data-theme-color="heroBookingInputHoverBg"
        className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 w-full md:w-auto"
        style={{
          backgroundColor:
            "var(--theme-hero-booking-input-hover-bg, rgba(0,0,0,0.02))",
        }}
      >
        <span
          data-theme-color="heroBookingText"
          className="font-bold"
          style={{ color: "var(--theme-hero-booking-text, #1A1A1A)" }}
        >
          {t.excellent}
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-1">
              <Star
                data-theme-color="heroTrustStarColor"
                className="size-3 Star"
                style={{
                  fill: "var(--theme-hero-trust-star-color, #00B67A)",
                  color: "var(--theme-hero-trust-star-color, #00B67A)",
                }}
              />
            </div>
          ))}
        </div>
        <span
          data-theme-color="heroBookingText"
          className="text-xs md:text-sm"
          style={{ color: "var(--theme-hero-booking-text, #4B5563)" }}
        >
          <span
            data-theme-color="heroBookingText"
            className="font-bold"
            style={{ color: "var(--theme-hero-booking-text, #1A1A1A)" }}
          >
            {trustpilotReviewCount}
          </span>{" "}
          {t.reviewsOn}{" "}
          <span
            data-theme-color="heroBookingText"
            className="font-bold"
            style={{ color: "var(--theme-hero-booking-text, #1A1A1A)" }}
          >
            Trustpilot
          </span>
        </span>
      </div>
    </div>
  );
}
