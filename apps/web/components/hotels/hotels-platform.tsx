"use client"

import { useTranslations } from "next-intl"

const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
/* Os wireframes herdam a cor do texto do <svg>, que é o dourado do tema. */
const G = "currentColor"
/* Cinzento dos rótulos dentro dos wireframes. Vai em `style` e não no atributo
   `fill=` porque var() num atributo de apresentação de SVG não é fiável em todos
   os browsers — em `style` inline é sempre substituído. */
const LABEL = { fill: "var(--lm-muted,#cfc9bf)" } as const

type Row = { eyebrow: string; title: string; accent: string; body: string[] }

function TextCell({ row }: { row: Row }) {
  return (
    <div className="flex flex-col justify-center gap-5 bg-[var(--lm-bg,#0D0D0D)] px-7 py-10 md:px-12 md:py-14">
      <span className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[2px] text-[var(--lm-accent,#C9A96E)]">
        <span className="h-px w-6 bg-[var(--lm-accent,#C9A96E)]" />
        {row.eyebrow}
      </span>
      <h3 className="text-[30px] leading-[1.12] text-[var(--lm-text,#fff)] md:text-[36px]" style={serif}>
        {row.title} <span className="italic text-[var(--lm-accent,#C9A96E)]">{row.accent}</span>
      </h3>
      <div className="flex flex-col gap-3.5">
        {row.body.map((p, i) => (
          <p key={i} className="font-sans text-[13.5px] leading-[1.55] text-[var(--lm-muted,#9a9a9a)]">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}

/* Painel dos wireframes: véu dourado sobre o fundo da secção, para continuar a
   destacar-se da célula de texto nos dois temas (areia no claro, castanho
   escuro no escuro). */
function MockupCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center bg-[rgba(var(--lm-accent-rgb,201,169,110),0.1)] p-8 md:p-12">
      <div className="w-full max-w-[420px]">{children}</div>
    </div>
  )
}

function LandingMockup() {
  return (
    <svg viewBox="0 0 380 300" fill="none" className="w-full text-[var(--lm-accent,#C9A96E)]" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="348" height="268" stroke={G} strokeOpacity="0.5" />
      <line x1="16" y1="52" x2="364" y2="52" stroke={G} strokeOpacity="0.3" />
      <circle cx="34" cy="34" r="4" fill={G} fillOpacity="0.6" />
      <circle cx="49" cy="34" r="4" fill={G} fillOpacity="0.32" />
      <circle cx="64" cy="34" r="4" fill={G} fillOpacity="0.32" />
      <rect x="84" y="25" width="215" height="18" rx="9" stroke={G} strokeOpacity="0.4" />
      {/* hero header */}
      <rect x="40" y="70" width="150" height="26" fill={G} fillOpacity="0.6" />
      <line x1="40" y1="114" x2="320" y2="114" stroke={G} strokeOpacity="0.3" strokeWidth="2" />
      <line x1="40" y1="128" x2="250" y2="128" stroke={G} strokeOpacity="0.3" strokeWidth="2" />
      {/* 3 cards: bordered image placeholder + content + gold block */}
      {[0, 1, 2].map((j) => {
        const x = 40 + j * 108
        return (
          <g key={j}>
            <rect x={x} y="152" width="92" height="110" stroke={G} strokeOpacity="0.45" />
            <rect x={x} y="152" width="92" height="60" fill="#000000" fillOpacity="0.3" stroke={G} strokeOpacity="0.4" />
            <line x1={x + 12} y1="228" x2={x + 76} y2="228" stroke={G} strokeOpacity="0.3" strokeWidth="2" />
            <line x1={x + 12} y1="238" x2={x + 56} y2="238" stroke={G} strokeOpacity="0.2" strokeWidth="2" />
            <rect x={x + 12} y="247" width="34" height="9" fill={G} fillOpacity="0.5" />
          </g>
        )
      })}
    </svg>
  )
}

function DashboardMockup() {
  const pts = "150,240 182,202 214,216 246,176 278,190 310,150 338,164"
  const dots = [[150, 240], [182, 202], [214, 216], [246, 176], [278, 190], [310, 150], [338, 164]]
  return (
    <svg viewBox="0 0 380 300" fill="none" className="w-full text-[var(--lm-accent,#C9A96E)]" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="348" height="268" stroke={G} strokeOpacity="0.5" />
      {/* sidebar */}
      <rect x="34" y="40" width="44" height="12" fill={G} fillOpacity="0.55" />
      {[80, 98, 116, 134].map((y) => (
        <line key={y} x1="34" y1={y} x2="92" y2={y} stroke={G} strokeOpacity="0.25" strokeWidth="2" />
      ))}
      <line x1="110" y1="16" x2="110" y2="284" stroke={G} strokeOpacity="0.22" />
      {/* top bar */}
      <rect x="130" y="38" width="160" height="16" stroke={G} strokeOpacity="0.35" />
      {/* stat cards */}
      {[["€3.5k", 130], ["38", 206], ["94%", 282]].map(([label, x]) => (
        <g key={String(label)}>
          <rect x={x as number} y="72" width="66" height="48" stroke={G} strokeOpacity="0.4" />
          <text x={(x as number) + 33} y="98" fontSize="16" fill={G} textAnchor="middle" style={serif}>
            {label}
          </text>
          <rect x={(x as number) + 14} y="106" width="38" height="4" fill={G} fillOpacity="0.45" />
        </g>
      ))}
      {/* chart */}
      <rect x="130" y="134" width="218" height="126" stroke={G} strokeOpacity="0.4" />
      <polyline points={pts} stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={G} />
      ))}
    </svg>
  )
}

function IntegrationMockup() {
  const bottom: [string, number, number][] = [
    ["Mews", 16, 60],
    ["CloudBeds", 88, 76],
    ["Cvent", 176, 56],
    ["Casamentos.pt", 244, 90],
    ["+", 346, 18],
  ]
  return (
    <svg viewBox="0 0 380 300" fill="none" className="w-full text-[var(--lm-accent,#C9A96E)]" xmlns="http://www.w3.org/2000/svg">
      {/* top row */}
      <rect x="20" y="78" width="96" height="56" stroke={G} strokeOpacity="0.45" />
      <text x="68" y="111" fontSize="12" style={LABEL} textAnchor="middle">PMS / CRM</text>

      <rect x="142" y="70" width="96" height="72" stroke={G} fill={G} fillOpacity="0.08" />
      <text x="190" y="101" fontSize="13" fill={G} textAnchor="middle" style={serif}>LuxMotion</text>
      <text x="190" y="118" fontSize="8.5" fill={G} fillOpacity="0.75" textAnchor="middle" letterSpacing="1.5">API LAYER</text>

      <rect x="264" y="78" width="96" height="56" stroke={G} strokeOpacity="0.45" />
      <text x="312" y="103" fontSize="11" style={LABEL} textAnchor="middle">Email white</text>
      <text x="312" y="118" fontSize="11" style={LABEL} textAnchor="middle">label</text>

      {/* arrows */}
      <path d="M118 106 H140 M134 101 l6 5 -6 5" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M240 106 H262 M256 101 l6 5 -6 5" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* branching dashed connectors */}
      <line x1="190" y1="142" x2="190" y2="170" stroke={G} strokeOpacity="0.45" strokeDasharray="4 4" />
      <line x1="46" y1="170" x2="355" y2="170" stroke={G} strokeOpacity="0.3" strokeDasharray="4 4" />
      {bottom.map(([label, x, w]) => (
        <line key={`c${label}`} x1={x + w / 2} y1="170" x2={x + w / 2} y2="196" stroke={G} strokeOpacity="0.3" strokeDasharray="4 4" />
      ))}

      {/* bottom row */}
      {bottom.map(([label, x, w]) => (
        <g key={label}>
          <rect x={x} y="196" width={w} height="44" stroke={G} strokeOpacity="0.42" />
          <text x={x + w / 2} y={label === "+" ? 222 : 222} fontSize={label === "+" ? 16 : 10.5} style={LABEL} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function HotelsPlatform() {
  const t = useTranslations("hotels.platform")
  const rows = t.raw("rows") as Row[]

  return (
    <section className="bg-[var(--lm-bg,#0D0D0D)] px-4 py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] border border-[rgba(var(--lm-accent-rgb,201,169,110),0.08)]">
        <div className="grid grid-cols-1 gap-px bg-[rgba(var(--lm-text-rgb,255,255,255),0.08)] lg:grid-cols-2">
          {rows[0] && <TextCell row={rows[0]} />}
          <MockupCell><LandingMockup /></MockupCell>
          <MockupCell><DashboardMockup /></MockupCell>
          {rows[1] && <TextCell row={rows[1]} />}
          {rows[2] && <TextCell row={rows[2]} />}
          <MockupCell><IntegrationMockup /></MockupCell>
        </div>
      </div>
    </section>
  )
}
