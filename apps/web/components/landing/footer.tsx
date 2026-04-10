"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useDynamicTheme } from "@/components/dynamic-theme-provider"
import type { CSSProperties, MouseEvent } from "react"

function FacebookIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedInIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function FooterLogo() {
  const { logoUrl } = useDynamicTheme()

  if (logoUrl) {
    return (
      <div
        data-theme-color="logoBg"
        className="relative w-[200px] h-[33px] rounded-md"
        style={{ backgroundColor: "var(--theme-logo-bg, #000000)" }}
      >
        <Image src={logoUrl} alt="Partner logo" fill className="object-contain object-left" />
      </div>
    )
  }

  return (
    <div
      data-theme-color="logoBg"
      className="w-[200px] h-[33px] rounded-md flex items-center justify-center"
      style={{ backgroundColor: "var(--theme-logo-bg, #000000)" }}
    >
      <span data-theme-color="logoText" className="text-[12px] font-bold tracking-wide" style={{ color: "var(--theme-logo-text, #ffffff)" }}>
        LOGO
      </span>
    </div>
  )
}

const TEXT_STYLE = { color: "var(--theme-link-text, #ffffff)" }

export function Footer() {
  const t = useTranslations("footer")
  const params = useParams()
  const referral = params?.referral as string | undefined
  const homePath = referral ? `/${referral}` : "/"

  const scrollToPayment = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById("payment-methods")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    window.location.href = `${homePath}#payment-methods`
  }

  return (
    <footer
      data-theme-color="footer"
      className="border-t border-white/20"
      style={{ backgroundColor: "var(--theme-footer, #0E4659)" }}
    >
      <div className="hidden lg:block py-[56px] px-[60px] xl:px-[120px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between gap-10">
            <div className="flex flex-col gap-6 w-[260px]">
              <FooterLogo />
              <Image src="/footer_badges_desktop.png" alt="Certifications and Badges" width={240} height={220} className="object-contain" />
            </div>

            <div data-theme-color="linkText" className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px]" style={TEXT_STYLE}>{t("navigation")}</h3>
              <nav className="flex flex-col gap-[14px]">
                <Link href={homePath} className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("home")}</Link>
                <Link href="/about-us" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("aboutUs")}</Link>
                <Link href="/fleet" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("fleet")}</Link>
                <Link href={`${homePath}#reviews`} className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("whoTrustsUs")}</Link>
              </nav>
            </div>

            <div data-theme-color="linkText" className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px]" style={TEXT_STYLE}>{t("usefulLinks")}</h3>
              <nav className="flex flex-col gap-[14px]">
                <Link href="/faqs" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("faqs")}</Link>
                <Link href="/terms-and-conditions" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("termsAndConditions")}</Link>
                <Link href="/refund" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("refund")}</Link>
                <Link href="/privacy-policy" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("privacyPolicy")}</Link>
                <a href={`${homePath}#payment-methods`} onClick={scrollToPayment} className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("paymentMethods")}</a>
              </nav>
            </div>

            <div data-theme-color="linkText" className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px]" style={TEXT_STYLE}>{t("support")}</h3>
              <div className="flex flex-col gap-[14px]">
                <div>
                  <p className="text-[14px]" style={TEXT_STYLE}>{t("phones")}</p>
                  <a href="tel:+351963650278" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>+351 963 650 278</a>
                </div>
                <div>
                  <p className="text-[14px]" style={TEXT_STYLE}>{t("email")}</p>
                  <a href="mailto:geral@easytransferericeira.com" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>
                    geral@easytransferericeira.com
                  </a>
                </div>
                <div className="flex items-center gap-[14px] mt-2">
                  <a href="https://www.facebook.com/luxmotioneasytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                    <FacebookIcon className="p-1 rounded-full" style={TEXT_STYLE} />
                  </a>
                  <a href="https://www.instagram.com/luxmotion.tours/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                    <InstagramIcon className="p-1 rounded-sm" style={TEXT_STYLE} />
                  </a>
                  <a href="https://www.linkedin.com/company/luxmotion-easytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                    <LinkedInIcon className="p-1 rounded-sm" style={TEXT_STYLE} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div data-theme-color="linkText" className="text-center mt-10 border-t border-white/20 pt-4">
            <p className="text-[10px] opacity-90" style={TEXT_STYLE}>{t("copyright", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex flex-col items-center gap-4 px-4 pt-4 pb-6">
        <FooterLogo />
        <Image src="/footer_badges_mobile.png" alt="Certifications and Badges" width={343} height={180} className="object-contain" />

        <div data-theme-color="linkText" className="w-full space-y-4">
          <div className="space-y-2">
            <h3 className="font-extrabold text-[18px]" style={TEXT_STYLE}>{t("navigation")}</h3>
            <div className="flex flex-col gap-1">
              <Link href={homePath} className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("home")}</Link>
              <Link href="/about-us" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("aboutUs")}</Link>
              <Link href="/fleet" className="text-[14px] hover:opacity-80 transition-opacity" style={TEXT_STYLE}>{t("fleet")}</Link>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-[18px]" style={TEXT_STYLE}>{t("support")}</h3>
            <p className="text-[14px]" style={TEXT_STYLE}>{t("phones")}: +351 963 650 278</p>
            <a href="mailto:geral@easytransferericeira.com" className="text-[14px] block hover:opacity-80 transition-opacity" style={TEXT_STYLE}>
              geral@easytransferericeira.com
            </a>
          </div>
        </div>

        <div data-theme-color="linkText" className="flex items-center gap-[14px]">
          <a href="https://www.facebook.com/luxmotioneasytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
            <FacebookIcon className="p-1 rounded-full" style={TEXT_STYLE} />
          </a>
          <a href="https://www.instagram.com/luxmotion.tours/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
            <InstagramIcon className="p-1 rounded-sm" style={TEXT_STYLE} />
          </a>
          <a href="https://www.linkedin.com/company/luxmotion-easytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
            <LinkedInIcon className="p-1 rounded-sm" style={TEXT_STYLE} />
          </a>
        </div>

        <p data-theme-color="linkText" className="text-[12px] text-center opacity-90 mt-2" style={TEXT_STYLE}>
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
