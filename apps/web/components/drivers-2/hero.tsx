"use client"

import Link from "next/link"
import { ArrowRight, Check, Info, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

const HERO_BG =
  "linear-gradient(90deg, rgba(11, 11, 9, 0.9) 0%, rgba(11, 11, 9, 0.65) 55%, rgba(11, 11, 9, 0.1) 100%), linear-gradient(145.274deg, rgb(14, 18, 8) 0%, rgb(12, 16, 24) 40%, rgb(18, 14, 8) 100%)"

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-8 lg:w-[82px] bg-[#9a7535]" />
      <span
        className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9a7535] leading-none whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function MetricCard({
  value,
  label,
  width,
}: {
  value: React.ReactNode
  label: React.ReactNode
  width?: string
}) {
  return (
    <div
      className={`backdrop-blur-[2px] bg-[rgba(0,0,0,0.3)] flex flex-col gap-[3px] items-start p-3 lg:p-4 ${width ?? ""}`}
    >
      <div
        className="text-[24px] lg:text-[28px] leading-[28px] font-light"
        style={SERIF_FONT}
      >
        {value}
      </div>
      <p
        className="text-[10px] leading-[14px] font-medium text-[rgba(255,255,255,0.38)]"
        style={SANS_FONT}
      >
        {label}
      </p>
    </div>
  )
}

function Pill({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center gap-1.5 px-[9px] py-[7px]">
      <span className="size-3 shrink-0 inline-flex items-center justify-center text-[#9a7535]">
        {icon}
      </span>
      <span
        className="text-[12px] font-medium text-[#999] leading-none whitespace-nowrap"
        style={SANS_FONT}
      >
        {children}
      </span>
    </div>
  )
}

function PhoneMockup() {
  const t = useTranslations("driversPage2.hero.phone")

  return (
    <div className="relative shrink-0 w-[260px] lg:w-[220px]">
      <div
        aria-hidden
        className="absolute -inset-12 lg:-inset-10 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(196,151,62,0.18) 0%, rgba(196,151,62,0) 70%)",
        }}
      />

      <div
        className="relative bg-[#111110] border-[7px] border-[#222] h-[520px] lg:h-[440px] overflow-hidden rounded-[36px] shadow-[0_32px_80px_0_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]"
      >
        <div
          className="absolute bg-[#222] h-[14px] left-1/2 -translate-x-1/2 rounded-b-[10px] top-0 w-[60px] z-10"
        />

        <div
          className="flex flex-col h-full"
          style={{
            backgroundImage:
              "linear-gradient(160deg, rgb(15, 26, 12) 0%, rgb(17, 17, 24) 100%)",
          }}
        >
          <div className="flex h-8 items-center justify-between pb-1 pt-3.5 px-3.5">
            <span
              className="text-[9px] font-semibold text-[rgba(255,255,255,0.5)]"
              style={SANS_FONT}
            >
              9:41
            </span>
            <span
              className="text-[9px] text-[rgba(255,255,255,0.5)]"
              style={SANS_FONT}
            >
              ●●●●
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-2.5 pt-2 px-3.5">
            <p
              className="text-[16px] text-white leading-none"
              style={SERIF_FONT}
            >
              {t("title")}
            </p>
            <div className="bg-[rgba(201,169,110,0.2)] px-[7px] py-[3px]">
              <span
                className="text-[8px] font-bold uppercase tracking-[0.8px] text-[#c4973e] leading-none"
                style={SANS_FONT}
              >
                {t("status")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 px-2.5 py-2 overflow-hidden">
            <TripCard
              date="Hoje · 11:30"
              price="€ 47,00"
              from="Aeroporto Lisboa"
              to=" → Hotel Bairro Alto"
              chips={[
                { label: t("trip1Chip1"), accent: true },
                { label: t("trip1Chip2"), accent: false },
                { label: "VIP", accent: true },
              ]}
              cta={t("acceptCta")}
            />
            <TripCard
              date="Hoje · 14:15"
              price="€ 125,00"
              from="Hotel Palácio"
              to=" → Sintra / Tour"
              chips={[
                { label: t("trip2Chip1"), accent: false },
                { label: t("trip2Chip2"), accent: true },
              ]}
            />
            <TripCard
              date="Amanhã · 07:00"
              price="€ 62,00"
              from="Hotel Chiado"
              to=" → Aeroporto"
              chips={[{ label: t("trip3Chip1"), accent: false }]}
            />
          </div>

          <div className="border-t border-[rgba(255,255,255,0.05)] flex gap-1.5 h-[45.2px] items-start justify-center pb-2 pt-2 px-2.5">
            <FooterStat value="€234" label={t("footerWeek")} />
            <FooterStat value="8" label={t("footerTrips")} />
            <FooterStat value="★ 4.9" label={t("footerRating")} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TripCard({
  date,
  price,
  from,
  to,
  chips,
  cta,
}: {
  date: string
  price: string
  from: string
  to: string
  chips: { label: string; accent: boolean }[]
  cta?: string
}) {
  const isActive = !!cta
  return (
    <div
      className={`flex flex-col gap-1 rounded-[4px] px-2.5 py-2.5 ${
        isActive
          ? "bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.35)]"
          : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[8px] font-semibold uppercase tracking-[0.48px] text-[rgba(255,255,255,0.35)] leading-none"
          style={SANS_FONT}
        >
          {date}
        </span>
        <span
          className="text-[11px] font-extrabold text-[#c4973e] leading-none"
          style={SANS_FONT}
        >
          {price}
        </span>
      </div>
      <p className="text-[9px] leading-[13.5px]" style={SANS_FONT}>
        <span className="font-semibold text-white">{from}</span>
        <span className="text-[rgba(255,255,255,0.65)]">{to}</span>
      </p>
      <div className="flex gap-1.5 items-start">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className={`px-1.5 py-0.5 rounded-[2px] text-[7px] font-bold uppercase tracking-[0.56px] leading-none ${
              chip.accent
                ? "bg-[rgba(201,169,110,0.15)] text-[#c4973e]"
                : "bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)]"
            }`}
            style={SANS_FONT}
          >
            {chip.label}
          </span>
        ))}
      </div>
      {cta && (
        <div className="bg-[#c4973e] rounded-[2px] flex items-center justify-center pt-2 pb-1.5 px-1.5 mt-0.5">
          <span
            className="text-[8px] font-extrabold uppercase tracking-[0.8px] text-[#111110] leading-none"
            style={SANS_FONT}
          >
            {cta}
          </span>
        </div>
      )}
    </div>
  )
}

function FooterStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-px">
      <span
        className="text-[14px] text-[#c4973e] leading-none"
        style={SERIF_FONT}
      >
        {value}
      </span>
      <span
        className="text-[7px] font-semibold uppercase tracking-[0.49px] text-[rgba(255,255,255,0.3)] leading-none"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

export function DriversHero2() {
  const t = useTranslations("driversPage2.hero")

  return (
    <section className="relative isolate overflow-hidden" style={{ backgroundImage: HERO_BG }}>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[rgba(196,151,62,0)] via-[#c4973e] to-[rgba(196,151,62,0)] z-10 pointer-events-none" />

      <div className="relative px-4 lg:px-[82px]">
        <div className="max-w-[1276px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between py-10 lg:py-[80px] gap-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:gap-6 w-full lg:w-[684px] max-w-full shrink-0">
            <Eyebrow label={t("eyebrow")} />

            <h1
              className="text-white font-light text-[44px] lg:text-[82px] leading-none"
              style={SERIF_FONT}
            >
              <span>{t("titleStart")} </span>
              <span className="italic text-[#c4973e]">{t("titleAccent")}</span>
            </h1>

            <p
              className="text-[15px] lg:text-[14px] leading-[1.3] text-[rgba(255,255,255,0.62)] lg:text-[rgba(255,255,255,0.52)] max-w-full lg:max-w-[428px]"
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>

            <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-px p-px lg:flex lg:gap-px lg:h-[93px] lg:max-w-[527px]">
              <MetricCard
                value={
                  <>
                    <span className="italic text-[#c4973e]">€0,70</span>
                    <span className="font-light text-white">–€0,90</span>
                  </>
                }
                label={
                  <>
                    {t("metric1Line1")}
                    <br />
                    {t("metric1Line2")}
                  </>
                }
                width="lg:w-[226.9px]"
              />
              <MetricCard
                value={
                  <>
                    <span className="text-white">+</span>
                    <span className="italic text-[#c4973e]">5</span>
                  </>
                }
                label={
                  <>
                    {t("metric2Line1")}
                    <br />
                    {t("metric2Line2")}
                  </>
                }
                width="lg:w-[150px]"
              />
              <MetricCard
                value={<span className="italic text-[#c4973e]">48h</span>}
                label={
                  <>
                    {t("metric3Line1")}
                    <br />
                    {t("metric3Line2")}
                  </>
                }
                width="lg:w-[150px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 w-full lg:hidden">
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillPayments")}
              </Pill>
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillSchedule")}
              </Pill>
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillExclusivity")}
              </Pill>
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillSupport")}
              </Pill>
            </div>
            <div className="hidden lg:flex flex-wrap gap-2">
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillPayments")}
              </Pill>
              <Pill icon={<Check className="size-3" strokeWidth={2.5} />}>
                {t("pillExclusivity")}
              </Pill>
              <Pill icon={<Smartphone className="size-3" strokeWidth={2.5} />}>
                {t("pillApp")}
              </Pill>
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-3 items-stretch lg:items-center">
              <Link
                href="/drivers/apply"
                className="group h-12 inline-flex items-center justify-center px-6 py-[9px] bg-[#c9a96e] text-[#0d0d0d] hover:bg-[#b89558] hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
              >
                <span
                  className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]"
                  style={SANS_FONT}
                >
                  {t("ctaPrimary")}
                </span>
                <ArrowRight
                  className="size-[18px] transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
              <Link
                href="#how-it-works"
                className="group h-12 inline-flex items-center justify-center gap-2 px-6 py-[9px] border border-[rgba(140,134,128,0.6)] text-[#999] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors duration-200"
              >
                <span
                  className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]"
                  style={SANS_FONT}
                >
                  {t("ctaSecondary")}
                </span>
                <Info
                  className="size-[18px] lg:hidden"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-center w-full lg:w-[420px] shrink-0">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
