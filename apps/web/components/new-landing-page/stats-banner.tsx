"use client"

import { useTranslations } from "next-intl"
import { Car, Users, Leaf, MapPin } from "lucide-react"

export function StatsBanner() {
  const t = useTranslations("statsBanner")

  return (
    <section className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[#0E4659] rounded-[16px] md:rounded-[24px] lg:rounded-[32px] p-3 md:p-4 lg:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            <div className="bg-[#1A5B6E]/50 border border-[#27C7FF]/20 rounded-[10px] md:rounded-[14px] lg:rounded-[16px] px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="bg-[#27C7FF]/20 p-2 md:p-2.5 lg:p-3 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] shrink-0">
                <Car className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#27C7FF] text-[14px] md:text-[18px] lg:text-[24px] font-bold leading-tight break-words">
                  {t("transfers.number")}
                </div>
                <div className="text-[#27C7FF] text-[12px] md:text-[14px] lg:text-[18px] font-bold leading-tight break-words">
                  {t("transfers.label")}
                </div>
                <div className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] leading-tight break-words">
                  {t("transfers.sublabel")}
                </div>
              </div>
            </div>

            <div className="bg-[#1A5B6E]/50 border border-[#27C7FF]/20 rounded-[10px] md:rounded-[14px] lg:rounded-[16px] px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="bg-[#27C7FF]/20 p-2 md:p-2.5 lg:p-3 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#27C7FF] text-[14px] md:text-[18px] lg:text-[24px] font-bold leading-tight flex items-center gap-1 flex-wrap">
                  <span className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] shrink-0">+</span>
                  <span className="break-words">{t("customers.number")}</span>
                </div>
                <div className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] leading-tight break-words">
                  {t("customers.label")}
                </div>
              </div>
            </div>

            <div className="bg-[#1A5B6E]/50 border border-[#27C7FF]/20 rounded-[10px] md:rounded-[14px] lg:rounded-[16px] px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="bg-[#27C7FF]/20 p-2 md:p-2.5 lg:p-3 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] shrink-0">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#27C7FF] text-[14px] md:text-[18px] lg:text-[24px] font-bold leading-tight flex items-center gap-1 flex-wrap">
                  <span className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] shrink-0">+</span>
                  <span className="break-words">{t("co2.number")}</span>
                </div>
                <div className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] leading-tight break-words">
                  {t("co2.label")}
                </div>
              </div>
            </div>

            <div className="bg-[#1A5B6E]/50 border border-[#27C7FF]/20 rounded-[10px] md:rounded-[14px] lg:rounded-[16px] px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5 flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="bg-[#27C7FF]/20 p-2 md:p-2.5 lg:p-3 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#27C7FF] text-[14px] md:text-[18px] lg:text-[24px] font-bold leading-tight flex items-center gap-1 flex-wrap">
                  <span className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] shrink-0">+</span>
                  <span className="break-words">{t("distance.number")}</span>
                </div>
                <div className="text-[var(--lm-text,#fff)]/70 text-[10px] md:text-[12px] lg:text-[14px] leading-tight break-words">
                  {t("distance.label")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
