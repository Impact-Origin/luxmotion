"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

/** Um caso de estudo. As listas não têm comprimento fixo: nem todos os
 *  espaços contam a mesma história com o mesmo número de pontos. */
interface Caso {
  venueName: string
  venueMeta: string
  photo: string
  photoAlt: string
  profile: string[]
  quote: string
  quoteAuthor: string
  /** Cinco valores, pela ordem das etiquetas stat1..stat5. */
  stats: string[]
  before: string[]
  impl: string[]
  exp: string[]
  /** "48 horas", "72 horas" — o tempo de activação varia por espaço. */
  footerEnd: string
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-start gap-2 px-4 py-2 self-stretch">
      <span
        className="text-[28px] md:text-[32px] font-semibold text-[#c9a96e] leading-[1.155] w-full"
        style={SERIF}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-medium uppercase tracking-[1px] text-[#999] leading-[1.2] w-full whitespace-pre-line"
        style={SANS}
      >
        {label}
      </span>
    </div>
  )
}

function Bullet({ text, dim = true }: { text: string; dim?: boolean }) {
  return (
    <div className="flex gap-1 items-start py-1 w-full">
      <Check
        className="shrink-0 mt-[2px] w-4 h-4 text-[#c9a96e]"
        strokeWidth={2.5}
      />
      <span
        className={`flex-1 text-[14px] leading-[1.2] ${dim ? "text-[#999]" : "text-white"}`}
        style={SANS}
      >
        {text}
      </span>
    </div>
  )
}

