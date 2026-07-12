"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"
import { useMoney } from "@/components/currency-provider"

export interface AddonItem {
  _id: string
  title: string
  description?: string
  imageUrl?: string | null
  price: number
  pricingType: "per_person" | "flat"
  currency: string
}

interface AddonCarouselSectionProps {
  addons: AddonItem[]
}

export function AddonCarouselSection({ addons }: AddonCarouselSectionProps) {
  const t = useTranslations("tourDetails")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
        setVisibleCards(3)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxSlide = Math.max(0, Math.ceil(addons.length / visibleCards) - 1)
  const showNavigation = addons.length > visibleCards

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide))
  }, [maxSlide])

  const addonSwipe = useSwipe(handleNext, handlePrev)

  const { format } = useMoney()

  if (addons.length === 0) return null

  const slideOffset = currentSlide * visibleCards
  const visibleAddons = addons.slice(slideOffset, slideOffset + visibleCards)

  return (
    <div className="border-t border-[#dedede] mt-10 pt-10 touch-pan-y" {...addonSwipe}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] md:text-[24px] font-bold text-[#0c171c]">
          {t("addOns")}
        </h2>
        {showNavigation && (
          <div className="flex items-center gap-[8.842px]">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={cn(
                "size-[32px] rounded-full flex items-center justify-center transition-colors",
                currentSlide === 0
                  ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                  : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
              )}
            >
              <ChevronLeft className="size-[15px] text-[#222222]" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide >= maxSlide}
              className={cn(
                "size-[32px] rounded-full flex items-center justify-center transition-colors",
                currentSlide >= maxSlide
                  ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                  : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
              )}
            >
              <ChevronRight className="size-[15px] text-[#222222]" />
            </button>
          </div>
        )}
      </div>

      <div className={cn(
        "grid gap-6",
        visibleCards === 1 && "grid-cols-1",
        visibleCards === 2 && "grid-cols-2",
        visibleCards === 3 && "grid-cols-3",
      )}>
        {visibleAddons.map((addon) => (
          <div key={addon._id}>
            <div className="border border-[rgba(122,122,122,0.12)] rounded-lg overflow-hidden">
              {addon.imageUrl ? (
                <div className="relative aspect-[183/120] w-full overflow-hidden bg-white">
                  <Image
                    src={addon.imageUrl}
                    alt={addon.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-[183/120] w-full bg-[#e8eaed]" />
              )}

              <div className="bg-white px-4 py-3 flex flex-col gap-[7px]">
                <h3 className="font-bold text-[#0c171c] text-[16px] leading-[1.2]">
                  {addon.title}
                </h3>
                <div className="flex items-center">
                  <span className="font-bold text-[#0c171c] text-[16px] leading-[1.2]">
                    {format(addon.price)}/
                  </span>
                  {addon.pricingType === "per_person" && (
                    <span className="text-[12.8px] text-[#54595f] ml-0.5">
                      {t("perPerson")}
                    </span>
                  )}
                </div>
                {addon.description && (
                  <p className="text-[14px] text-[#7a7a7a] leading-[1.2] line-clamp-2">
                    {addon.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNavigation && (
        <div className="flex justify-center gap-[6.183px] mt-4">
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "rounded-full transition-all",
                index === currentSlide
                  ? "size-[13.85px] border-[1.237px] border-[#27c7ff] bg-transparent"
                  : "size-[9.893px] bg-[#27c7ff]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
