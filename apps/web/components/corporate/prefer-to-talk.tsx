import { useTranslations } from "next-intl"
import { Phone, Calendar, ArrowRight, type LucideIcon } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const WHATSAPP_HREF = "https://wa.me/351963650278"
const PHONE = "+351 963 650 278"
const PHONE_HREF = "tel:+351963650278"
const SCHEDULE_HREF = "/corporate/contact#request-quote"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

type Card = {
  key: string
  href: string
  external?: boolean
  icon: LucideIcon
  customIcon?: typeof WhatsAppIcon
  cta: string
}

function ChannelCard({ card }: { card: Card }) {
  const t = useTranslations("corporatePage.contact.preferToTalk")
  const Icon = card.icon

  return (
    <a
      href={card.href}
      target={card.external ? "_blank" : undefined}
      rel={card.external ? "noopener noreferrer" : undefined}
      className="group flex flex-col items-start gap-[15px] border border-[rgba(255,255,255,0.12)] px-6 py-8 transition-colors hover:border-[rgba(201,169,110,0.4)] md:px-9 md:py-10"
    >
      <div className="flex size-10 items-center justify-center border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.08)]">
        {card.customIcon ? (
          <card.customIcon className="size-[18px] text-[#C9A96E]" />
        ) : (
          <Icon className="size-[18px] text-[#C9A96E]" strokeWidth={1.6} />
        )}
      </div>

      <p
        className="text-[10px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
        style={sans}
      >
        {t(`${card.key}.tag`)}
      </p>

      <h3 className="text-[24px] font-semibold leading-none text-white" style={serif}>
        {t(`${card.key}.title`)}
      </h3>

      <p className="text-[14px] leading-[1.3] text-[#999]" style={sans}>
        {t(`${card.key}.body`)}
      </p>

      <span
        className="mt-auto inline-flex items-center gap-2 text-[12px] font-semibold tracking-[1.2px] text-[#C9A96E]"
        style={sans}
      >
        {card.cta}
        <ArrowRight className="size-[13px] transition-transform group-hover:translate-x-1" strokeWidth={2} />
      </span>
    </a>
  )
}

export function PreferToTalk() {
  const t = useTranslations("corporatePage.contact.preferToTalk")

  const cards: Card[] = [
    { key: "whatsapp", href: WHATSAPP_HREF, external: true, icon: Phone, customIcon: WhatsAppIcon, cta: t("whatsapp.cta") },
    { key: "phone", href: PHONE_HREF, icon: Phone, cta: `${PHONE}  →` },
    { key: "schedule", href: SCHEDULE_HREF, icon: Calendar, cta: t("schedule.cta") },
  ]

  return (
    <section className="w-full bg-[#0D0D0D] px-4 py-12 md:px-[82px] md:py-[60px] 2xl:px-[300px]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 max-w-[82px] bg-[#C9A96E]" />
            <p
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
              style={sans}
            >
              {t("eyebrow")}
            </p>
          </div>

          <h2 className="text-[40px] leading-none text-[#F5F5F5] md:text-[48px]" style={serif}>
            {t("titleLine1")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>?
          </h2>

          <p className="max-w-[752px] text-[18px] leading-[1.3] text-[#999]" style={sans}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-[2px] md:grid-cols-3">
          {cards.map((card) => (
            <ChannelCard key={card.key} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
