"use client"

import { RatingStars } from "@/components/shared/rating-stars"

interface TourDetailsHeaderProps {
  title: string
  rating: number
  tags: string[]
}

function Tag({ label }: { label: string }) {
  return (
    <div className="bg-[#e9f9ff] rounded-[5px] px-6 py-[10px] flex items-center justify-center h-[36px] whitespace-nowrap">
      <span className="text-[#0e4659] text-[12px] lg:text-[14px] font-medium leading-[15px]">
        {label}
      </span>
    </div>
  )
}

export function TourDetailsHeader({ title, rating, tags }: TourDetailsHeaderProps) {
  return (
    <div className="pt-[28px] md:pt-[50px] pb-[17px]">
      <h1 className="text-[24px] lg:text-[28px] font-bold text-[#070d0f] leading-[1.3] mb-4 lg:mb-[31px] break-words">
        {title}
      </h1>

      <div className="hidden lg:flex items-center gap-6">
        <RatingStars rating={rating} />
        <div className="flex flex-wrap gap-4">
          {tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        <RatingStars rating={rating} />
        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-3 w-max">
            {tags.map((tag, index) => (
              <div key={index} className="snap-start" style={{ scrollSnapStop: 'always' }}>
                <Tag label={tag} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
