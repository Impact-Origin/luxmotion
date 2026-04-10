"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useFeaturedBlogs } from "@/hooks/use-blog-data"

function formatBlogDate(timestamp: number | undefined, locale: string): string {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

interface GuideCardProps {
  date: string
  title: string
  image: string
  href: string
  continueReading: string
  isMobile?: boolean
  className?: string
}

function GuideCard({ date, title, image, href, continueReading, isMobile, className }: GuideCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden rounded-[16px] cursor-pointer group h-[312px] block",
        className
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={isMobile ? "100vw" : "50vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-[24px] flex flex-col gap-[16px]">
        <span
          className={cn(
            "text-white leading-[1.2]",
            isMobile ? "text-[14px]" : "text-[16px]"
          )}
        >
          {date}
        </span>
        <span
          className={cn(
            "font-bold text-white leading-[1.2] line-clamp-2",
            isMobile ? "text-[18px]" : "text-[24px]"
          )}
        >
          {title}
        </span>
        <div className="flex gap-[16px] items-center">
          <span className="text-[16px] font-medium text-white leading-[1.2]">
            {continueReading}
          </span>
          <div className="size-[28px] bg-white rounded-full flex items-center justify-center group-hover:bg-[#27c7ff] transition-colors">
            <ArrowRight className="size-[18px] text-[#222222] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface ArrowButtonProps {
  direction: "left" | "right"
  onClick: () => void
  disabled?: boolean
}

function ArrowButton({ direction, onClick, disabled }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-[32px] rounded-full flex items-center justify-center transition-colors",
        disabled
          ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
          : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-[15px] text-[#222222]" />
      ) : (
        <ChevronRight className="size-[15px] text-[#222222]" />
      )}
    </button>
  )
}

export function GuidesSection() {
  const t = useTranslations("guides")
  const locale = useLocale()
  const { blogs, isLoading } = useFeaturedBlogs()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCards, setVisibleCards] = useState(2)

  const guides = useMemo(() => {
    return blogs.slice(0, 4).map((blog) => ({
      id: blog._id,
      slug: blog.slug,
      date: formatBlogDate(blog.publishedAt || blog.createdAt, locale),
      title: blog.title,
      image: blog.heroImageUrl || "/mockup-guides/1.jpg",
    }))
  }, [blogs, locale])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1)
      } else {
        setVisibleCards(2)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxSlide = Math.max(0, guides.length - visibleCards)
  const showNavigation = guides.length > visibleCards

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide))
  }, [maxSlide])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide))
  }

  if (isLoading) {
    return (
      <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[32px] md:pt-0 pb-[24px] md:pb-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-[24px]">
          <div className="h-[32px] w-[200px] bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-[24px]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex-1 h-[312px] bg-gray-200 rounded-[16px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (guides.length === 0) {
    return null
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[32px] md:pt-0 pb-[24px] md:pb-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[24px]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[24px] md:text-[32px] font-extrabold italic leading-[1.3] text-[#222222]">
              {t("title")}
            </h2>
            <p className="text-[16px] md:text-[24px] leading-[1.3] text-[#1d95bf]">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex gap-[8.842px] items-center shrink-0">
            <ArrowButton
              direction="left"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            />
            <ArrowButton
              direction="right"
              onClick={nextSlide}
              disabled={currentSlide >= maxSlide}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[24px] items-center">
          <div className="hidden md:flex gap-[24px] w-full">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                date={guide.date}
                title={guide.title}
                image={guide.image}
                href={`/blogs/${guide.slug}`}
                continueReading={t("continueReading")}
                className="flex-1"
              />
            ))}
          </div>

          <div className="md:hidden w-full overflow-hidden">
            <div
              className="flex gap-[16px] transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(-${currentSlide} * (100% + 16px)))`,
              }}
            >
              {guides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  date={guide.date}
                  title={guide.title}
                  image={guide.image}
                  href={`/blogs/${guide.slug}`}
                  continueReading={t("continueReading")}
                  isMobile
                  className="w-full shrink-0"
                />
              ))}
            </div>
          </div>

          {showNavigation && (
            <div className="flex gap-[6.183px] items-center">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "rounded-full transition-all",
                    index === currentSlide
                      ? "size-[13.85px] border-[1.237px] border-[#27c7ff] bg-transparent"
                      : "size-[9.893px] bg-[#27c7ff]"
                  )}
                  aria-label={t("goToSlide", { number: index + 1 })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
