"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Info, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

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
    <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center gap-1.5 px-[9px] py-[7px] cursor-default transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-[rgba(154,117,53,0.14)] hover:border-[rgba(154,117,53,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(154,117,53,0.45)]">
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

export function DriversHero2() {
  const t = useTranslations("driversPage2.hero")
  const { enter } = useEnterAnimation()

  return (
    <section className="relative isolate overflow-hidden" style={{ backgroundImage: HERO_BG }}>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[rgba(196,151,62,0)] via-[#c4973e] to-[rgba(196,151,62,0)] z-10 pointer-events-none" />

      <div className="relative px-4 lg:px-[82px]">
        <div className="max-w-[1276px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between py-10 lg:py-[80px] gap-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:gap-6 w-full lg:w-[684px] max-w-full shrink-0">
            <div className={enter("delay-0")}>
              <Eyebrow label={t("eyebrow")} />
            </div>

            <h1
              className={cn(
                "text-white font-light text-[44px] lg:text-[82px] leading-none",
                enter("delay-100")
              )}
              style={SERIF_FONT}
            >
              <span>{t("titleStart")} </span>
              <span className="italic text-[#c4973e]">{t("titleAccent")}</span>
            </h1>

            <p
              className={cn(
                "text-[15px] lg:text-[14px] leading-[1.3] text-[rgba(255,255,255,0.62)] lg:text-[rgba(255,255,255,0.52)] max-w-full lg:max-w-[428px]",
                enter("delay-200")
              )}
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>

            <div className={cn(
              "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-px p-px lg:flex lg:gap-px lg:h-[93px] lg:max-w-[527px]",
              enter("delay-300")
            )}>
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

            <div className={cn("grid grid-cols-2 gap-2 w-full lg:hidden", enter("delay-[400ms]"))}>
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
            <div className={cn("hidden lg:flex flex-wrap gap-2", enter("delay-[400ms]"))}>
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

            <div className={cn(
              "flex flex-col-reverse lg:flex-row gap-3 items-stretch lg:items-center",
              enter("delay-[500ms]")
            )}>
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

          {/* Em ecrã largo a fotografia sai do fluxo e encosta ao bordo, como no
              hero da página principal e nos guias de parceria. O `div` vazio
              reserva a largura, senão o texto espalhava-se pela linha toda e ia
              parar debaixo dela. */}
          <div className="flex justify-center w-full lg:hidden">
            <Image
              src="/drivers/hero-chauffeur.webp"
              alt={t("photoAlt")}
              width={1200}
              height={896}
              priority
              sizes="100vw"
              className="h-auto w-full max-w-[520px] object-contain"
            />
          </div>
          <div className="hidden lg:block lg:w-[420px] shrink-0" aria-hidden />
        </div>
      </div>

      {/* A fotografia é um recorte com transparência: assenta sobre o gradiente
          do hero em vez de o tapar. */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] max-w-[900px] lg:block xl:w-[50%] 2xl:w-[52%]">
        <Image
          src="/drivers/hero-chauffeur.webp"
          alt=""
          fill
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-contain object-right"
        />
      </div>
    </section>
  )
}
