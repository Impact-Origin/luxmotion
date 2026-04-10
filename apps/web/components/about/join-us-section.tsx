"use client"

import { useTranslations } from "next-intl"
import { Handshake, CarFront } from "lucide-react"
import Link from "next/link"

const cards = [
  { icon: Handshake, labelKey: "becomePartner", href: "/partnerships" },
  { icon: CarFront, labelKey: "becomeDriver", href: "/work-with-us" },
] as const

export function JoinUsSection() {
  const t = useTranslations("aboutPage.joinUs")

  return (
    <section className="px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[36px]">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[24px] overflow-hidden px-6 md:px-12 py-[60px] md:py-[80px] flex flex-col items-center gap-6">
          <div className="absolute inset-0 bg-[#125a73]" />
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/container.png)" }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4 text-center text-white">
            <h2 className="text-[32px] md:text-[40px] font-bold leading-normal">
              {t("title")}
            </h2>
            <p className="text-[16px] md:text-[20px] font-medium leading-[1.3] max-w-[738px]">
              {t("subtitle")}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full max-w-[674px]">
            {cards.map(({ icon: Icon, labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-[10px] h-[140px] rounded-[16px] border border-[#e8e8e8] bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Icon className="size-10 text-white" />
                <span className="text-[18px] md:text-[20px] font-bold text-white leading-[1.2]">
                  {t(labelKey)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
