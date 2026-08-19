"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface RelatedBlog {
  id: string
  slug: string
  image: string
  category: string
  title: string
  date: string
  description: string
}

interface RelatedBlogsSectionProps {
  blogs: RelatedBlog[]
  title?: {
    part1: string
    part2: string
  }
}

interface BlogCardProps {
  blog: RelatedBlog
}

function BlogCard({ blog }: BlogCardProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: `/blogs/${blog.slug}`,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-[16px] border border-[#e5e5e5] overflow-hidden flex-1">
      <div className="relative w-full h-[200px] xl:h-[220px] shrink-0">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 50vw"
        />
        <div className="absolute top-[16px] left-[16px]">
          <div className="bg-[#27c7ff] rounded-[80px] px-[16px] py-[4px] h-[32px] flex items-center">
            <span className="text-[14px] font-medium text-white leading-none">
              {blog.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-[8px] p-[16px] xl:p-[20px]">
        <div className="flex items-start justify-between gap-[12px]">
          <h3 className="text-[18px] xl:text-[20px] font-bold text-[#222222] leading-[1.3]">
            {blog.title}
          </h3>
          <button
            onClick={handleShare}
            className="shrink-0 hover:opacity-70 transition-opacity mt-[4px]"
            aria-label="Share"
          >
            <Share2 className="size-[18px] text-[#c4c4c4]" />
          </button>
        </div>

        <p className="text-[14px] font-medium text-[#27c7ff]">
          {blog.date}
        </p>

        <p className="text-[15px] text-[#0e4659] leading-[1.6]">
          {blog.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-[12px]">
          <Link
            href={`/blogs/${blog.slug}`}
            className="text-[15px] font-semibold text-[#27c7ff] hover:underline"
          >
            Read more
          </Link>
          <Link
            href={`/blogs/${blog.slug}`}
            className="size-[40px] bg-[#27c7ff] rounded-full flex items-center justify-center hover:brightness-95 transition-all"
          >
            <ArrowRight className="size-[20px] text-white" />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ArrowButtonProps {
  direction: "left" | "right"
  onClick: () => void
}

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-[32px] rounded-full bg-[#ebebeb] hover:bg-[#d5d5d5] flex items-center justify-center transition-colors"
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

interface DotsNavigationProps {
  total: number
  current: number
  onSelect: (index: number) => void
}

function DotsNavigation({ total, current, onSelect }: DotsNavigationProps) {
  return (
    <div className="flex gap-[6px] items-center justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "rounded-full transition-all",
            index === current
              ? "size-[14px] border-[1.5px] border-[#27c7ff] bg-transparent"
              : "size-[10px] bg-[#27c7ff]"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

export function RelatedBlogsSection({
  blogs,
  title = { part1: "These might", part2: "interest you" },
}: RelatedBlogsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const desktopItemsPerSlide = 2
  const mobileItemsPerSlide = 1

  const desktopTotalSlides = Math.ceil(blogs.length / desktopItemsPerSlide)
  const mobileTotalSlides = blogs.length

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const nextSlide = useCallback((totalSlides: number) => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [])

  const prevSlide = useCallback((totalSlides: number) => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [])

  const getDesktopVisibleBlogs = () => {
    const startIndex = currentSlide * desktopItemsPerSlide
    return blogs.slice(startIndex, startIndex + desktopItemsPerSlide)
  }

  const getMobileVisibleBlog = () => {
    return blogs[currentSlide]
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pb-[32px] xl:pb-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[32px] leading-[1.3]">
            <span className="font-bold italic text-[#222222]">{title.part1}</span>
            {" "}
            <span className="font-bold text-[#27c7ff]">{title.part2}</span>
          </h2>

          <div className="flex gap-[9px] items-center">
            <div className="hidden xl:block">
              <ArrowButton
                direction="left"
                onClick={() => prevSlide(desktopTotalSlides)}
              />
            </div>
            <div className="xl:hidden">
              <ArrowButton
                direction="left"
                onClick={() => prevSlide(mobileTotalSlides)}
              />
            </div>
            <div className="hidden xl:block">
              <ArrowButton
                direction="right"
                onClick={() => nextSlide(desktopTotalSlides)}
              />
            </div>
            <div className="xl:hidden">
              <ArrowButton
                direction="right"
                onClick={() => nextSlide(mobileTotalSlides)}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex gap-[32px]">
          {getDesktopVisibleBlogs().map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="xl:hidden">
          {(() => {
            const mobileBlog = getMobileVisibleBlog()
            return mobileBlog ? <BlogCard blog={mobileBlog} /> : null
          })()}
        </div>

        <div className="hidden xl:block">
          <DotsNavigation
            total={desktopTotalSlides}
            current={currentSlide}
            onSelect={goToSlide}
          />
        </div>
        <div className="xl:hidden">
          <DotsNavigation
            total={mobileTotalSlides}
            current={currentSlide}
            onSelect={goToSlide}
          />
        </div>
      </div>
    </section>
  )
}
