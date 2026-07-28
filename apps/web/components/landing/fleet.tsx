"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, Leaf, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Themed } from "@/components/themed"
import { cn } from "@workspace/ui/lib/utils"
import { FleetMobileCarousel } from "./fleet-mobile-carousel"

const STEP = 1
const VISIBLE = 3
const AUTO_SCROLL_INTERVAL = 4500
const IDLE_TIMEOUT = 10000
const FRAME_ASPECT = "16/6"
const CARD_GAP_PX = 16

export function Fleet() {
  const t = useTranslations("fleet")
  /** Posição contínua em px (0 até maxTranslatePx). Sem snap: fica onde o utilizador largar. */
  const [translatePx, setTranslatePx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [slideWidthPx, setSlideWidthPx] = useState(0)
  const lastInteractionRef = useRef(0)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  /** Durante o drag: valor em px (sem transition). Quando null, usa translatePx. */
  const [dragTranslatePx, setDragTranslatePx] = useState<number | null>(null)
  const dragStartRef = useRef<{ startX: number; startTranslatePx: number } | null>(null)
  const dragCurrentPxRef = useRef<number>(0)

  const vehicles = [
    {
      name: t("vehicleNames.standard"),
      capacity: `4 ${t("people")}`,
      image: "/standard-car.png",
    },
    {
      name: t("vehicleNames.xl"),
      capacity: `5 ${t("people")}`,
      image: "/xl-car.png",
    },
    {
      name: t("vehicleNames.executivo"),
      capacity: `4 ${t("people")}`,
      image: "/executivo-car.png",
    },
    {
      name: t("vehicleNames.van"),
      capacity: `8 ${t("people")}`,
      image: "/van.png",
      badge: t("electric"),
    },
    {
      name: t("vehicleNames.minibus"),
      capacity: `16 ${t("people")}`,
      image: "/minibus.png",
    },
    {
      name: t("vehicleNames.bus"),
      capacity: `56 ${t("people")}`,
      image: "/bus.png",
    },
  ]

  const carouselImages = [
    "/mercedes frota/C.webp",
    "/mercedes frota/Maybach.webp",
    "/mercedes frota/Van.webp",
    "/mercedes frota/c class.webp",
    "/mercedes frota/class E.webp",
    "/mercedes frota/eqe.webp",
    "/mercedes frota/eqs.webp",
    "/mercedes frota/minbus.webp",
    "/mercedes frota/mini bus 8.webp",
    "/mercedes frota/s class.webp",
    "/mercedes frota/van executiva.webp",
  ]

  const totalItems = carouselImages.length
  const maxOffset = Math.max(0, totalItems - VISIBLE)
  const stepPx = slideWidthPx + CARD_GAP_PX
  const maxTranslatePx = maxOffset * stepPx

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const gapTotal = (VISIBLE - 1) * CARD_GAP_PX
      setSlideWidthPx((w - gapTotal) / VISIBLE)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (stepPx <= 0) return
    setTranslatePx((prev) => Math.max(0, Math.min(maxTranslatePx, prev)))
  }, [maxTranslatePx, stepPx])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now()
  }, [])

  const desktopNext = useCallback((step = STEP) => {
    setTranslatePx((prev) => {
      const next = prev + step * stepPx
      return next > maxTranslatePx ? 0 : next
    })
  }, [maxTranslatePx, stepPx])

  const desktopPrev = useCallback(() => {
    setTranslatePx((prev) => {
      const next = prev - stepPx
      return next < 0 ? maxTranslatePx : next
    })
  }, [maxTranslatePx, stepPx])

  const handleDesktopNext = useCallback(() => {
    markInteraction()
    desktopNext()
  }, [markInteraction, desktopNext])

  const handleDesktopPrev = useCallback(() => {
    markInteraction()
    desktopPrev()
  }, [markInteraction, desktopPrev])

  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      const elapsed = Date.now() - lastInteractionRef.current
      if (elapsed < IDLE_TIMEOUT) return
      if (!isMobile) desktopNext(1)
    }, AUTO_SCROLL_INTERVAL)

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [isMobile, desktopNext])

  const totalDots = Math.ceil(totalItems / VISIBLE)
  const currentTranslatePx = dragTranslatePx !== null ? dragTranslatePx : translatePx
  const currentDot =
    stepPx > 0 ? Math.min(totalDots - 1, Math.max(0, Math.round(translatePx / stepPx))) : 0

  const goToPage = (pageIndex: number) => {
    markInteraction()
    setTranslatePx(Math.min(pageIndex * stepPx, maxTranslatePx))
  }

  const onDesktopCarouselPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (slideWidthPx <= 0) return
      markInteraction()
      const startPx = translatePx
      dragStartRef.current = { startX: e.clientX, startTranslatePx: startPx }
      dragCurrentPxRef.current = startPx
      setDragTranslatePx(startPx)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [slideWidthPx, translatePx, markInteraction]
  )

  const onDesktopCarouselPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current) return
      const dx = dragStartRef.current.startX - e.clientX
      const next = Math.max(0, Math.min(maxTranslatePx, dragStartRef.current.startTranslatePx + dx))
      dragCurrentPxRef.current = next
      setDragTranslatePx(next)
    },
    [maxTranslatePx]
  )

  const onDesktopCarouselPointerUp = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    if (!dragStartRef.current) return
    const currentPx = dragCurrentPxRef.current
    setTranslatePx(currentPx)
    setDragTranslatePx(null)
    dragStartRef.current = null
  }, [])

  return (
    <section
      id="fleet"
      data-theme-color="background"
      className="py-[40px] md:py-[64px] px-4 md:px-12 lg:px-[60px] xl:px-[100px] overflow-visible"
      style={{ backgroundColor: "var(--theme-background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto overflow-visible">
        <Themed as="h2" colorType="fleetSectionTitle" data-theme-color="fleetSectionTitle" className="text-[28px] md:text-[36px] font-bold text-center mb-8 md:mb-12" style={{ color: "var(--theme-fleet-section-title, #222222)" }}>
          {t("title")}
        </Themed>

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-6 md:gap-8 mb-8 md:mb-12">
          {vehicles.map((vehicle) => (
            <Themed key={vehicle.name} colorType="fleetVehicleCardBg" data-theme-color="fleetVehicleCardBg" applyTo="backgroundColor" className="relative rounded-lg p-2 md:p-4 flex flex-col transition-all cursor-pointer hover:scale-[1.05] flex-1 min-w-0" style={{ backgroundColor: "var(--theme-fleet-vehicle-card-bg, #ffffff)", boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}>
              <div className="items-center">
                {vehicle.badge && (
                  <Themed colorType="electricBadgeBg" data-theme-color="electricBadgeBg" applyTo="backgroundColor" className="absolute top-1 right-1 md:top-2 md:right-2 px-1 md:px-1.5 py-0.5 rounded-full text-[10px] md:text-xs flex items-center gap-0.5 md:gap-1 shadow-sm z-10 electric-badge" style={{ backgroundColor: "var(--theme-electric-badge-bg, #ABEDD5)" }}>
                    <Themed colorType="electricBadgeText" applyTo="color">
                      <Leaf data-theme-color="electricBadgeText" className="w-2 h-2 md:w-2.5 md:h-2.5" style={{ color: "var(--theme-electric-badge-text, #008354)" }} />
                    </Themed>
                    <Themed as="span" colorType="electricBadgeText" data-theme-color="electricBadgeText" style={{ color: "var(--theme-electric-badge-text, #008354)" }} className="font-bold text-[10px] md:text-xs">
                      {vehicle.badge}
                    </Themed>
                  </Themed>
                )}
                <div className="w-full h-16 md:h-24 lg:h-28 relative mb-2 md:mb-3">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <Themed as="h3" colorType="fleetVehicleName" data-theme-color="fleetVehicleName" className="text-sm md:text-lg lg:text-xl font-bold mb-1 md:mb-1.5" style={{ color: "var(--theme-fleet-vehicle-name, #222222)" }}>{vehicle.name}</Themed>
              <Themed colorType="fleetCapacityBadgeBg" data-theme-color="fleetCapacityBadgeBg" applyTo="backgroundColor" className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full w-fit" style={{ backgroundColor: "var(--theme-fleet-capacity-badge-bg, #E9F9FF)" }}>
                <Themed colorType="fleetIconColor" applyTo="color">
                  <Users data-theme-color="fleetIconColor" className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" style={{ color: "var(--theme-fleet-icon-color, #0E4659)" }} />
                </Themed>
                <Themed as="span" colorType="fleetCapacityBadgeText" data-theme-color="fleetCapacityBadgeText" className="font-semibold whitespace-nowrap text-xs md:text-sm lg:text-base" style={{ color: "var(--theme-fleet-capacity-badge-text, #0E4659)" }}>
                  {vehicle.capacity}
                </Themed>
              </Themed>
            </Themed>
          ))}
        </div>

        {/* Mobile: carrossel dedicado (scroll-snap, setas + dots) */}
        <div className="md:hidden w-full">
          <FleetMobileCarousel images={carouselImages} />
        </div>

        {/* Desktop: 3 cards estilo carrossel com gap; overflow-visible para as setas não serem cortadas */}
        <div className="relative w-full hidden md:block overflow-visible">
          <div
            ref={frameRef}
            className="relative w-full rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#f9fafb]"
            style={{ aspectRatio: FRAME_ASPECT, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
          >
            <div
              ref={viewportRef}
              className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
              onPointerDown={onDesktopCarouselPointerDown}
              onPointerMove={onDesktopCarouselPointerMove}
              onPointerUp={onDesktopCarouselPointerUp}
              onPointerLeave={onDesktopCarouselPointerUp}
            >
              <div
                className="flex h-full select-none"
                style={{
                  gap: CARD_GAP_PX,
                  width: carouselImages.length * slideWidthPx + (carouselImages.length - 1) * CARD_GAP_PX,
                  transform: slideWidthPx > 0 ? `translateX(-${currentTranslatePx}px)` : undefined,
                  transition: dragTranslatePx === null ? "transform 0.5s ease-out" : "none",
                }}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 h-full rounded-lg overflow-hidden bg-[#e5e7eb]"
                    style={{ width: slideWidthPx }}
                  >
                    <Image
                      src={image}
                      alt={`Fleet image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex absolute -left-10 lg:-left-12 2xl:-left-16 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={handleDesktopPrev}
              className="size-[36px] rounded-full flex items-center justify-center bg-[#27c7ff] hover:bg-[#20b8ef] shadow-lg transition-all duration-200"
              data-theme-color="buttonBg"
              style={{ backgroundColor: "var(--theme-button-bg, #27c7ff)" }}
              aria-label={t("previousImage")}
            >
              <ArrowLeft className="size-[16px] text-white" style={{ color: "var(--theme-button-text, #ffffff)" }} />
            </button>
          </div>
          <div className="flex absolute -right-10 lg:-right-12 2xl:-right-16 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={handleDesktopNext}
              className="size-[36px] rounded-full flex items-center justify-center bg-[#27c7ff] hover:bg-[#20b8ef] shadow-lg transition-all duration-200"
              data-theme-color="buttonBg"
              style={{ backgroundColor: "var(--theme-button-bg, #27c7ff)" }}
              aria-label={t("nextImage")}
            >
              <ArrowRight className="size-[16px] text-white" style={{ color: "var(--theme-button-text, #ffffff)" }} />
            </button>
          </div>
        </div>

        {/* Desktop dots (uma por página de 3) */}
        <div className="hidden md:flex mt-6 gap-[6px] items-center justify-center">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              data-theme-color="buttonBg"
              className={cn(
                "rounded-full transition-all",
                index === currentDot
                  ? "size-[14px] border-[1.2px] border-[#27c7ff] bg-transparent"
                  : "size-[10px] bg-[#27c7ff]"
              )}
              style={index === currentDot
                ? { borderColor: "var(--theme-button-bg, #27c7ff)" }
                : { backgroundColor: "var(--theme-button-bg, #27c7ff)" }}
            />
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex justify-center">
          <Link
            href="/fleet"
            className="group flex items-center justify-between pl-8 pr-6 py-4 bg-[#27c7ff] rounded-2xl shadow-[0px_4px_8px_rgba(0,0,0,0.1),0px_18px_20px_rgba(0,0,0,0.05)] hover:bg-[#20b8ef] transition-colors"
            data-theme-color="buttonBg"
            style={{ backgroundColor: "var(--theme-button-bg, #27c7ff)" }}
          >
            <span className="text-[16px] font-bold text-white uppercase tracking-[0.16px]" style={{ color: "var(--theme-button-text, #ffffff)" }}>
              {t("exploreFleet")}
            </span>
            <ArrowUpRight className="size-8 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-4" style={{ color: "var(--theme-button-text, #ffffff)" }} />
          </Link>
        </div>
      </div>
    </section>
  )
}
