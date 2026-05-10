"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Lock } from "lucide-react"
import { useTranslations } from "next-intl"

const BADGES = [
  { src: "/footer/badges/clean-safe.png", alt: "Clean & Safe" },
  { src: "/footer/badges/scoring-top5.png", alt: "Scoring Top 5%" },
  { src: "/footer/badges/pme.png", alt: "PME Líder" },
  { src: "/footer/badges/tripadvisor-choice.svg", alt: "Tripadvisor Travelers' Choice" },
  { src: "/footer/badges/tripadvisor-top3.svg", alt: "Tripadvisor Top 3" },
  { src: "/footer/badges/turismo-portugal.png", alt: "Turismo de Portugal" },
  { src: "/footer/badges/rnvat.svg", alt: "RNVAT 8510" },
  { src: "/footer/badges/livro-reclamacoes.png", alt: "Livro de Reclamações" },
]

const PAYMENTS = [
  { src: "/footer/payments/visa.svg", alt: "Visa", w: 48, h: 16 },
  { src: "/footer/payments/mastercard.svg", alt: "Mastercard", w: 40, h: 24 },
  { src: "/footer/payments/mbway.svg", alt: "MB WAY", w: 42, h: 20 },
  { src: "/footer/payments/multibanco.svg", alt: "Multibanco", w: 57, h: 20 },
  { src: "/footer/payments/paypal.svg", alt: "PayPal", w: 67, h: 16 },
]

const SOCIALS = [
  { href: "https://www.facebook.com/luxmotioneasytransferportugal/", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/luxmotion.tours/", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com/company/luxmotion-easytransferportugal/", icon: Linkedin, label: "LinkedIn" },
]

export function Footer() {
  const t = useTranslations("footer")
  const r = useTranslations("footer.redesign")

  return (
    <footer className="bg-[#0D0D0D] pt-8 px-4 md:px-[82px] border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="border-b border-[rgba(255,255,255,0.05)] pb-11 grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr_1fr] gap-10 md:gap-[60px]">
          <BrandColumn tagline1={r("tagline1")} tagline2={r("tagline2")} />

          <NavColumn
            title={t("navigation")}
            links={[
              { href: "/", label: t("home") },
              { href: "/about-us", label: t("aboutUs") },
              { href: "/#services", label: t("services") },
              { href: "/fleet", label: t("fleet") },
              { href: "/#reviews", label: t("whoTrustsUs") },
            ]}
          />

          <NavColumn
            title={t("usefulLinks")}
            links={[
              { href: "/faqs", label: t("faqs") },
              { href: "/terms-and-conditions", label: t("termsAndConditions") },
              { href: "/refund", label: t("refund") },
              { href: "/privacy-policy", label: t("privacyPolicy") },
              { href: "/#payment-methods", label: t("paymentMethods") },
              { href: "https://www.centroarbitragemlisboa.pt/", label: t("arbitrationCenter"), external: true },
              { href: "https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/resolve-your-consumer-complaint/alternative-dispute-resolution-consumers_en", label: t("alternativeDispute"), external: true },
            ]}
          />

          <SupportColumn followLabel={r("follow")} />
        </div>

        <div className="border-b border-[rgba(255,255,255,0.05)] py-6 flex flex-wrap items-center gap-[10px]">
          <span
            className="text-[12px] tracking-[1.62px] uppercase text-[#999] font-semibold pr-2"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {r("acceptedPayments")}
          </span>
          <div className="w-px h-[22px] bg-[rgba(255,255,255,0.06)]" />
          {PAYMENTS.map((p) => (
            <div
              key={p.alt}
              className="h-[34px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[3px] opacity-55 flex items-center justify-center px-[15px]"
            >
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className="object-contain" />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-5 pb-8 gap-2">
          <span
            className="text-[11px] text-[#999] tracking-[0.44px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {r("copyright")}
          </span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-[10px] h-[11px] text-[#999]" />
            <span
              className="text-[10px] text-[#999] tracking-[0.44px]"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {r("securePayments")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function BrandColumn({ tagline1, tagline2 }: { tagline1: string; tagline2: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-[13px]">
        <div className="flex items-center gap-3">
          <div className="size-[41px] border-[1.7px] border-[#C9A96E] flex items-center justify-center">
            <Image src="/footer/logo-lm.svg" alt="LM" width={20} height={11} />
          </div>
          <div className="flex flex-col">
            <Image src="/footer/logo-luxmotion.svg" alt="LuxMotion" width={73} height={8} />
            <span
              className="text-[6.4px] text-[#999] tracking-[0.9px] mt-1"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              BY EASYTRANSFER
            </span>
          </div>
        </div>
        <div className="max-w-[260px]">
          <p
            className="text-[12px] leading-[1.3] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {tagline1}
            <br />
            {tagline2}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-3 max-w-[341px]">
        {BADGES.map((badge) => (
          <div
            key={badge.alt}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] h-[52px] flex items-center justify-center px-[11px]"
          >
            <Image
              src={badge.src}
              alt={badge.alt}
              width={40}
              height={40}
              className="object-contain max-h-[36px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function NavColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ href: string; label: string; external?: boolean }>
}) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-[12px] tracking-[1.8px] uppercase text-[#C9A96E] font-semibold"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {title}
      </span>
      <nav className="flex flex-col gap-[10px]">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#999] hover:text-white transition-colors leading-[1.3]"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] text-[#999] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}

function SupportColumn({ followLabel }: { followLabel: string }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-4">
        <span
          className="text-[12px] tracking-[1.8px] uppercase text-[#C9A96E] font-semibold"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Support
        </span>
        <div
          className="flex flex-col gap-2"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          <a href="tel:+351963650278" className="text-[12px] text-[#999] hover:text-white transition-colors">
            +351 963 650 278
          </a>
          <a href="mailto:geral@easytransferportugal.com" className="text-[11px] text-[#999] hover:text-white transition-colors">
            geral@easytransferportugal.com
          </a>
          <span className="text-[12px] text-[#999]">
            Ericeira Business Factory, Portugal
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-[10px]">
        <span
          className="text-[12px] tracking-[1.8px] uppercase text-[#C9A96E] font-semibold"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {followLabel}
        </span>
        <div className="flex items-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#999] hover:text-[#C9A96E] transition-colors"
              aria-label={s.label}
            >
              <s.icon className="w-7 h-7" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
