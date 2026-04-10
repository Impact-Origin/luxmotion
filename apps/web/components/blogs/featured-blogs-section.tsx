"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { LanguageBadge } from "./language-badge"
import { FeaturedBlogsSkeleton } from "./blog-skeletons"

interface BlogPost {
  _id?: string
  id?: string
  slug: string
  heroImageUrl?: string | null
  image?: string
  category?: string
  location?: string
  title: string
  publishedAt?: number
  date?: string
  excerpt?: string
  description?: string
  originalLanguage?: string
  availableLanguages?: string[]
}

const defaultFeaturedBlogs: BlogPost[] = [
  {
    id: "lisbon-airport-transfer",
    slug: "lisbon-airport-transfer-guide",
    image: "/mockup-blogs/lisbon-city-center.jpg",
    location: "Lisbon",
    title: "Airport to Lisbon City Center: Complete Transfer Guide 2024",
    date: "11 dezembro, 2025",
    description: "Everything you need to know about getting from Lisbon Airport to your hotel, with options for every budget.",
  },
  {
    id: "porto-wine-tour",
    slug: "porto-wine-tour-guide",
    image: "/mockup-blogs/lisbon-city-center.jpg",
    location: "Porto",
    title: "Porto Wine Tour: The Ultimate Guide to Douro Valley",
    date: "8 dezembro, 2025",
    description: "Discover the best wineries and tasting experiences in the stunning Douro Valley region.",
  },
  {
    id: "sintra-day-trip",
    slug: "sintra-day-trip-guide",
    image: "/mockup-blogs/lisbon-city-center.jpg",
    location: "Sintra",
    title: "Sintra Day Trip: Palaces, Gardens & Hidden Gems",
    date: "5 dezembro, 2025",
    description: "Plan the perfect day trip to Sintra with our comprehensive guide to this magical UNESCO town.",
  },
]

