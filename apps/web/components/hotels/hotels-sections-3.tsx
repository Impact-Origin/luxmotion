"use client"

import { useTranslations } from "next-intl"
import { Car, Sparkles, LayoutDashboard, Check } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-2">
        <span className="h-px w-7 bg-[#C9A96E]" />
        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{eyebrow}</span>
        <span className="h-px w-7 bg-[#C9A96E]" />
      </div>
      <h2 className="max-w-[760px] text-[36px] leading-[1.1] text-white sm:text-[44px]" style={serif}>{title}</h2>
      {subtitle && <p className="max-w-[640px] text-[15px] leading-[1.55] text-[#9a9a9a]" style={sans}>{subtitle}</p>}
    </div>
  )
}

const VERTENTE_ICONS = [Car, Sparkles, LayoutDashboard]

export function HotelsVertente() {
  const t = useTranslations("hotels.vertente")
  const items = t.raw("items") as { title: string; body: string }[]
  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((it, i) => {
            const Icon = VERTENTE_ICONS[i % VERTENTE_ICONS.length] ?? Car
            return (
              <div key={it.title} className="group flex flex-col gap-4 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-8 transition-colors hover:border-[rgba(201,169,110,0.4)] hover:bg-[rgba(201,169,110,0.04)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(201,169,110,0.3)] text-[#C9A96E] transition-colors group-hover:bg-[rgba(201,169,110,0.1)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-[22px] text-white" style={serif}>{it.title}</h3>
                <p className="text-[14px] leading-[1.6] text-[#9a9a9a]" style={sans}>{it.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function DashMockup({ variant }: { variant: number }) {
  return (
    <div className="relative w-full overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#121009] p-6">
      <span aria-hidden className="absolute right-0 top-0 h-20 w-20 bg-[radial-gradient(circle_at_top_right,rgba(201,169,110,0.18),transparent_70%)]" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#C9A96E]/70" />
        <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.18)]" />
        <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.18)]" />
        <span className="ml-2 h-2 w-24 rounded bg-[rgba(255,255,255,0.1)]" />
      </div>
      {variant === 1 ? (
        <div className="mt-6 space-y-3">
          <div className="h-2.5 w-1/3 rounded bg-[rgba(201,169,110,0.45)]" />
          <div className="h-10 w-full rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-9 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
            <div className="h-9 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
            <div className="h-9 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          </div>
          <div className="h-10 w-full rounded bg-[#C9A96E]/85" />
        </div>
      ) : variant === 2 ? (
        <div className="mt-6 space-y-3">
          {[70, 45, 88, 60].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="h-7 w-7 shrink-0 rounded-full bg-[rgba(201,169,110,0.2)]" />
              <div className="h-3 rounded bg-[rgba(255,255,255,0.08)]" style={{ width: `${w}%` }} />
              <span className="ml-auto h-3 w-10 rounded bg-[rgba(201,169,110,0.35)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3">
              <div className="h-2 w-2/3 rounded bg-[rgba(201,169,110,0.4)]" />
              <div className="h-6 w-1/2 rounded bg-[rgba(255,255,255,0.1)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function HotelsDashboards() {
  const t = useTranslations("hotels.dashboards")
  const rows = t.raw("rows") as { tag: string; title: string; accent: string; body: string; points: string[] }[]
  return (
    <section className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-16 flex flex-col gap-20">
          {rows.map((r, i) => {
            const textFirst = i % 2 === 0
            const text = (
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{r.tag}</span>
                <h3 className="text-[30px] leading-[1.12] text-white sm:text-[34px]" style={serif}>
                  {r.title} <span className="italic text-[#C9A96E]">{r.accent}</span>
                </h3>
                <p className="max-w-[460px] text-[15px] leading-[1.6] text-[#9a9a9a]" style={sans}>{r.body}</p>
                <ul className="mt-1 flex flex-col gap-2.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-[#bdb7ad]" style={sans}>
                      <Check className="h-4 w-4 shrink-0 text-[#C9A96E]" strokeWidth={2} />{p}
                    </li>
                  ))}
                </ul>
              </div>
            )
            return (
              <div key={i} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                {textFirst ? (
                  <>{text}<DashMockup variant={i + 1} /></>
                ) : (
                  <>
                    <div className="order-2 lg:order-1"><DashMockup variant={i + 1} /></div>
                    <div className="order-1 lg:order-2">{text}</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
