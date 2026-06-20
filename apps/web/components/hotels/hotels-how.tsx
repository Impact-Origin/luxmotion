"use client"

import { useTranslations } from "next-intl"

const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const G = "#C9A96E"

function StepIllustration({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 220 140" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="18" width="180" height="104" stroke={G} strokeOpacity="0.5" />
      {index === 0 && (
        <>
          <line x1="38" y1="44" x2="135" y2="44" stroke={G} strokeOpacity="0.7" strokeWidth="2" />
          <line x1="38" y1="58" x2="110" y2="58" stroke={G} strokeOpacity="0.4" strokeWidth="2" />
          <line x1="38" y1="72" x2="128" y2="72" stroke={G} strokeOpacity="0.4" strokeWidth="2" />
          <circle cx="165" cy="50" r="13" stroke={G} />
          <path d="M159 50l4 4 8-9" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="38" y="90" width="54" height="18" fill={G} fillOpacity="0.85" />
        </>
      )}
      {index === 1 && (
        <>
          <line x1="38" y1="42" x2="150" y2="42" stroke={G} strokeOpacity="0.7" strokeWidth="2" />
          <line x1="38" y1="56" x2="120" y2="56" stroke={G} strokeOpacity="0.4" strokeWidth="2" />
          <line x1="38" y1="70" x2="138" y2="70" stroke={G} strokeOpacity="0.4" strokeWidth="2" />
          <rect x="38" y="86" width="66" height="22" stroke={G} strokeOpacity="0.8" />
          <path d="M50 97l5 5 9-10" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {index === 2 && (
        <>
          <polyline points="38,100 64,78 86,86 108,58 130,66 152,42 182,52" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[[38, 100], [64, 78], [86, 86], [108, 58], [130, 66], [152, 42], [182, 52]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={G} />
          ))}
          <text x="180" y="40" fontSize="14" fill={G} style={serif}>€</text>
        </>
      )}
    </svg>
  )
}

export function HotelsHow() {
  const t = useTranslations("hotels.how")
  const steps = t.raw("steps") as { title: string; body: string }[]

  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]">
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h2 className="text-[40px] leading-none text-[#f5f5f5] md:text-[52px]" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h2>
          <p className="max-w-[720px] text-[16px] leading-[1.4] text-white/55 md:text-[18px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="border border-[rgba(201,169,110,0.08)]">
          <div className="grid grid-cols-1 gap-px bg-[rgba(255,255,255,0.08)] md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group flex cursor-default flex-col bg-[#1a1a1a] transition-all duration-300 ease-out hover:bg-[#222222] hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] hover:ring-1 hover:ring-inset hover:ring-[rgba(201,169,110,0.22)]"
              >
                <div className="flex flex-col gap-6 px-7 pb-9 pt-7 md:px-8">
                  <span className="flex h-10 w-10 items-center justify-center border border-[rgba(201,169,110,0.5)] text-[17px] text-[#C9A96E]" style={serif}>
                    0{i + 1}
                  </span>
                  <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                    <StepIllustration index={i} />
                  </div>
                </div>
                <div className="border-t border-[rgba(255,255,255,0.08)] px-7 py-6 md:px-8">
                  <h3 className="font-sans text-[15px] font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 font-sans text-[13px] leading-[1.45] text-[#999]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div
          className="relative mx-auto mt-16 max-w-[920px] overflow-hidden border border-[rgba(201,169,110,0.14)] px-8 py-12 lg:px-16 lg:py-14"
          style={{
            background:
              "radial-gradient(120% 100% at 50% -10%, rgba(201,169,110,0.10), transparent 55%), radial-gradient(90% 120% at 100% 100%, rgba(201,169,110,0.05), transparent 50%), #131210",
          }}
        >
          <span aria-hidden className="absolute left-1/2 top-0 h-[3px] w-20 -translate-x-1/2 bg-[#C9A96E]" />
          <span aria-hidden className="absolute left-8 top-7 text-[60px] leading-none text-[#C9A96E] lg:left-12" style={serif}>
            &ldquo;
          </span>
          <p className="mx-auto max-w-[760px] text-center text-[22px] italic leading-[1.5] text-white/90 md:text-[26px]" style={serif}>
            {t("quote")}
          </p>
          <span aria-hidden className="absolute bottom-12 right-8 text-[60px] leading-none text-[#C9A96E] lg:right-12" style={serif}>
            &rdquo;
          </span>
          <div className="mt-8 text-center">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[2px] text-white">{t("quoteRole")}</p>
            <p className="mt-1 font-sans text-[11px] uppercase tracking-[2px] text-[#C9A96E]">{t("quoteCompany")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
