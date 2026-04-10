"use client"

import { Facebook, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const FOOTER_GREY = "rgba(217,217,217,0.18)"

export function Footer({ variant = "default" }: { variant?: "default" | "checkout" }) {
  const t = useTranslations("footer")
  const isCheckout = variant === "checkout"

  return (
    <footer className={isCheckout ? "py-6 px-4 border-t border-[#dedede]" : "bg-[#27C7FF] py-6 px-4"} style={isCheckout ? { backgroundColor: FOOTER_GREY } : undefined}>
      <div className="min-[2100px]:max-w-[120rem] max-w-[95rem] mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-fit">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-36 xl:gap-60 items-start mb-4">
              <div className="flex-shrink-0">
                <Image
                  src="/footer-badges.png"
                  alt="Certifications and Badges"
                  width={360}
                  height={120}
                  className="object-contain"
                />
              </div>

              <div className="flex-shrink-0">
                <h3 className={`text-xl font-bold mb-4 ${isCheckout ? "text-black" : "text-[#003554]"}`}>{t("contact")}</h3>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${isCheckout ? "text-black" : "text-[#003554]"}`}>{t("socialNetworks")}</p>
                    <div className="flex gap-3 items-center">
                      <a href="https://www.facebook.com/luxmotioneasytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                        <Facebook className={`size-6 rounded-full p-1 ${isCheckout ? "text-white fill-white bg-black" : "text-[#27C7FF] fill-[#27C7FF] bg-[#222222]"}`} />
                      </a>
                      <a href="https://www.instagram.com/luxmotion.tours/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                        <Instagram className={`size-8 rounded-sm p-1 ${isCheckout ? "text-black stroke-black" : "text-[#222222]"}`} strokeWidth={2.3} />
                      </a>
                      <a href="https://www.linkedin.com/company/luxmotion-easytransferportugal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                        <Linkedin className={`size-6 rounded-sm p-1 ${isCheckout ? "text-white fill-white bg-black" : "text-[#27C7FF] fill-[#27C7FF] bg-[#222222]"}`} />
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold mb-2 ${isCheckout ? "text-black" : "text-[#003554]"}`}>{t("email")}</p>
                    <a href="mailto:geral@easytransferericeira.com" className={`text-sm hover:underline ${isCheckout ? "text-black" : "text-[#003554]"}`}>
                      geral@easytransferericeira.com
                    </a>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold mb-2 ${isCheckout ? "text-black" : "text-[#003554]"}`}>{t("phones")}</p>
                    <div className="flex flex-col gap-1">
                      <a href="tel:+351963650278" className={`text-sm hover:underline whitespace-nowrap ${isCheckout ? "text-black" : "text-[#003554]"}`}>
                        +351 963 650 278
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-t pt-3 ${isCheckout ? "border-black/20" : "border-[#003554]/20"}`}>
              <p className={`text-xs font-medium text-center ${isCheckout ? "text-black" : "text-[#003554]"}`}>
                {t("copyright", { partner: "{{Nome_partner}}", year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
