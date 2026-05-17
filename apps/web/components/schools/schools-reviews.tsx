"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight, BadgeCheck, Star } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

type Review = {
  initial: string
  name: string
  avatarBg: string
  body: string
}

const REVIEWS: Review[] = [
  {
    initial: "S",
    name: "Sofia Andrade",
    avatarBg: "#9c27b0",
    body: "O motorista é sempre pontual e atencioso com a minha filha. Recebo notificação quando a viagem começa e termina. Total tranquilidade para mim e para o meu marido.",
  },
  {
    initial: "R",
    name: "Ricardo Fonseca",
    avatarBg: "#1565c0",
    body: "Serviço impecável durante todo o ano letivo. Os meus dois filhos viajam em segurança e sem stress. A acompanhante é maravilhosa com eles.",
  },
  {
    initial: "M",
    name: "Mariana Lopes",
    avatarBg: "#2e7d32",
    body: "Mudou completamente as minhas manhãs. Sem filas, sem trânsito, sem corridas. O meu filho chega à escola descansado e a horas, todos os dias.",
  },
  {
    initial: "A",
    name: "Ana Luísa Costa",
    avatarBg: "#b71c1c",
    body: "Atendimento pessoal e cuidado em cada detalhe. Sempre que tive uma dúvida, fui atendida em minutos. Recomendo a todos os pais que valorizem segurança.",
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-[1px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="size-3 text-[#a8833a]" fill="#a8833a" strokeWidth={0} />
      ))}
    </div>
  )
}

function Avatar({ initial, bg }: { initial: string; bg: string }) {
  return (
    <div
      className="size-[34px] rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: bg }}
    >
      <span
        className="text-[13px] font-semibold text-white leading-none"
        style={SANS_FONT}
      >
        {initial}
      </span>
    </div>
  )
}

function ReviewCard({
  review,
  verifiedLabel,
}: {
  review: Review
  verifiedLabel: string
}) {
  return (
    <div
      className="bg-white border-[0.8px] border-[rgba(28,27,24,0.08)] border-t-[1.6px] border-t-[rgba(154,117,53,0.22)] hover:border-[rgba(154,117,53,0.4)] hover:border-t-[#a08248] transition-colors duration-200 flex flex-col gap-2 items-start pt-[25.6px] pb-[24.8px] px-[24.8px] h-full"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.04))" }}
    >
      <div className="flex gap-[10px] items-center w-full">
        <Avatar initial={review.initial} bg={review.avatarBg} />
        <div className="flex flex-col items-start min-w-0">
          <span
            className="text-[12px] font-semibold text-[#1a1612] leading-tight whitespace-nowrap"
            style={SANS_FONT}
          >
            {review.name}
          </span>
          <span
            className="text-[9px] text-[#7a746e] tracking-[0.54px] leading-tight whitespace-nowrap"
            style={SANS_FONT}
          >
            {verifiedLabel}
          </span>
        </div>
      </div>
      <div className="pt-[4.8px]">
        <Stars />
      </div>
      <p
        className="text-[12px] md:text-[12px] leading-[1.4] text-[rgba(26,22,18,0.5)] w-full"
        style={SANS_FONT}
      >
        {review.body}
      </p>
    </div>
  )
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction}
      className="size-12 border-[1.714px] border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] hover:text-[#9A7535] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 shrink-0"
    >
      <Icon className="size-[18px] text-[#a08248]" strokeWidth={2} />
    </button>
  )
}

export function SchoolsReviews() {
  const t = useTranslations("schools.reviews")
  const [index, setIndex] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  const fadeLeft = (delay: string) =>
    `transition-all duration-700 ease-out ${delay} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`

  const next = () => setIndex((i) => Math.min(i + 1, REVIEWS.length - 1))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))

  return (
    <section className="bg-white px-4 md:px-[80px] py-[56px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6 md:gap-8 items-center">
        <div
          ref={headerRef}
          className={`inline-flex items-center justify-center gap-2 border border-[#a08248] px-4 py-2 ${fadeLeft("")}`}
          style={{ backdropFilter: "blur(2px)" }}
        >
          <BadgeCheck className="size-6 text-[#a08248]" strokeWidth={1.75} />
          <span
            className="text-[14px] text-[#a08248] tracking-[0.28px] leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>

        <div className={`flex flex-col gap-2 items-center w-full ${fadeLeft("delay-100")}`}>
          <h2
            className="text-center font-light text-[#0d0d0d] flex flex-col md:block"
            style={SERIF_FONT}
          >
            <span className="text-[48px] md:text-[64px] font-medium text-[#a08248] leading-none">
              {t("statValue")}
            </span>{" "}
            <span className="text-[32px] md:text-[48px] font-normal leading-none">
              {t("statLabel")}
            </span>
          </h2>
        </div>

        <div className={`flex flex-col gap-2 items-center ${fadeLeft("delay-200")}`}>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="size-6 text-[#a8833a]"
                fill="#a8833a"
                strokeWidth={0}
              />
            ))}
          </div>
          <div className="flex gap-[18.834px] items-center justify-center">
            <Image
              src="/schools/google-logo.png"
              alt="Google"
              width={94}
              height={32}
              className="h-8 w-[94px] object-contain"
            />
            <Image
              src="/schools/trustpilot.svg"
              alt="Trustpilot"
              width={104}
              height={28}
              className="h-7 w-[104px] object-contain"
            />
          </div>
          <p
            className="text-[16px] md:text-[18px] font-light text-[#696969] leading-[1.3] text-center"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="hidden md:grid grid-cols-4 gap-[3px] w-full">
          {REVIEWS.map((review) => (
            <ReviewCard
              key={review.name}
              review={review}
              verifiedLabel={t("verifiedLabel")}
            />
          ))}
        </div>

        <div className="md:hidden w-full flex flex-col gap-4">
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {REVIEWS.map((review) => (
                <div key={review.name} className="w-full shrink-0">
                  <ReviewCard review={review} verifiedLabel={t("verifiedLabel")} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ArrowButton direction="prev" onClick={prev} disabled={index === 0} />
            <div className="flex items-center gap-2 px-2">
              {REVIEWS.map((_, i) => (
                <span
                  key={i}
                  className={
                    "size-[5.352px] rounded-full transition-colors " +
                    (i === index ? "bg-[#a08248]" : "bg-[rgba(154,117,53,0.3)]")
                  }
                />
              ))}
            </div>
            <ArrowButton
              direction="next"
              onClick={next}
              disabled={index === REVIEWS.length - 1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
