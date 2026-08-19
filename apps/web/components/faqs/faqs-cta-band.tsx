"use client"

import { Link } from "@/i18n/navigation"
import { ArrowRight, Clock, Mail, Phone } from "lucide-react"
import { useTranslations } from "next-intl"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const PHONE = "+351 963 650 278"
const PHONE_HREF = "tel:+351963650278"
const WHATSAPP_HREF = "https://wa.me/351963650278"
const EMAIL = "geral@easytransferericeira.com"
const EMAIL_HREF = "mailto:geral@easytransferericeira.com"

interface ContactCardProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  href: string
  external?: boolean
  breakAll?: boolean
}

function ContactCard({ icon, label, value, href, external, breakAll }: ContactCardProps) {
  const Comp = external ? "a" : Link
  const props = external
    ? { href, target: "_blank", rel: "noreferrer" }
    : ({ href } as { href: string })
  return (
    <Comp
      {...(props as { href: string })}
      className="group bg-[#1E1D1B] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(201,169,110,0.3)] transition-colors flex flex-col gap-[2px] md:gap-1 items-start p-[25px] md:px-[28.8px] md:pt-[28.8px] md:pb-[52.2px] no-underline"
      style={{ color: "#FFFFFF" }}
    >
      <div className="size-10 flex items-center justify-center bg-[rgba(154,117,53,0.08)] border border-[rgba(154,117,53,0.22)] text-[#C9A96E]">
        {icon}
      </div>
      <span
        className="pt-3 text-[10px] font-medium uppercase tracking-[0.9px] text-[#9A7535]"
        style={sans}
      >
        {label}
      </span>
      <span
        className={`text-[18px] font-bold leading-none w-full ${breakAll ? "break-all" : "break-words"}`}
        style={{ ...serif, color: "#FFFFFF" }}
      >
        {value}
      </span>
    </Comp>
  )
}

export function FaqsCtaBand() {
  const t = useTranslations("faqsPage.cta")

  return (
    <section className="relative overflow-hidden bg-[#111110] px-4 md:px-[82px] py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[100px] -top-[100px] size-[400px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(154,117,53,0.06) 0%, rgba(154,117,53,0) 70%)",
        }}
      />

      <div className="relative max-w-[640px] mx-auto flex flex-col items-center gap-[14px]">
        <div className="flex items-center justify-center gap-2 w-full">
          <div className="h-px w-8 bg-[#C9A96E]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] leading-none text-[#C9A96E]"
            style={sans}
          >
            {t("eyebrow")}
          </span>
          <div className="h-px w-8 bg-[#C9A96E]" />
        </div>

        <h2
          className="text-center text-[40px] md:text-[48px] font-normal leading-[1.0083] text-white"
          style={serif}
        >
          {t("headingLead")}{" "}
          <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>{" "}
          {t("headingTrail")}
        </h2>

        <p
          className="text-center text-[18px] font-normal leading-[1.3] text-[#999] max-w-[551px]"
          style={sans}
        >
          {t("subtitle")}
        </p>

        <div className="flex flex-col md:flex-row gap-3 items-center justify-center pt-4 w-full">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noreferrer"
            className="order-2 md:order-1 inline-flex h-12 items-center justify-center gap-2 px-6 py-[9px] bg-[#A08248] hover:bg-[#8e7340] transition-colors text-white text-[14px] font-medium uppercase tracking-[1.1px] w-full md:w-auto"
            style={sans}
          >
            <span className="px-2">{t("whatsapp")}</span>
            <ArrowRight className="size-[14px]" strokeWidth={2} />
          </a>
          <Link
            href="/tours#contact"
            className="order-1 md:order-2 inline-flex h-12 items-center justify-center gap-2 px-6 py-[9px] border border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors text-[#C9A96E] text-[14px] font-medium uppercase tracking-[1.1px] w-full md:w-auto"
            style={sans}
          >
            <span className="px-2">{t("proposal")}</span>
            <ArrowRight className="size-[14px]" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-[34px] w-full">
          <ContactCard
            href={PHONE_HREF}
            external
            icon={<Phone className="size-[18px]" strokeWidth={2} />}
            label={t("phoneLabel")}
            value={PHONE}
          />
          <ContactCard
            href={EMAIL_HREF}
            external
            icon={<Mail className="size-[18px]" strokeWidth={2} />}
            label={t("emailLabel")}
            value={
              <>
                geral@<wbr />easytransferericeira.com
              </>
            }
          />
          <ContactCard
            href="/tours#contact"
            icon={<Clock className="size-[18px]" strokeWidth={2} />}
            label={t("availabilityLabel")}
            value={t("availabilityValue")}
          />
        </div>
      </div>
    </section>
  )
}
