"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

type Testimonial = {
  initial: string
  avatarBg: string
  name: string
  role: string
  quote: string
}

function StarRow({ size, className }: { size: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="text-[#F5A623] fill-[#F5A623]"
          style={{ width: size, height: size }}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

function PlatformBadge({ children, href }: { children: React.ReactNode; href?: string }) {
  const className =
    "bg-[#F7F4EF] border border-[rgba(28,27,24,0.08)] flex items-center justify-center px-4 py-2.5 w-full h-[44px] transition-all duration-200 hover:bg-white hover:border-[rgba(28,27,24,0.18)] hover:shadow-sm"
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {children}
      </a>
    )
  }
  return <div className={className}>{children}</div>
}

function StatBox({
  label,
  value,
  caption,
}: {
  label: string
  value: React.ReactNode
  caption: string
}) {
  return (
    <div className="bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] p-4 flex flex-col gap-1.5 w-full">
      <p
        className="text-[9px] font-bold uppercase tracking-[2.34px] text-[#9A7535] leading-none"
        style={SANS_FONT}
      >
        {label}
      </p>
      <p
        className="text-[32px] font-light leading-none text-[#111110]"
        style={SERIF_FONT}
      >
        {value}
      </p>
      <p
        className="text-[11px] leading-none text-[rgba(28,27,24,0.38)] mt-1"
        style={SANS_FONT}
      >
        {caption}
      </p>
    </div>
  )
}

function TestimonialCard({ t: data }: { t: Testimonial }) {
  return (
    <article className="bg-[#F7F4EF] border border-[rgba(28,27,24,0.08)] flex flex-col gap-3.5 p-6">
      <p
        className="text-[15px] lg:text-[17px] italic leading-[1.6] text-[#1C1B18]"
        style={SERIF_FONT}
      >
        <span className="text-[#9A7535] mr-0.5">&ldquo;</span>
        {data.quote}
      </p>
      <div className="flex items-center gap-2.5">
        <div
          className="size-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: data.avatarBg }}
        >
          <span
            className="text-[13px] font-bold text-white leading-none"
            style={SANS_FONT}
          >
            {data.initial}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p
            className="text-[12px] font-bold text-[#1C1B18] leading-none"
            style={SANS_FONT}
          >
            {data.name}
          </p>
          <p
            className="text-[10px] text-[rgba(28,27,24,0.38)] leading-none"
            style={SANS_FONT}
          >
            {data.role}
          </p>
        </div>
        <StarRow size={11} className="shrink-0" />
      </div>
    </article>
  )
}

export function TrustTestimonials2() {
  const t = useTranslations("driversPage2.trust")
  const sectionRef = useRef<HTMLElement>(null)
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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const fadeLeft = (delay: string) =>
    `transition-all duration-700 ease-out ${delay} ${
      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
    }`
  const fadeRight = (delay: string) =>
    `transition-all duration-700 ease-out ${delay} ${
      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
    }`

  const testimonials: Testimonial[] = [
    {
      initial: "M",
      avatarBg: "#1565C0",
      name: t("t1.name"),
      role: t("t1.role"),
      quote: t("t1.quote"),
    },
    {
      initial: "C",
      avatarBg: "#2E7D32",
      name: t("t2.name"),
      role: t("t2.role"),
      quote: t("t2.quote"),
    },
    {
      initial: "A",
      avatarBg: "#7B1FA2",
      name: t("t3.name"),
      role: t("t3.role"),
      quote: t("t3.quote"),
    },
  ]

  return (
    <section ref={sectionRef} className="bg-white border-t border-[rgba(28,27,24,0.08)] px-4 lg:px-[82px] pt-14 pb-6 lg:pt-[72px] lg:pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-2">
        <div className={`flex items-center gap-2 ${fadeLeft("")}`}>
          <div className="h-px w-[82px] bg-[#9A7535]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>
        <h2
          className={`text-[32px] lg:text-[44px] font-light leading-[1.2] text-[#1C1B18] ${fadeLeft("delay-100")}`}
          style={SERIF_FONT}
        >
          {t("titleLine1")}
          <br />
          {t("titlePre")}{" "}
          <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-14 mt-1 lg:mt-2">
          <div className={`flex flex-col gap-1 w-full lg:w-[381px] shrink-0 ${fadeLeft("delay-200")}`}>
            <p
              className="text-[72px] font-light leading-none text-[#A08248]"
              style={SERIF_FONT}
            >
              4.<span className="italic text-[#9A7535]">9</span>
            </p>
            <StarRow size={20} className="mt-1.5" />
            <p
              className="text-[12px] text-[#696969] mt-1 leading-none"
              style={SANS_FONT}
            >
              {t("ratingCount")}
            </p>

            <div className="flex flex-col gap-2 mt-5 mb-4">
              <PlatformBadge href="https://maps.app.goo.gl/uErDVp3HagakGnAf7">
                <Image
                  src="/google-logo.png"
                  alt="Google"
                  width={80}
                  height={27}
                  className="h-[24px] w-auto"
                />
              </PlatformBadge>
              <PlatformBadge href="https://www.trustpilot.com/review/easytransferericeira.com">
                <Image
                  src="/trustpilot-logo.png"
                  alt="Trustpilot"
                  width={88}
                  height={24}
                  className="h-[20px] w-auto"
                />
              </PlatformBadge>
            </div>

            <StatBox
              label={t("statLabel")}
              value={
                <>
                  +<span className="italic text-[#9A7535]">300</span>
                </>
              }
              caption={t("statCaption")}
            />
          </div>

          <div className="flex-1 flex flex-col gap-[3px] min-w-0">
            {testimonials.map((tm, i) => (
              <div
                key={i}
                className={fadeRight(
                  i === 0 ? "delay-200" : i === 1 ? "delay-300" : "delay-[400ms]"
                )}
              >
                <TestimonialCard t={tm} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
