import Image from "next/image"
import { useTranslations } from "next-intl"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function ContactHero() {
  const t = useTranslations("corporatePage.contact.hero")

  return (
    <section className="relative flex h-[500px] w-full items-center justify-center overflow-hidden px-4 py-10 md:h-[600px] md:px-[48px]">
      <Image
        src="/corporate/contact-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative flex w-full max-w-[680px] flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 min-w-[32px] max-w-[82px] bg-[#A08248]" />
          <span
            className="text-[12px] font-semibold uppercase leading-none tracking-[2px] text-[#A08248]"
            style={sans}
          >
            {t("eyebrow")}
          </span>
          <div className="h-px w-8 min-w-[32px] max-w-[82px] bg-[#A08248]" />
        </div>

        <h1 className="text-[48px] font-normal leading-none md:text-[64px]" style={serif}>
          <span className="text-white">{t("titleLine1")} </span>
          <br className="hidden md:block" />
          <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
        </h1>

        <p
          className="max-w-[592px] text-[18px] font-light leading-[1.3] text-[#999] md:font-normal"
          style={sans}
        >
          {t("subtitle")}
        </p>
      </div>
    </section>
  )
}
