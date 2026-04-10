"use client"

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function CheckoutFooter() {
  const t = useTranslations("footer")

  return (
    <footer
      className="checkout-footer py-12 px-4"
      style={{ backgroundColor: "var(--theme-checkout-footer-bg, #27C7FF)" }}
    >
      <div className="min-[2100px]:max-w-[120rem] max-w-[95rem] mx-auto">
        <div className="flex flex-col lg:flex-row gap-32 items-start justify-between mb-8">
          <div className="flex-shrink-0">
            <Image
              src="/footer-badges.png"
              alt="Certifications and Badges"
              width={480}
              height={160}
              className="object-contain"
            />
          </div>

          <div className="flex-shrink-0">
            <h3
              className="text-3xl font-bold mb-8"
              style={{ color: "var(--theme-checkout-footer-heading-text, #003554)" }}
            >
              {t("contact")}
            </h3>

            <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
              <div>
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--theme-checkout-footer-label-text, #003554)" }}
                >
                  {t("socialNetworks")}
                </p>
                <div className="flex gap-4">
                  <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                    <Facebook
                      className="size-9 rounded-full p-1"
                      style={{
                        backgroundColor: "var(--theme-checkout-footer-social-icon-bg, #222222)",
                        color: "var(--theme-checkout-footer-social-icon-color, #27C7FF)",
                        fill: "var(--theme-checkout-footer-social-icon-color, #27C7FF)"
                      }}
                    />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
                    <Twitter
                      className="size-10 rounded-sm p-1"
                      style={{
                        color: "var(--theme-checkout-footer-social-icon-bg, #222222)",
                        fill: "var(--theme-checkout-footer-social-icon-bg, #222222)"
                      }}
                    />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                    <Instagram
                      className="size-10 rounded-sm p-1"
                      style={{ color: "var(--theme-checkout-footer-social-icon-bg, #222222)" }}
                      strokeWidth={1.5}
                    />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                    <Linkedin
                      className="size-8 rounded-sm p-1 mt-1"
                      style={{
                        backgroundColor: "var(--theme-checkout-footer-social-icon-bg, #222222)",
                        color: "var(--theme-checkout-footer-social-icon-color, #27C7FF)",
                        fill: "var(--theme-checkout-footer-social-icon-color, #27C7FF)"
                      }}
                    />
                  </a>
                </div>
              </div>

              <div>
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--theme-checkout-footer-label-text, #003554)" }}
                >
                  {t("email")}
                </p>
                <a
                  href="mailto:geral@easytransferericeira.com"
                  className="text-base hover:underline"
                  style={{ color: "var(--theme-checkout-footer-link-text, #003554)" }}
                >
                  geral@easytransferericeira.com
                </a>
              </div>

              <div>
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--theme-checkout-footer-label-text, #003554)" }}
                >
                  {t("phones")}
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+351963650278"
                    className="text-base hover:underline whitespace-nowrap"
                    style={{ color: "var(--theme-checkout-footer-link-text, #003554)" }}
                  >
                    +351 963 650 278
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--theme-checkout-footer-copyright-text, #003554)" }}
          >
            {t("copyright", { partner: "{{Nome_partner}}", year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
