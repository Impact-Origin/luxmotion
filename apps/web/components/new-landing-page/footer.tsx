"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="bg-[rgba(217,217,217,0.18)] border-t border-[#dedede]">
      <div className="hidden lg:block py-[60px] px-[60px] xl:px-[140px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <div className="flex flex-col gap-6 w-[260px]">
              <Image
                src="/svgs/easytransfer-logo.svg"
                alt="EasyTransfer"
                width={200}
                height={33}
                className="object-contain"
              />

              <Image
                src="/footer_badges_desktop.png"
                alt="Certifications and Badges"
                width={240}
                height={220}
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px] text-black">
                {t("navigation")}
              </h3>
              <nav className="flex flex-col gap-[14px]">
                <Link href="/" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("home")}
                </Link>
                <Link href="/about-us" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("aboutUs")}
                </Link>
                <Link href="/#services" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("services")}
                </Link>
                <Link href="/fleet" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("fleet")}
                </Link>
                <Link href="/#reviews" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("whoTrustsUs")}
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px] text-black">
                {t("usefulLinks")}
              </h3>
              <nav className="flex flex-col gap-[14px]">
                <Link href="/faqs" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("faqs")}
                </Link>
                <Link href="/terms-and-conditions" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("termsAndConditions")}
                </Link>
                <Link href="/refund" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("refund")}
                </Link>
                <Link href="/privacy-policy" className="text-[14px] text-black/70 hover:text-black transition-colors">
                  {t("privacyPolicy")}
                </Link>
                <Link 
                  href="/#payment-methods" 
                  className="text-[14px] text-black/70 hover:text-black transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById("payment-methods")
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" })
                    } else {
                      window.location.href = "/#payment-methods"
                    }
                  }}
                >
                  {t("paymentMethods")}
                </Link>
                <a 
                  href="https://www.centroarbitragemlisboa.pt/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-black/70 hover:text-black transition-colors"
                >
                  {t("arbitrationCenter")}
                </a>
                <a 
                  href="https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/resolve-your-consumer-complaint/alternative-dispute-resolution-consumers_en" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-black/70 hover:text-black transition-colors leading-[1.3]"
                >
                  {t("alternativeDispute")}
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px] text-black">
                {t("support")}
              </h3>
              <div className="flex flex-col gap-[14px]">
                <div>
                  <p className="text-[14px] text-black/70">{t("phones")}</p>
                  <a href="tel:+351963650278" className="text-[14px] text-black/70 hover:text-black transition-colors">
                    +351 963 650 278
                  </a>
                </div>
                <div>
                  <p className="text-[14px] text-black/70">{t("email")}</p>
                  <a href="mailto:geral@easytransferericeira.com" className="text-[14px] text-black/70 hover:text-black transition-colors">
                    geral@easytransferericeira.com
                  </a>
                </div>
                <div className="flex items-center gap-[19px] mt-2">
                  <a
                    href="https://www.facebook.com/luxmotioneasytransferportugal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="text-black" />
                  </a>
                  <a
                    href="https://www.instagram.com/luxmotion.tours/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="text-black" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/luxmotion-easytransferportugal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="text-black" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-[10px] text-[#b9b9b9]">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex flex-col items-center gap-4 px-4 pt-4 pb-6">
        <Image
          src="/svgs/easytransfer-logo.svg"
          alt="EasyTransfer"
          width={200}
          height={33}
          className="object-contain"
        />

        <Image
          src="/footer_badges_mobile.png"
          alt="Certifications and Badges"
          width={343}
          height={180}
          className="object-contain"
        />

        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-extrabold text-[18px] text-black">
              {t("navigation")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("home")}
              </Link>
              <Link href="/about-us" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("aboutUs")}
              </Link>
              <Link href="/booking" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("services")}
              </Link>
              <Link href="/fleet" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("fleet")}
              </Link>
              <Link href="/#reviews" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("whoTrustsUs")}
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-extrabold text-[18px] text-black">
              {t("usefulLinks")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/faqs" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("faqs")}
              </Link>
              <Link href="/terms-and-conditions" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("termsAndConditions")}
              </Link>
              <Link href="/refund" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("refund")}
              </Link>
              <Link href="/privacy-policy" className="text-[14px] text-black/70 hover:text-black transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link 
                href="/#payment-methods" 
                className="text-[14px] text-black/70 hover:text-black transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById("payment-methods")
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                  } else {
                    window.location.href = "/#payment-methods"
                  }
                }}
              >
                {t("paymentMethods")}
              </Link>
              <a 
                href="https://www.centroarbitragemlisboa.pt/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-black/70 hover:text-black transition-colors"
              >
                {t("arbitrationCenter")}
              </a>
              <a 
                href="https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/resolve-your-consumer-complaint/alternative-dispute-resolution-consumers_en" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-black/70 hover:text-black transition-colors leading-[1.3]"
              >
                {t("alternativeDispute")}
              </a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <h3 className="font-extrabold text-[18px] text-black">
            {t("support")}
          </h3>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-[14px] font-bold text-black/70">{t("phones")}</p>
              <a href="tel:+351963650278" className="text-[14px] text-black/70 hover:text-black transition-colors">
                +351 963 650 278
              </a>
            </div>
            <div>
              <p className="text-[14px] font-bold text-black/70">{t("email")}</p>
              <a href="mailto:geral@easytransferericeira.com" className="text-[14px] text-black/70 hover:text-black transition-colors">
                geral@easytransferericeira.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-[19px]">
            <a
              href="https://www.facebook.com/luxmotioneasytransferportugal/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Facebook"
            >
              <FacebookIcon className="text-black" />
            </a>
            <a
              href="https://www.instagram.com/luxmotion.tours/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Instagram"
            >
              <InstagramIcon className="text-black" />
            </a>
            <a
              href="https://www.linkedin.com/company/luxmotion-easytransferportugal/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="text-black" />
            </a>
          </div>
        </div>

        <p className="text-[12px] text-[#b9b9b9] text-center mt-2">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
