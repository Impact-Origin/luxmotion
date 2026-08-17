"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

type CardConfig = {
  num: string
  photo: string
  photoAlt: string
  heading: React.ReactNode
  body: string
  pills: string[]
  stat: React.ReactNode
  statLabel: React.ReactNode
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] px-[9px] py-[7px] cursor-default transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-[rgba(154,117,53,0.14)] hover:border-[rgba(154,117,53,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(154,117,53,0.45)]">
      <Check className="size-2.5 text-[#9A7535]" strokeWidth={2.5} />
      <span
        className="text-[12px] font-medium text-[#9A7535] whitespace-nowrap leading-none"
        style={SANS_FONT}
      >
        {children}
      </span>
    </div>
  )
}

function CardNumber({ num }: { num: string }) {
  return (
    <p
      className="text-[64px] font-light leading-none text-[#E2DAD0]"
      style={SERIF_FONT}
    >
      {num}
    </p>
  )
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[32px] leading-[1.2] text-[#1C1B18] mt-3"
      style={SERIF_FONT}
    >
      {children}
    </h3>
  )
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[14px] leading-[1.2] text-[#999] mt-4"
      style={SANS_FONT}
    >
      {children}
    </p>
  )
}

function StatRow({
  stat,
  label,
}: {
  stat: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <div className="border-t border-[rgba(28,27,24,0.08)] flex items-center gap-4 pt-3 mt-5">
      <div className="shrink-0">{stat}</div>
      <p
        className="text-[12px] leading-[16.5px] text-[rgba(28,27,24,0.38)] max-w-[160px]"
        style={SANS_FONT}
      >
        {label}
      </p>
    </div>
  )
}

function AdvCard({
  card,
  reversed,
  contentBg,
  isFirst,
}: {
  card: CardConfig
  reversed: boolean
  contentBg: "white" | "cream"
  isFirst: boolean
}) {
  const borderCls = isFirst
    ? "border border-[rgba(28,27,24,0.08)]"
    : "border-x border-b border-[rgba(28,27,24,0.08)]"

  return (
    <div
      className={`${borderCls} flex flex-col ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } min-h-[380px]`}
    >
      <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto lg:min-h-[460px] shrink-0">
        <Image
          src={card.photo}
          alt={card.photoAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
        />
      </div>
      <div
        className={`flex-1 ${
          contentBg === "white" ? "bg-white" : "bg-[#F7F4EF]"
        } flex flex-col justify-center p-6 lg:p-[52px]`}
      >
        <CardNumber num={card.num} />
        <CardHeading>{card.heading}</CardHeading>
        <CardBody>{card.body}</CardBody>
        <div className="flex flex-wrap gap-2 mt-5">
          {card.pills.map((p, i) => (
            <Pill key={i}>{p}</Pill>
          ))}
        </div>
        <StatRow stat={card.stat} label={card.statLabel} />
      </div>
    </div>
  )
}

export function HowItWorks() {
  const t = useTranslations("driversPage.howItWorks")

  const stat1 = (
    <p className="text-[36px] leading-none whitespace-nowrap" style={SERIF_FONT}>
      <span className="text-[#0D0D0D]">+</span>
      <span className="italic font-light text-[#9A7535]">5</span>
    </p>
  )
  const stat2 = (
    <p
      className="text-[36px] italic font-light leading-none text-[#9A7535] whitespace-nowrap"
      style={SERIF_FONT}
    >
      100%
    </p>
  )
  const stat3 = (
    <Image
      src="/drivers/adv-rating-49.svg"
      alt="4.9"
      width={72}
      height={31}
      className="h-[31px] w-auto"
    />
  )
  const stat4 = (
    <p className="text-[36px] leading-none whitespace-nowrap" style={SERIF_FONT}>
      <span className="italic font-light text-[#9A7535]">7</span>
      <span className="font-light text-[#111110]"> {t("daysShort")}</span>
    </p>
  )

  const cards: CardConfig[] = [
    {
      num: "01",
      photo: "/drivers/advantages-1.webp",
      photoAlt: t("card1.photoAlt"),
      heading: (
        <>
          {t("card1.headingPre")}
          <span className="italic text-[#9A7535]">
            {t("card1.headingAccent")}
          </span>
          {t("card1.headingPost")}
          <br />
          {t("card1.headingLine2")}
        </>
      ),
      body: t("card1.body"),
      pills: [t("card1.pill1"), t("card1.pill2"), t("card1.pill3")],
      stat: stat1,
      statLabel: (
        <>
          {t("card1.statLabel1")}
          <br />
          {t("card1.statLabel2")}
        </>
      ),
    },
    {
      num: "02",
      photo: "/drivers/advantages-2.webp",
      photoAlt: t("card2.photoAlt"),
      heading: (
        <>
          <span className="italic text-[#9A7535]">
            {t("card2.headingAccent")}
          </span>
          <br />
          {t("card2.headingLine2")}
        </>
      ),
      body: t("card2.body"),
      pills: [t("card2.pill1"), t("card2.pill2"), t("card2.pill3")],
      stat: stat2,
      statLabel: (
        <>
          {t("card2.statLabel1")}
          <br />
          {t("card2.statLabel2")}
        </>
      ),
    },
    {
      num: "03",
      photo: "/drivers/advantages-3.webp",
      photoAlt: t("card3.photoAlt"),
      heading: (
        <>
          {t("card3.headingPre")}
          <span className="italic text-[#9A7535]">
            {t("card3.headingAccent")}
          </span>
          <br />
          {t("card3.headingLine2")}
        </>
      ),
      body: t("card3.body"),
      pills: [t("card3.pill1"), t("card3.pill2"), t("card3.pill3")],
      stat: stat3,
      statLabel: (
        <>
          {t("card3.statLabel1")}
          <br />
          {t("card3.statLabel2")}
        </>
      ),
    },
    {
      num: "04",
      photo: "/drivers/advantages-4.webp",
      photoAlt: t("card4.photoAlt"),
      heading: (
        <>
          {t("card4.headingLine1")}
          <br />
          <span className="italic text-[#9A7535]">
            {t("card4.headingAccent")}
          </span>
        </>
      ),
      body: t("card4.body"),
      pills: [t("card4.pill1"), t("card4.pill2"), t("card4.pill3")],
      stat: stat4,
      statLabel: (
        <>
          {t("card4.statLabel1")}
          <br />
          {t("card4.statLabel2")}
        </>
      ),
    },
  ]

  return (
    <section className="bg-[#F7F4EF] px-4 lg:px-[82px] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-px w-[82px] bg-[#9A7535]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>

        <h2
          className="mt-3 text-[32px] lg:text-[48px] leading-[1.2] font-light text-[#1C1B18]"
          style={SERIF_FONT}
        >
          {t("titleLine1")}
          <br />
          {t("titlePre")}{" "}
          <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
        </h2>

        <p
          className="mt-3 text-[14px] leading-[1.2] text-[#696969] max-w-[480px]"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="mt-12 lg:mt-12">
          {cards.map((card, i) => (
            <AdvCard
              key={i}
              card={card}
              reversed={i % 2 === 1}
              contentBg={i % 2 === 0 ? "white" : "cream"}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
