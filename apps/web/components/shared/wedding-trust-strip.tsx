"use client"

import Image from "next/image"
import { BadgeCheck, Star } from "lucide-react"
import { REVIEW_LINK_PROPS, TRUSTPILOT_REVIEWS_URL } from "@/lib/review-links"

/*
 * Barra de reviews das páginas de casamentos, num só componente com duas
 * paletas — o desenho é o mesmo, muda o que assenta por baixo:
 *
 *   claro  → /wedding, cuja hero é creme (#EFE8DC)
 *   escuro → /wedding-planner, cuja hero é preta com fotografia
 *
 * Antes cada página tinha a sua cópia, e a de /wedding tinha ficado a meio
 * caminho: bordas de light mode sobre superfície de dark, o que a deixava
 * lavada sobre o creme.
 */

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const MONTSERRAT = {
  fontFamily: "var(--font-montserrat), Montserrat, var(--font-sans), sans-serif",
} as const

const AVATARS = [
  { src: "/wedding/avatar-1.png", alt: "" },
  { src: "/wedding/avatar-2.png", alt: "" },
  { src: "/wedding/avatar-3.png", alt: "" },
] as const

export type WeddingTrustStripTone = "light" | "dark"

type Palette = {
  panel: string
  ink: string
  muted: string
  line: string
  pill: string
  /** O logótipo do Trustpilot tem duas versões; a clara some sobre branco. */
  trustpilot: string
}

const PALETTES: Record<WeddingTrustStripTone, Palette> = {
  light: {
    panel: "#FFFFFF",
    ink: "#1C1B18",
    muted: "#6B6862",
    line: "rgba(28,27,24,0.12)",
    pill: "rgba(28,27,24,0.05)",
    trustpilot: "/trustpilot-logo-dark.svg",
  },
  dark: {
    panel: "rgba(255,255,255,0.06)",
    ink: "#FFFFFF",
    muted: "rgba(255,255,255,0.45)",
    line: "rgba(255,255,255,0.12)",
    pill: "rgba(255,255,255,0.06)",
    trustpilot: "/wedding-planner/trustpilot.svg",
  },
}

export type WeddingTrustStripLabels = {
  excellent: string
  verifiedBy: string
  fromReviews: string
  poweredBy: string
}

function Excellent({
  excellent,
  verifiedBy,
  p,
}: {
  excellent: string
  verifiedBy: string
  p: Palette
}) {
  return (
    <div className="flex shrink-0 flex-col gap-2">
      <span
        className="whitespace-nowrap text-[14px] font-bold leading-none"
        style={{ ...MONTSERRAT, color: p.ink }}
      >
        {excellent}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        <BadgeCheck className="size-4 shrink-0 text-[#00B67A]" strokeWidth={2.2} />
        <span
          className="shrink-0 whitespace-nowrap text-[13px]"
          style={{ color: p.muted }}
        >
          {verifiedBy}
        </span>
        <a
          href={TRUSTPILOT_REVIEWS_URL}
          {...REVIEW_LINK_PROPS}
          aria-label="Trustpilot"
          className="shrink-0 transition-opacity hover:opacity-70"
        >
          <Image
            src={p.trustpilot}
            alt="Trustpilot"
            width={68}
            height={19}
            className="h-[18px] w-[68px] shrink-0"
          />
        </a>
      </div>
    </div>
  )
}

function Reviews({ fromReviews, p }: { fromReviews: string; p: Palette }) {
  return (
    <div
      className="flex shrink-0 items-center gap-[17px] rounded-full py-2 pl-2 pr-4"
      style={{ background: p.pill }}
    >
      <div className="relative h-10 w-[104px] shrink-0">
        {AVATARS.map((a, i) => (
          <span
            key={a.src}
            className="absolute top-0 size-10 overflow-hidden rounded-full border border-white"
            style={{ left: `${3 + i * 30.5}px` }}
          >
            <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="40px" />
          </span>
        ))}
      </div>
      <div className="flex shrink-0 flex-col justify-center gap-[2px]">
        <span
          className="whitespace-nowrap text-[14px] leading-[19.5px]"
          style={{ color: p.muted }}
        >
          {fromReviews}
        </span>
        <div className="flex shrink-0 items-center gap-[2px]">
          <span className="text-[14px] leading-[19.5px]" style={{ color: p.ink }}>
            4.9
          </span>
          <span className="whitespace-nowrap text-[12px] leading-[16.5px] tracking-[0.33px] text-[#00B67A]">
            ★★★★★
          </span>
        </div>
      </div>
    </div>
  )
}

function Powered({ poweredBy, p }: { poweredBy: string; p: Palette }) {
  return (
    <div className="flex h-full shrink-0 flex-col justify-center gap-2">
      <span
        className="whitespace-nowrap text-[14px] leading-[19.5px]"
        style={{ color: p.muted }}
      >
        {poweredBy}
      </span>
      <div className="flex shrink-0 items-center">
        <Image
          src="/wedding/google-g.svg"
          alt="Google"
          width={15}
          height={15}
          className="mr-[1px] size-[14.5px] shrink-0 object-contain"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className="size-[17.5px] shrink-0 text-[#FBBC05]"
            fill="#FBBC05"
            strokeWidth={0}
          />
        ))}
      </div>
    </div>
  )
}

/** Versão de desktop: uma linha, largura do conteúdo. */
export function WeddingTrustStrip({
  labels,
  tone = "light",
}: {
  labels: WeddingTrustStripLabels
  tone?: WeddingTrustStripTone
}) {
  const p = PALETTES[tone]
  return (
    <div
      className="hidden h-[70px] w-max shrink-0 items-center gap-3 border px-4 py-3 md:flex"
      style={{ ...SANS_FONT, background: p.panel, borderColor: p.line }}
    >
      <Excellent excellent={labels.excellent} verifiedBy={labels.verifiedBy} p={p} />
      <Reviews fromReviews={labels.fromReviews} p={p} />
      <div className="h-full w-px shrink-0" style={{ background: p.line }} />
      <Powered poweredBy={labels.poweredBy} p={p} />
    </div>
  )
}

/** Versão de telemóvel: empilhada, para os blocos não encolherem até ilegíveis. */
export function WeddingTrustStripMobile({
  labels,
  tone = "light",
}: {
  labels: WeddingTrustStripLabels
  tone?: WeddingTrustStripTone
}) {
  const p = PALETTES[tone]
  return (
    <div
      className="flex w-full flex-col gap-3 border px-4 py-4 md:hidden"
      style={{ ...SANS_FONT, background: p.panel, borderColor: p.line }}
    >
      <Excellent excellent={labels.excellent} verifiedBy={labels.verifiedBy} p={p} />
      <Reviews fromReviews={labels.fromReviews} p={p} />
      <div className="h-px w-full" style={{ background: p.line }} />
      <Powered poweredBy={labels.poweredBy} p={p} />
    </div>
  )
}
