"use client";

import { useState, useEffect } from "react";
import { useSwipe } from "@/hooks/use-swipe";
import { User, Flame } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BookingWidget } from "./booking-widget";
import { HeroBadge } from "./hero-badge";
import { TrustedBy } from "./trusted-by";
import { TypewriterText } from "@/components/ui/typewriter-effect";
import { getDailyNumber } from "@/lib/daily-number";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

const carouselImages = [
  { src: "/hero-carousel/transfers.png", alt: "Transfer service" },
  { src: "/hero-carousel/wedding.png", alt: "Wedding service" },
  { src: "/hero-carousel/corporative.png", alt: "Corporate service" },
  { src: "/hero-carousel/school.png", alt: "School service" },
];

export function Hero() {
  const t = useTranslations("hero");
  const { heroDailyTravelersMin, heroDailyTravelersMax } = useMarketingStats();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dailyTravelers, setDailyTravelers] = useState<number | null>(null);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
    );
  const heroSwipe = useSwipe(nextImage, prevImage);

  useEffect(() => {
    const updateDailyTravelers = () => {
      setDailyTravelers(
        getDailyNumber("hero", heroDailyTravelersMin, heroDailyTravelersMax),
      );
    };

    updateDailyTravelers();

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    const hourlyInterval = setInterval(() => {
      updateDailyTravelers();
    }, 3600000);

    return () => {
      clearInterval(interval);
      clearInterval(hourlyInterval);
    };
  }, [heroDailyTravelersMin, heroDailyTravelersMax]);

  return (
    <section className="relative bg-white min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-65px)] flex items-center justify-center px-4 md:px-8 lg:px-[60px] xl:px-[100px] pt-[70px] md:pt-[65px]">
      <div className="max-w-[1440px] mx-auto w-full min-w-0 flex flex-col items-center gap-[20px] md:gap-[24px] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-[32px] lg:gap-[48px] xl:gap-[64px] w-full">
          <div
            className="relative w-full lg:w-[380px] xl:w-[450px] h-[280px] lg:h-[380px] xl:h-[460px] shrink-0 order-1 lg:order-2 touch-pan-y"
            {...heroSwipe}
          >
            {carouselImages.map((image, index) => (
              <div
                key={image.src}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  zIndex: currentImageIndex === index ? 1 : 0,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center lg:items-start justify-center gap-[12px] md:gap-[20px] order-2 lg:order-1 text-center lg:text-left max-w-[600px]">
            <h1 className="leading-[1.1] tracking-[0.48px] text-[#222] font-sans">
              <span className="font-extrabold text-[28px] md:text-[40px] xl:text-[48px]">
                Easy Transfer,
              </span>
              <br />
              <span className="font-semibold text-[18px] md:text-[26px] xl:text-[30px]">
                {t("title1")}
              </span>
              <br />
              <span className="font-semibold text-[18px] md:text-[26px] xl:text-[30px] text-[#27c7ff] inline-block min-h-[1.2em]">
                <TypewriterText
                  text={t("title2")}
                  delay={50}
                  startDelay={500}
                />
              </span>
            </h1>

            <div className="flex flex-wrap gap-[10px] md:gap-[14px] items-center justify-center lg:justify-start mt-5 mb-5 md:mt-0 md:mb-0">
              <HeroBadge icon="shield" text={t("badgeSecure")} />
              <HeroBadge icon="driver" text={t("badgeProfessionalDrivers")} />
            </div>

            <p className="text-[14px] md:text-[18px] xl:text-[20px] font-normal leading-[1.3] tracking-[-0.4px] text-[#222] max-w-[600px]">
              {(() => {
                const subtitle = t("subtitle");
                const commaIndex = subtitle.indexOf(",");
                if (commaIndex === -1) return subtitle;
                const firstPart = subtitle.substring(0, commaIndex + 1);
                const secondPart = subtitle.substring(commaIndex + 1).trim();
                return (
                  <>
                    {firstPart}{" "}
                    <span className="font-semibold">{secondPart}</span>
                  </>
                );
              })()}
            </p>
          </div>
        </div>

        <div
          id="booking"
          className="w-full scroll-mt-24 mt-5 mb-5 md:mt-0 md:mb-0"
        >
          <BookingWidget />
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="bg-[#f7f7f7] p-[12px] md:p-[16px] rounded-full shrink-0">
            <User className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#808080]" />
          </div>
          <p className="text-[14px] md:text-[16px] font-normal tracking-[0.16px] text-[#808080]">
            {dailyTravelers ?? 120}{" "}
            <span className="font-bold"> {t("travelers")}</span>{" "}
            {t("bookedRide")} <span className="font-bold">{t("today")}</span>
          </p>
          <Flame className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#F97316] fill-[#F97316]" />
        </div>

        <TrustedBy />
      </div>
    </section>
  );
}
