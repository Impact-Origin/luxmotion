"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  className?: string
}

export function RatingStars({ rating, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const fraction = rating - fullStars

  return (
    <div className={className ?? "flex items-center gap-1 h-[36px] pr-6 border-r border-r-[rgba(255,255,255,0.22)] lg:border-r-[0.889px]"}>
      <span className="font-bold text-[16px] text-[#070d0f] mr-1">{rating.toFixed(1)}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < fullStars
          const isPartial = i === fullStars && fraction > 0
          const isEmpty = i > fullStars || (i === fullStars && fraction === 0)

          return (
            <div
              key={i}
              className="size-6 rounded-[5px] flex items-center justify-center"
              style={{
                background: isFull
                  ? "#33be8b"
                  : isPartial
                    ? `linear-gradient(to right, #33be8b ${fraction * 100}%, #d1d5db ${fraction * 100}%)`
                    : "#d1d5db",
              }}
            >
              <Star
                className="size-3 text-white fill-white"
                strokeWidth={0}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
