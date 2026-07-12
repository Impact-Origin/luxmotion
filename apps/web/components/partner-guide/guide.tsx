"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ClientGuide } from "./client-guide"
import { PartnersGuide } from "./partners-guide"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

export function PartnerGuide({ initialTab = "clients" }: { initialTab?: "clients" | "partners" }) {
  const t = useTranslations("partnerGuide.tabs")
  const [tab, setTab] = useState<"clients" | "partners">(initialTab)

  return (
    <>
      <div className="sticky top-[calc(var(--promo-h,0px)_+_60px)] z-30 border-b border-[rgba(255,255,255,0.1)] bg-[#0D0D0D]/90 backdrop-blur lg:top-[calc(var(--promo-h,0px)_+_72px)]">
        <div className="mx-auto flex max-w-[1280px] items-stretch justify-center px-4">
          {(["clients", "partners"] as const).map((key) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative px-7 py-4 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors ${
                  active ? "text-[#C9A96E]" : "text-[#8c8680] hover:text-white"
                }`}
                style={sans}
              >
                {active && (
                  <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(201,169,110,0.12), transparent 90%)" }} />
                )}
                <span className="relative">{t(key)}</span>
                {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C9A96E]" />}
              </button>
            )
          })}
        </div>
      </div>

      {tab === "clients" ? (
        <ClientGuide onSwitch={() => setTab("partners")} />
      ) : (
        <PartnersGuide onSwitch={() => setTab("clients")} />
      )}
    </>
  )
}