export function WeddingPlannerCaseStudy() {
  const t = useTranslations("weddingPlanner.caseStudy")
  const { ref, reveal } = useScrollReveal<HTMLElement>()
  const casos = t.raw("cases") as Caso[]
  const [indice, setIndice] = React.useState(0)
  const caso = casos[indice]

  /* Dá a volta em vez de parar nos extremos: são poucos casos e o utilizador
     que carrega duas vezes na seta espera continuar a ver, não bater no fim. */
  const mover = (passo: 1 | -1) =>
    setIndice((i) => (i + passo + casos.length) % casos.length)

  if (!caso) return null

  return (
    <section ref={ref} className="bg-[#F7F4EF] px-4 md:px-[82px] py-16 md:py-24">
      <div className={cn("max-w-[1280px] mx-auto flex flex-col gap-10", reveal())}>
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex gap-2 items-center justify-center w-full">
            <div className="w-8 h-px bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
              style={SANS}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#a08248]" />
          </div>
          <h2
            className="text-[36px] md:text-[48px] text-[#1c1b18] text-center leading-[1.1]"
            style={SERIF}
          >
            {t("heading")}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#0d0d0d] border border-[rgba(28,27,24,0.08)] flex flex-col lg:flex-row items-stretch overflow-hidden">
            <div className="group relative flex-1 min-h-[480px] lg:min-h-[655px] lg:max-w-[50%] overflow-hidden">
              <Image
                src={caso.photo}
                alt={caso.photoAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 from-[40%] to-transparent to-[77%]" />
              <div className="relative h-full flex flex-col gap-2 items-start justify-end p-6">
                <div
                  className="border border-[rgba(201,169,110,0.25)] px-[9px] py-[7px]"
                  style={{ backgroundColor: "#1f1a10" }}
                >
                  <span
                    className="text-[12px] font-medium uppercase tracking-[1.8px] text-[#a08248]"
                    style={SANS}
                  >
                    {t("pill")}
                  </span>
                </div>
                <h3
                  className="text-[28px] md:text-[32px] font-semibold text-[#f7f4ef] leading-[1.07] w-full"
                  style={SERIF}
                >
                  {caso.venueName}
                </h3>
                <p
                  className="text-[12px] font-medium text-white leading-[19px] w-full"
                  style={SANS}
                >
                  {caso.venueMeta}
                </p>
                <div className="flex flex-col gap-2 items-start w-full mt-1">
                  <span
                    className="text-[12px] font-semibold uppercase tracking-[1.8px] text-[#a08248] w-full"
                    style={SANS}
                  >
                    {t("venueProfileLabel")}
                  </span>
                  <div className="flex flex-col gap-1 w-full">
                    {caso.profile.map((texto) => (
                      <Bullet key={texto} text={texto} dim={false} />
                    ))}
                  </div>
                </div>
                <div className="backdrop-blur-[2px] bg-white/[0.04] border border-[rgba(154,117,53,0.22)] flex flex-col gap-2 px-6 py-4 w-full mt-2">
                  <p
                    className="text-[18px] md:text-[24px] italic text-white leading-[1.2]"
                    style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
                  >
                    {caso.quote}
                  </p>
                  <p
                    className="text-[12px] font-semibold text-[#c9a96e] leading-none"
                    style={SANS}
                  >
                    {caso.quoteAuthor}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-stretch lg:max-w-[50%]">
              <div className="border-b border-[rgba(255,255,255,0.12)] flex items-center justify-center pb-4 pt-2 px-[10px]">
                <span
                  className="text-[12px] font-semibold uppercase tracking-[1.8px] text-[#c9a96e] whitespace-nowrap"
                  style={SANS}
                >
                  {t("resultsLabel")}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-4 pt-6 px-6">
                <div className="border border-[rgba(255,255,255,0.12)] flex flex-wrap md:flex-nowrap items-stretch divide-y md:divide-y-0 divide-[rgba(255,255,255,0.12)]">
                  {caso.stats
                    .map((value, n) => ({ value, label: t(`stat${n + 1}Label`) }))
                    .map((s, i, arr) => (
                    <div key={i} className="flex flex-1 items-stretch w-full md:w-auto">
                      <StatCell value={s.value} label={s.label} />
                      {i < arr.length - 1 && (
                        <div className="hidden md:block w-px self-stretch bg-[rgba(255,255,255,0.12)]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.35)] to-transparent my-2" />

                <div className="flex-1 flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-6 pb-6">
                  <div className="flex flex-col gap-3 items-start w-full md:flex-1 md:min-w-0">
                    <h4
                      className="text-[24px] font-semibold leading-[1.2] text-[#999]"
                      style={SERIF}
                    >
                      {t("col1Title")} <em className="not-italic text-[#c9a96e] italic" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>LuxMotion</em>
                    </h4>
                    <div className="flex flex-col w-full">
                      {caso.before.map((texto) => (
                        <Bullet key={texto} text={texto} />
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.35)] to-transparent" />

                  <div className="flex flex-col gap-3 items-start w-full md:flex-1 md:min-w-0">
                    <h4
                      className="text-[24px] font-semibold leading-[1.2] text-[#c9a96e]"
                      style={SERIF}
                    >
                      {t("col2Title")}
                    </h4>
                    <div className="flex flex-col w-full">
                      {caso.impl.map((texto) => (
                        <Bullet key={texto} text={texto} />
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.35)] to-transparent" />

                  <div className="flex flex-col gap-3 items-start w-full md:flex-1 md:min-w-0">
                    <h4
                      className="text-[24px] font-semibold leading-[1.2]"
                      style={SERIF}
                    >
                      <span className="text-white">{t("col3TitleStart")} </span>
                      <span className="text-[#c9a96e]">{t("col3TitleAccent")}</span>
                    </h4>
                    <div className="flex flex-col w-full">
                      {caso.exp.map((texto) => (
                        <Bullet key={texto} text={texto} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.12)] flex items-center justify-center pb-4 pt-2 px-[10px]">
                <span
                  className="text-[12px] font-semibold uppercase tracking-[1.8px] text-[#c9a96e] text-center"
                  style={SANS}
                >
                  <span className="text-[#696969]">{t("footerStart")}</span>
                  <span> {caso.footerEnd}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Setas e pontos estavam desenhados mas mortos: sem estado, sem
              onClick, e com três pontos fixos independentemente de quantos
              casos existissem. */}
          {casos.length > 1 && (
            <div className="flex gap-2 items-center justify-center w-full">
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label={t("prevAria")}
                className="w-12 h-12 border-[1.7px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#a08248] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
              {casos.map((c, i) => (
                <button
                  key={c.venueName}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-label={c.venueName}
                  aria-current={i === indice}
                  className="p-1"
                >
                  <span
                    className={cn(
                      "block w-[5px] h-[5px] rounded-full transition-colors",
                      i === indice ? "bg-[#a08248]" : "bg-[#a08248]/30",
                    )}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label={t("nextAria")}
                className="w-12 h-12 border-[1.7px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#a08248] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
