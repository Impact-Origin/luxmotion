"use client"

import * as React from "react"
import { Plane, Phone, ShieldCheck, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { BookingWidget } from "./booking-widget"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative flex-1 flex items-center gap-4 px-12 py-6 lg:p-6 lg:justify-center group cursor-default overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[rgba(var(--lm-accent-rgb,201,169,110),0.06)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[var(--lm-accent,#C9A96E)] to-[rgba(var(--lm-accent-rgb,201,169,110),0.4)] transition-all duration-300 ease-out group-hover:w-full" />
      <div className="relative shrink-0 flex items-center justify-center p-4 rounded-full bg-[rgba(var(--lm-accent-rgb,201,169,110),0.08)] border-2 border-[rgba(var(--lm-accent-rgb,201,169,110),0.25)] transition-all duration-300 group-hover:border-[var(--lm-accent,#C9A96E)] group-hover:shadow-[0_0_16px_rgba(var(--lm-accent-rgb,201,169,110),0.2)] group-hover:bg-[rgba(var(--lm-accent-rgb,201,169,110),0.12)]">
        {icon}
      </div>
      <p className="relative text-[16px] leading-[1.3] text-[var(--lm-muted,#999)] transition-colors duration-300 group-hover:text-[var(--lm-text,#fff)]">
        {title}
        <br />
        {description}
      </p>
    </div>
  )
}

// Total real da ficha Google (confirmado na API: 324, média 4.9).
const REVIEW_COUNT = 324

const SOCIAL_AVATARS = ["/reviews/review-1.webp", "/reviews/review-2.webp", "/reviews/review-3.webp"]

export function SocialProofBar() {
  const t = useTranslations("hero")

  const shell =
    "border border-[rgba(var(--lm-text-rgb,26,22,18),0.14)] bg-[rgba(var(--lm-text-rgb,26,22,18),0.03)]"
  const vDivider = (
    <div className="w-px self-stretch shrink-0 bg-[rgba(var(--lm-text-rgb,26,22,18),0.14)]" />
  )

  const rating = (
    <div className="flex flex-col items-start gap-[3px] shrink-0">
      <span
        className="text-[30px] leading-[0.8] font-normal text-[var(--lm-text,#1a1612)]"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        4.9
      </span>
      <span className="text-[12px] leading-none tracking-[1.5px] text-[var(--lm-accent,#a08248)]">★★★★★</span>
      <span className="text-[9px] font-semibold uppercase tracking-[1.4px] leading-[1.3] text-[var(--lm-accent,#a08248)]">
        {t("excellentRating")}
      </span>
    </div>
  )

  const reviews = (
    <div className="flex items-center gap-3 shrink-0">
      <div className="relative h-9 shrink-0" style={{ width: `${(SOCIAL_AVATARS.length - 1) * 22 + 36}px` }}>
        {SOCIAL_AVATARS.map((src, i) => (
          <div
            key={src}
            className="absolute top-0 size-9 overflow-hidden rounded-full border-2 border-[var(--lm-bg,#efe8dc)]"
            style={{ left: `${i * 22}px`, zIndex: i }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="36px" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[3px]">
        <span className="text-[13px] font-semibold leading-none text-[var(--lm-text,#1a1612)] whitespace-nowrap">
          {t("fromReviews", { count: REVIEW_COUNT })}
        </span>
        <span className="flex items-center gap-1 text-[12px] leading-none text-[#1E9E63] whitespace-nowrap">
          <BadgeCheck className="size-3.5 shrink-0" strokeWidth={2.2} />
          {t("verifiedGuests")}
        </span>
      </div>
    </div>
  )

  const verified = (mark: React.ReactNode, name: string) => (
    <div className="flex items-center gap-2 shrink-0">
      {mark}
      <div className="flex flex-col gap-[3px]">
        <span className="text-[9px] font-semibold uppercase tracking-[1.3px] leading-none text-[var(--lm-muted,#5a5249)] whitespace-nowrap">
          {t("verifiedBy")}
        </span>
        <span className="text-[15px] font-semibold leading-none text-[var(--lm-text,#1a1612)] whitespace-nowrap">
          {name}
        </span>
      </div>
    </div>
  )

  const trustpilotMark = (
    <span className="text-[22px] leading-none text-[#00B67A]" aria-hidden="true">★</span>
  )
  const googleMark = (
    <Image src="/svgs/google-icon.svg" alt="" width={20} height={20} className="size-[19px] shrink-0" />
  )

  return (
    <>
      {/* Desktop: single row, four cells */}
      <div className={`hidden lg:flex flex-nowrap items-center gap-5 rounded-[14px] px-6 py-3 w-max ${shell}`}>
        {rating}
        {vDivider}
        {reviews}
        {vDivider}
        {verified(trustpilotMark, "Trustpilot")}
        {vDivider}
        {verified(googleMark, "Google")}
      </div>

      {/* Mobile: rounded card, two rows */}
      <div className={`flex lg:hidden flex-col gap-3.5 w-full rounded-2xl px-4 py-4 ${shell}`}>
        <div className="flex items-center gap-4">
          {rating}
          {vDivider}
          {reviews}
        </div>
        <div className="h-px w-full bg-[rgba(var(--lm-text-rgb,26,22,18),0.1)]" />
        <div className="flex items-center gap-4">
          {verified(trustpilotMark, "Trustpilot")}
          {vDivider}
          {verified(googleMark, "Google")}
        </div>
      </div>
    </>
  )
}

// Ordem definida pelo prefixo numérico dos ficheiros originais:
// geral → corporate → wedding → tour → school (as verticais do negócio).
const HERO_SLIDES = [
  "/hero/1-luxmotion.webp",
  "/hero/2-corporate.webp",
  "/hero/3-wedding.webp",
  "/hero/4-tour.webp",
  "/hero/5-school.webp",
] as const

const SLIDE_INTERVAL_MS = 5500

/**
 * Avança sozinho, mas com timeout em vez de interval: como o efeito depende do
 * índice, clicar num ponto reinicia a contagem em vez de saltar logo a seguir.
 */
function useHeroSlideshow(enabled: boolean) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return
    // Quem pediu menos animação ao sistema fica com a primeira imagem fixa.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % HERO_SLIDES.length),
      SLIDE_INTERVAL_MS,
    )
    return () => window.clearTimeout(id)
  }, [enabled, index])

  return [index, setIndex] as const
}

function HeroSlides({
  activeIndex,
  positionClass,
  sizes,
}: {
  activeIndex: number
  positionClass: string
  sizes: string
}) {
  return (
    <>
      {HERO_SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={sizes}
          // Só a primeira conta para o LCP; as outras entram depois.
          priority={i === 0}
          className={cn(
            "object-cover transition-opacity duration-[1200ms] ease-in-out",
            positionClass,
            i === activeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </>
  )
}

const WHITELABEL_BG = "linear-gradient(180deg, rgba(var(--lm-bg-rgb,13,13,13),0.20) 0%, rgba(var(--lm-bg-rgb,13,13,13),0.55) 50%, rgba(var(--lm-bg-rgb,13,13,13),0.96) 82%, var(--lm-bg,#0D0D0D) 100%)"

const WHITELABEL_DESCRIPTION =
  "O {{HOTEL_NAME}} tem o prazer de oferecer-lhe transfers privados e experiências à medida — reserva em menos de 60 segundos, preço fixo garantido."

export function Hero({
  whitelabel = false,
  heroImageUrl,
  checkoutBasePath = "",
}: {
  whitelabel?: boolean
  heroImageUrl?: string | null
  checkoutBasePath?: string
} = {}) {
  const t = useTranslations("hero")
  const { enter } = useEnterAnimation()
  // As parcerias fixam a sua própria imagem; só o hero principal roda.
  const slideshow = !heroImageUrl
  const [activeSlide] = useHeroSlideshow(slideshow)

  return (
    <section
      className="relative bg-[var(--lm-bg,#0D0D0D)] overflow-hidden"
      style={whitelabel ? { background: WHITELABEL_BG } : undefined}
    >
      <div className="absolute top-0 right-0 w-[46%] xl:w-[48%] 2xl:w-[50%] max-w-[850px] h-[540px] hidden lg:block">
        {slideshow ? (
          <HeroSlides
            activeIndex={activeSlide}
            positionClass="object-[20%_center]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ) : (
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover object-[20%_center]"
            priority
            unoptimized
          />
        )}
      </div>

      <div className="relative lg:hidden overflow-hidden h-[320px]">
        {slideshow ? (
          <HeroSlides
            activeIndex={activeSlide}
            positionClass="object-[center_30%]"
            sizes="100vw"
          />
        ) : (
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover object-[center_30%]"
            priority
            unoptimized
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(transparent 20%, rgba(var(--lm-bg-rgb,13,13,13),0.6) 65%, var(--lm-bg,#0D0D0D) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-12 lg:pt-[136px] lg:pb-[96px] -mt-10 lg:mt-0 flex flex-col gap-6 lg:gap-12">
        <div className="max-w-[680px] flex flex-col gap-6 lg:gap-9">
          <div className={cn("flex items-center gap-2", enter("delay-0"))}>
            <div className="h-px bg-[var(--lm-accent,#C9A96E)] w-[32px] lg:w-[40px]" />
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[var(--lm-accent,#C9A96E)] whitespace-nowrap">
              {t("label")}
            </span>
          </div>

          <h1 className={enter("delay-100")}>
            <span
              className="text-[var(--lm-text,#fff)] text-[48px] lg:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              Portugal,
            </span>
            <span
              className="italic text-[var(--lm-accent,#C9A96E)] text-[48px] lg:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {t("titleHighlight")}
            </span>
          </h1>

          <p className={cn("text-[18px] font-light leading-[1.3] text-[var(--lm-muted,#999)] max-w-[591px]", enter("delay-200"))}>
            {whitelabel ? WHITELABEL_DESCRIPTION : t("description")}
          </p>

          {!whitelabel && (
            <div className={enter("delay-300")}>
              <SocialProofBar />
            </div>
          )}
        </div>

        <div id="booking" className={cn("w-full scroll-mt-24", enter("delay-[400ms]"))}>
          <BookingWidget checkoutBasePath={checkoutBasePath} />
        </div>

        <div className={cn("flex flex-col lg:flex-row border border-[rgba(var(--lm-text-rgb,255,255,255),0.12)] divide-y lg:divide-y-0 lg:divide-x divide-[rgba(var(--lm-text-rgb,255,255,255),0.12)]", enter("delay-[500ms]"))}>
          <FeatureCard
            icon={<Plane className="size-6 text-[var(--lm-accent,#C9A96E)]" />}
            title={t("flightMonitoring")}
            description={t("flightMonitoringDesc")}
          />
          <FeatureCard
            icon={<Phone className="size-6 text-[var(--lm-accent,#C9A96E)]" />}
            title={t("conciergeSupport")}
            description={t("conciergeSupportDesc")}
          />
          <FeatureCard
            icon={<ShieldCheck className="size-6 text-[var(--lm-accent,#C9A96E)]" />}
            title={t("privateTransfers")}
            description={t("privateTransfersDesc")}
          />
        </div>
      </div>
    </section>
  )
}
