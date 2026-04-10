"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"

const fallbackServices = [
  {
    id: "luxury-travel",
    titleKey: "luxuryTravel",
    image: "/mockup-services/1.png",
    href: "/#booking",
  },
  {
    id: "tailor-made",
    titleKey: "tailorMade",
    image: "/mockup-services/2.png",
    href: "/tours",
  },
  {
    id: "transfers",
    titleKey: "transfers",
    image: "/mockup-services/3.png",
    href: "/#booking",
  },
]

interface ServiceCardProps {
  title: string
  image: string
  href: string
  isMobile?: boolean
  className?: string
}

function ServiceCard({ title, image, href, isMobile, className }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden rounded-[16px] cursor-pointer group block",
        isMobile ? "h-[320px]" : "h-[540px]",
        className
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={isMobile ? "50vw" : "33vw"}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[165px] bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-[24px] left-[16px] flex gap-[16px] items-center">
        <span
          className={cn(
            "font-bold text-white leading-[1.2] whitespace-pre-line",
            isMobile ? "text-[24px]" : "text-[32px]"
          )}
        >
          {title}
        </span>
        <div className="size-[28px] bg-white rounded-full flex items-center justify-center group-hover:bg-[#27c7ff] transition-colors">
          <ArrowRight className="size-[18px] text-[#222222] group-hover:text-white transition-colors" />
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

export function ServicesSection() {
  const t = useTranslations("services")
  const serviceBlogs = useQuery(api.blogs.listServices)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  const useFallback = !serviceBlogs || serviceBlogs.length === 0
  const services = useFallback
    ? fallbackServices.map((s) => ({
        id: s.id,
        title: t(s.titleKey),
        image: s.image,
        href: s.href,
      }))
    : serviceBlogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        image: blog.heroImageUrl ?? "/mockup-services/1.png",
        href: `/blogs/${blog.slug}`,
      }))

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(2)
      } else {
        setVisibleCards(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxSlide = Math.max(0, services.length - visibleCards)
  const showNavigation = services.length > visibleCards

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide))
  }, [maxSlide])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide))
  }

  const servicesSwipe = useSwipe(nextSlide, prevSlide)

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[60px] pb-[24px] md:pb-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[24px]">
        <h2 className="text-[24px] md:text-[32px] font-bold leading-[1.3] text-[#070d0f]">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-[24px] items-center">
          <div className="hidden md:flex gap-[24px] w-full">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                image={service.image}
                href={service.href}
                className="flex-1"
              />
            ))}
          </div>

          <div className="md:hidden w-full overflow-hidden touch-pan-y" {...servicesSwipe}>
            <div
              className="flex gap-[16px] transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(-${currentSlide} * (50% + 8px)))`,
              }}
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  image={service.image}
                  href={service.href}
                  isMobile
                  className="w-[calc(50%-8px)] shrink-0"
                />
              ))}
            </div>
          </div>

          {showNavigation && (
            <div className="flex gap-[16px] items-center justify-center">
              <ArrowButton
                direction="left"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              />

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

              <ArrowButton
                direction="right"
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
