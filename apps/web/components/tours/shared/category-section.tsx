"use client"

import { useMemo } from "react"
import Link from "next/link"
import { TourCard, TourData } from "./tour-card"

interface CategorySectionProps {
  title: string
  titleHighlight: string
  destination: string
  tours: TourData[]
  searchQuery: string
}

export function CategorySection({
  title,
  titleHighlight,
  destination,
  tours,
  searchQuery
}: CategorySectionProps) {
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        tour.title.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.duration.toLowerCase().includes(query)
      )
    })
  }, [tours, searchQuery])

  if (filteredTours.length === 0) {
    return null
  }

  return (
    <section className="bg-white transition-all duration-300 ease-out">
      <div className="flex gap-[16px] md:gap-[24px] items-center w-full mb-[24px]">
        <h2 className="text-[24px] md:text-[32px] font-bold leading-[1.3] text-[#222] shrink-0">
          <span className="font-extrabold italic">{title}</span>
          <span className="font-bold">{` ${titleHighlight}`}</span>
          <span className="text-[#27c7ff]">{` ${destination} `}</span>
        </h2>
        <div className="flex-1 h-[1px] bg-[#e0e0e0]" />
      </div>

      <div className="hidden md:grid grid-cols-3 gap-[24px]">
        {filteredTours.map((tour) => (
          <Link key={tour.id} href={`/tours/tour/${tour.id}`}>
            <TourCard tour={tour} variant="desktop" />
          </Link>
        ))}
      </div>

      <div className="md:hidden grid grid-cols-2 gap-[16px]">
        {filteredTours.map((tour) => (
          <Link key={tour.id} href={`/tours/tour/${tour.id}`}>
            <TourCard tour={tour} variant="mobile" />
          </Link>
        ))}
      </div>
    </section>
  )
}