function formatDate(timestamp?: number): string {
  if (!timestamp) return ""
  return new Date(timestamp).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

interface LocationBadgeProps {
  location: string
}

function LocationBadge({ location }: LocationBadgeProps) {
  return (
    <div className="bg-white rounded-full px-[10px] py-[4px]">
      <span className="text-[14px] font-medium text-[#0e4659]">{location}</span>
    </div>
  )
}

interface BlogCardProps {
  blog: BlogPost
  isActive: boolean
}

function BlogCard({ blog, isActive }: BlogCardProps) {
  const t = useTranslations("featuredBlogs")
  const router = useRouter()

  const imageUrl = blog.heroImageUrl || blog.image || "/mockup-blogs/lisbon-city-center.jpg"
  const location = blog.category || blog.location || "Portugal"
  const date = blog.publishedAt ? formatDate(blog.publishedAt) : blog.date || ""
  const description = blog.excerpt || blog.description || ""
  const blogUrl = `/blogs/${blog.slug}`

  const handleCardClick = () => {
    router.push(blogUrl)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: description,
          url: blogUrl,
        })
      } catch {
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${blogUrl}`)
    }
  }

  return (
    <div
      className={cn(
        "w-full transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0 absolute pointer-events-none"
      )}
    >
      <div
        onClick={handleCardClick}
        className="hidden md:flex h-[562px] rounded-[16px] border border-[#e8e8e8] overflow-hidden cursor-pointer"
      >
        <div className="relative w-[70%] h-full">
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="60vw"
          />
          <div className="absolute top-[16px] left-[16px] flex gap-2">
            <LocationBadge location={location} />
            {blog.originalLanguage && (
              <div className="bg-white/90 rounded-full px-[10px] py-[4px] flex items-center justify-center h-[32px]">
                <LanguageBadge
                  originalLanguage={blog.originalLanguage}
                  availableLanguages={blog.availableLanguages}
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-[30%] bg-[#27c7ff] p-[24px] flex flex-col h-full">
          <div className="flex flex-col gap-[6px] flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-[32px] font-bold text-[#222] leading-[1.2] flex-1">
                {blog.title}
              </h3>
              <button
                onClick={handleShare}
                className="shrink-0 hover:opacity-70 transition-opacity ml-[8px]"
                aria-label={t("share")}
              >
                <Share2 className="size-[20px] text-[#0e4659]" />
              </button>
            </div>

            <p className="text-[12px] font-medium text-[#0e4659]">
              {date}
            </p>

            <p className="text-[16px] text-[#0e4659] leading-[1.3]">
              {description}
            </p>

            <div className="flex items-end justify-between flex-1 mt-auto">
              <span className="text-[16px] font-bold text-[#0e4659] tracking-[-0.2px] hover:underline">
                {t("readMore")}
              </span>
              <span className="size-[28px] bg-white rounded-full flex items-center justify-center">
                <ArrowRight className="size-[18px] text-[#222]" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={handleCardClick}
        className="md:hidden flex flex-col rounded-[16px] overflow-hidden cursor-pointer"
      >
        <div className="relative w-full h-[340px]">
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute top-[16px] left-[16px] flex gap-2">
            <LocationBadge location={location} />
            {blog.originalLanguage && (
              <div className="bg-white/90 rounded-full px-[10px] py-[4px] flex items-center justify-center h-[32px]">
                <LanguageBadge
                  originalLanguage={blog.originalLanguage}
                  availableLanguages={blog.availableLanguages}
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#27c7ff] pt-[24px] px-[24px] pb-[16px] flex flex-col gap-[16px]">
          <div className="flex items-start justify-between">
            <h3 className="text-[24px] font-bold text-[#222] leading-[1.2] pr-[16px]">
              {blog.title}
            </h3>
            <button
              onClick={handleShare}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label={t("share")}
            >
              <Share2 className="size-[28px] text-[#808080]" />
            </button>
          </div>

          <p className="text-[14px] font-medium text-[#27c7ff] brightness-75">
            {date}
          </p>

          <p className="text-[15px] text-[#222]/80 leading-[1.5]">
            {description}
          </p>

          <div className="flex items-center justify-between mt-[24px]">
            <span className="text-[20px] font-semibold text-[#222] hover:underline">
              {t("readMore")}
            </span>
            <span className="size-[40px] bg-white rounded-full flex items-center justify-center">
              <ArrowRight className="size-[20px] text-[#222]" />
            </span>
          </div>
        </div>
      </div>
    </div>
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

interface NavigationProps {
  total: number
  current: number
  onSelect: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

function Navigation({ total, current, onSelect, onPrev, onNext }: NavigationProps) {
  const t = useTranslations("featuredBlogs")

  return (
    <div className="flex gap-[16px] items-center justify-center">
      <ArrowButton
        direction="left"
        onClick={onPrev}
        disabled={current === 0}
      />

      <div className="flex gap-[6.183px] items-center">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={cn(
              "rounded-full transition-all",
              index === current
                ? "size-[13.85px] border-[1.237px] border-[#27c7ff] bg-transparent"
                : "size-[9.893px] bg-[#27c7ff]"
            )}
            aria-label={t("goToSlide", { number: index + 1 })}
          />
        ))}
      </div>

      <ArrowButton
        direction="right"
        onClick={onNext}
        disabled={current === total - 1}
      />
    </div>
  )
}

interface FeaturedBlogsSectionProps {
  blogs?: BlogPost[]
  isLoading?: boolean
}

export function FeaturedBlogsSection({ blogs, isLoading }: FeaturedBlogsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const displayBlogs = blogs && blogs.length > 0 ? blogs : defaultFeaturedBlogs
  const totalSlides = displayBlogs.length

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  if (isLoading) {
    return <FeaturedBlogsSkeleton />
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 py-[40px] md:py-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[8px]">
        <div className="relative min-h-[620px] md:min-h-[562px]">
          {displayBlogs.map((blog, index) => (
            <BlogCard key={blog._id || blog.id} blog={blog} isActive={index === currentSlide} />
          ))}
        </div>

        <Navigation
          total={totalSlides}
          current={currentSlide}
          onSelect={goToSlide}
          onPrev={prevSlide}
          onNext={nextSlide}
        />
      </div>
    </section>
  )
}
