"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Globe, MessageSquare, Shield, User, Users, type LucideIcon } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

type CardAlign = "left" | "right"

interface OfferCard {
  icon: LucideIcon
  titleKey: string
  descKey: string
  align: CardAlign
}

const CARDS: OfferCard[] = [
  { icon: Shield, titleKey: "card1.title", descKey: "card1.desc", align: "left" },
  { icon: Users, titleKey: "card2.title", descKey: "card2.desc", align: "left" },
  { icon: User, titleKey: "card3.title", descKey: "card3.desc", align: "right" },
  { icon: Globe, titleKey: "card4.title", descKey: "card4.desc", align: "right" },
]

function OfferCardBox({
  Icon,
  title,
  desc,
  align,
}: {
  Icon: LucideIcon
  title: string
  desc: string
  align: CardAlign
}) {
  const alignCls = align === "left" ? "items-start text-left" : "items-end text-right"

  return (
    <div
      className={`group bg-white hover:bg-[#f5efe2] border border-[rgba(168,131,58,0.1)] hover:border-[rgba(168,131,58,0.55)] shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-colors duration-200 flex flex-col gap-[5.4px] justify-center px-[28.8px] py-[32.8px] w-full md:h-[189.5px] ${alignCls}`}
    >
      <div className="size-[44px] border border-[rgba(154,117,53,0.22)] group-hover:border-[#a08248] transition-colors duration-200 flex items-center justify-center shrink-0">
        <Icon className="size-5 text-[#a08248]" strokeWidth={1.5} />
      </div>
      <div className="pt-[10.6px] w-full">
        <h3
          className="text-[24px] leading-tight font-medium text-[#1a1612] group-hover:text-[#a08248] transition-colors duration-200"
          style={SERIF_FONT}
        >
          {title}
        </h3>
      </div>
      <p className="text-[14px] leading-[1.2] text-[#7a746e] w-full" style={SANS_FONT}>
        {desc}
      </p>
    </div>
  )
}

function MobileImageBracketed({ alt }: { alt: string }) {
  return (
    <div className="relative mx-auto w-[369px] max-w-full h-[303px]">
      <span
        className="absolute top-0 left-0 w-[23.245px] h-[20.369px] border-l border-t border-[#a8833a] pointer-events-none z-10"
        aria-hidden
      />
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/whitelabel/wedding/offer-couple-chauffeur.webp"
          alt={alt}
          fill
          sizes="369px"
          className="object-contain"
        />
      </div>
      <span
        className="absolute bottom-0 right-0 w-[23.245px] h-[20.369px] border-r border-b border-[#a8833a] pointer-events-none z-10"
        aria-hidden
      />
    </div>
  )
}

function SectionHeading({
  eyebrow,
  titleStart,
  titleAccent,
}: {
  eyebrow: string
  titleStart: string
  titleAccent: string
}) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 items-center justify-center">
        <span className="h-px w-8 bg-[#a08248]" />
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-[#a08248]" />
      </div>
      <h2
        className="text-[36px] md:text-[48px] leading-[1.1] font-light text-[#1a1612] text-center"
        style={SERIF_FONT}
      >
        {titleStart} <span className="italic text-[#a08248] font-light">{titleAccent}</span>
      </h2>
    </div>
  )
}

export function WeddingWhitelabelOffer() {
  const t = useTranslations("weddingWhitelabel.offer")
  const { ref, reveal } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#f7f4ef] border-t border-t-[rgba(168,131,58,0.1)] px-4 md:px-[82px] py-10 md:py-[96px]">
      <div ref={ref} className="max-w-[1280px] mx-auto flex flex-col gap-8 md:gap-6">
        <div className={reveal()}>
          <SectionHeading
            eyebrow={t("eyebrow")}
            titleStart={t("titleStart")}
            titleAccent={t("titleAccent")}
          />
        </div>

        <div className="xl:hidden flex flex-col gap-6 items-center pt-2">
          <div className={reveal()} style={{ transitionDelay: "120ms" }}>
            <MobileImageBracketed alt={t("imageAlt")} />
          </div>
          <div className="flex flex-col gap-[2px] w-full">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={reveal()}
                style={{ transitionDelay: `${240 + i * 100}ms` }}
              >
                <OfferCardBox
                  Icon={c.icon}
                  title={t(c.titleKey)}
                  desc={t(c.descKey)}
                  align="left"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden xl:block relative w-full h-[424px]">
          <div className="absolute left-0 top-[42px] w-[460px] flex flex-col gap-[2px] justify-center">
            {CARDS.filter((c) => c.align === "left").map((c, i) => (
              <div
                key={`l-${i}`}
                className={reveal()}
                style={{ transitionDelay: `${240 + i * 120}ms` }}
              >
                <OfferCardBox
                  Icon={c.icon}
                  title={t(c.titleKey)}
                  desc={t(c.descKey)}
                  align="left"
                />
              </div>
            ))}
          </div>

          <div className="absolute right-0 top-[42px] w-[460px] flex flex-col gap-[2px] justify-center">
            {CARDS.filter((c) => c.align === "right").map((c, i) => (
              <div
                key={`r-${i}`}
                className={reveal()}
                style={{ transitionDelay: `${240 + i * 120}ms` }}
              >
                <OfferCardBox
                  Icon={c.icon}
                  title={t(c.titleKey)}
                  desc={t(c.descKey)}
                  align="right"
                />
              </div>
            ))}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[53.2px] w-[369px] h-[370px]">
            <span
              className="absolute -top-[6.83px] left-[31.08px] w-[23.245px] h-[20.369px] border-l border-t border-[#a8833a] pointer-events-none z-10"
              aria-hidden
            />
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
              <Image
                src="/whitelabel/wedding/offer-couple-chauffeur.webp"
                alt={t("imageAlt")}
                width={369}
                height={310}
                className="w-full h-auto object-contain"
              />
            </div>
            <span
              className="absolute -bottom-[6.83px] right-[31.08px] w-[23.245px] h-[20.369px] border-r border-b border-[#a8833a] pointer-events-none z-10"
              aria-hidden
            />
          </div>
        </div>

        <div className={cn("flex justify-center pt-2", reveal())} style={{ transitionDelay: "600ms" }}>
          <a
            href="#wedding-quote"
            className="group h-12 px-6 inline-flex items-center justify-center gap-2 bg-[#a08248] hover:bg-[#8a6f3c] hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
          >
            <span
              className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-white"
              style={SANS_FONT}
            >
              {t("cta")}
            </span>
            <MessageSquare className="size-4 text-white" strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}
