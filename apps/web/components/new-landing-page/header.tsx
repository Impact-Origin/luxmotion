"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X, Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useLocale } from "next-intl"
import { locales, localeNames, localeCountryIso, type Locale } from "@/i18n/config"
import { FlagImage } from "react-international-phone"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

const HERO_SCROLL_THRESHOLD = 320
const MOBILE_MAX_WIDTH = 767

export interface HeaderProps {
  transparentOverHero?: boolean
  transparentOverHeroMobileOnly?: boolean
  heroScrollThreshold?: number
}

function LuxMotionLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-[10px] shrink-0", className)}>
      <div className="relative w-[45px] h-[45px] md:w-[46px] md:h-[46px] border-[1.9px] border-[#C9A96E] flex items-center justify-center shrink-0">
        <div className="relative w-[23px] h-[13px]">
          <Image
            src="/svgs/lm-monogram.svg"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="relative w-[82px] h-[9px]">
          <Image
            src="/svgs/luxmotion-text.svg"
            alt="LuxMotion"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <span className="text-[7.2px] tracking-[1px] text-[#999] mt-[4px] whitespace-nowrap">
          BY EASYTRANSFER
        </span>
      </div>
    </Link>
  )
}

function LangSwitcher() {
  const locale = useLocale() as Locale
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleChange = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[4px] h-[40px] px-[9px] border border-[rgba(201,169,110,0.22)] transition-colors hover:border-[rgba(201,169,110,0.4)] cursor-pointer"
      >
        <FlagImage iso2={localeCountryIso[locale]} size={20} className="rounded-[2px]" />
        <span className="text-[14px] font-medium text-[#C9A96E] tracking-[0.15px]">
          {locale.toUpperCase()}
        </span>
        <ChevronDown className={cn(
          "w-[13px] h-[13px] text-[#C9A96E] transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-[#1A1A1A] border border-[#2A2A2A] shadow-xl py-1 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleChange(loc)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-[#8C8680] hover:text-[#C9A96E] hover:bg-white/5",
                loc === locale && "text-[#C9A96E] bg-white/5"
              )}
            >
              <FlagImage iso2={localeCountryIso[loc]} size={20} />
              <span className="flex-1 text-left text-sm font-medium">{localeNames[loc]}</span>
              {loc === locale && <Check className="w-4 h-4 text-[#C9A96E]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header({
  transparentOverHero = false,
  transparentOverHeroMobileOnly = false,
  heroScrollThreshold = HERO_SCROLL_THRESHOLD,
}: HeaderProps = {}) {
  const t = useTranslations("header")
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [overHero, setOverHero] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const isTransparent =
    transparentOverHero &&
    overHero &&
    (!transparentOverHeroMobileOnly || isMobile)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const setMobileState = () => setIsMobile(mq.matches)
    setMobileState()
    mq.addEventListener("change", setMobileState)
    return () => mq.removeEventListener("change", setMobileState)
  }, [])

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      if (transparentOverHero) {
        setOverHero(window.scrollY < heroScrollThreshold)
      }
    }

    const sectionIds = ["about", "booking"]
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) setActiveSection(id)
            })
          },
          { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    const handleScrollTop = () => {
      if (window.scrollY < 100) setActiveSection(null)
    }

    if (transparentOverHero) {
      setOverHero(window.scrollY < heroScrollThreshold)
    }
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleScrollTop)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleScrollTop)
      observers.forEach((o) => o.disconnect())
    }
  }, [transparentOverHero, heroScrollThreshold])

  const isActive = (href: string, hasDropdown?: boolean, items?: { href: string }[]) => {
    if (hasDropdown && items) return items.some(item => pathname.startsWith(item.href))
    if (href === "/") return pathname === "/" && !activeSection
    if (href.startsWith("/#")) return pathname === "/" && activeSection === href.slice(2)
    return pathname === href || pathname.startsWith(href + "/")
  }

  const navLinks = [
    { href: "/", label: t("home"), hasDropdown: false, items: [] },
    { href: "/about-us", label: t("aboutUs"), hasDropdown: false, items: [] },
    { href: "/fleet", label: t("fleet"), hasDropdown: false, items: [] },
    {
      label: t("services"),
      hasDropdown: true,
      items: [
        { href: "/tours", label: t("tours") },
        { href: "/events", label: t("events") },
        { href: "https://easytoursportugal.com/", label: t("luxuryTours") },
        { href: "https://easytoursportugal.com/premium-corporate-transfers-portugal/", label: t("corporate") },
        { href: "https://easytransferservices.site/casamentos/", label: t("weddings") },
        { href: "https://easytransferservices.site/escola/", label: t("school") },
      ]
    },
    {
      label: t("forPartners"),
      hasDropdown: true,
      items: [
        { href: "https://easytransferpartnership.com/", label: t("hotels") },
        { href: "https://easytransferpartnership.com/partner/", label: t("partnerGuide") },
      ]
    },
    {
      label: t("forDrivers"),
      hasDropdown: true,
      items: [
        { href: "#", label: t("individualDrivers") },
        { href: "#", label: t("driverCompanies") },
      ]
    },
    { href: "/blogs", label: t("blog"), hasDropdown: false, items: [] },
  ]

  const linkClasses = (href: string, hasDropdown?: boolean, items?: { href: string }[]) =>
    cn(
      "text-[12px] font-medium uppercase tracking-[1.28px] transition-colors whitespace-nowrap",
      isActive(href || "", hasDropdown, items)
        ? "text-[#C9A96E]"
        : "text-[#8C8680] hover:text-[#C9A96E]"
    )

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "bg-[rgba(13,13,13,0.96)] backdrop-blur-[10px] border-b border-[rgba(201,169,110,0.1)]",
          !isTransparent && isScrolled && "shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-[48px] flex items-center justify-between h-[60px] md:h-[72px]">
          <LuxMotionLogo />

          <nav className="hidden xl:flex items-center gap-[18px]">
            {navLinks.map((link) =>
              link.hasDropdown && mounted ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(linkClasses(link.href || "", link.hasDropdown, link.items), "flex items-center gap-[8px] outline-none cursor-pointer")}>
                      {link.label}
                      <ChevronDown className="w-[13px] h-[13px]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-[#1A1A1A] border-[#2A2A2A] shadow-xl rounded-none p-1.5 min-w-[200px]"
                  >
                    {link.items?.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        asChild
                        className="text-[#8C8680] focus:text-[#C9A96E] focus:bg-white/5 rounded-none text-[12px] uppercase tracking-[1px]"
                      >
                        {item.href.startsWith("http") ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="w-full block">
                            {item.label}
                          </a>
                        ) : (
                          <Link href={item.href} className="w-full">
                            {item.label}
                          </Link>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : link.hasDropdown ? (
                <button
                  key={link.label}
                  className={cn(linkClasses(link.href || "", link.hasDropdown, link.items), "flex items-center gap-[8px] outline-none cursor-pointer")}
                >
                  {link.label}
                  <ChevronDown className="w-[13px] h-[13px]" />
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href || "/"}
                  className={linkClasses(link.href || "")}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden xl:flex items-center gap-[8px]">
            <LangSwitcher />
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="h-[40px] px-[22px] flex items-center justify-center border border-[#C9A96E] text-[#C9A96E] text-[14px] font-medium uppercase tracking-[1.1px] transition-all hover:bg-[#C9A96E] hover:text-[#0D0D0D] cursor-pointer"
            >
              {t("reserve")}
            </a>
          </div>

          <div className="xl:hidden flex items-center gap-[8px]">
            <LangSwitcher />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center size-[40px] border border-[rgba(201,169,110,0.22)] text-[#8C8680] hover:text-[#C9A96E] transition-colors cursor-pointer"
            >
              <Menu className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-[100] xl:hidden transition-all duration-300",
            mobileMenuOpen ? "visible" : "invisible"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => { setMobileMenuOpen(false); setMobileExpandedDropdown(null) }}
          />

          <div
            className={cn(
              "absolute left-0 right-0 top-0 bg-[#0D0D0D] shadow-2xl transition-transform duration-300 flex flex-col max-h-[90vh] overflow-y-auto border-b border-[rgba(201,169,110,0.1)]",
              mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            )}
          >
            <div className="px-4 h-[60px] flex items-center justify-between border-b border-[#2A2A2A] sticky top-0 bg-[#0D0D0D] z-10 shrink-0">
              <LuxMotionLogo />
              <button
                onClick={() => { setMobileMenuOpen(false); setMobileExpandedDropdown(null) }}
                className="p-2 -m-2 text-[#8C8680] hover:text-[#C9A96E] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 pb-2 overflow-y-auto min-h-0">
              <ul className="space-y-0">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    {link.hasDropdown ? (
                      <div className="border-b border-[#2A2A2A] last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setMobileExpandedDropdown((prev) => (prev === link.label ? null : link.label))}
                          className={cn(
                            "flex items-center justify-between w-full py-3 text-[13px] font-medium uppercase tracking-[1.28px] transition-colors text-left cursor-pointer",
                            mobileExpandedDropdown === link.label ? "text-[#C9A96E]" : "text-[#8C8680]"
                          )}
                          aria-expanded={mobileExpandedDropdown === link.label}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 shrink-0 transition-transform duration-200",
                              mobileExpandedDropdown === link.label && "rotate-180"
                            )}
                          />
                        </button>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200 ease-out",
                            mobileExpandedDropdown === link.label ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <ul className="pl-3 pb-3 space-y-0 border-l-2 border-[#C9A96E]/20 ml-2">
                            {link.items?.map((item) => (
                              <li key={item.label}>
                                {item.href.startsWith("http") ? (
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block py-2 text-[12px] uppercase tracking-[1px] text-[#666] hover:text-[#C9A96E] active:text-[#C9A96E]"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.label}
                                  </a>
                                ) : (
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "block py-2 text-[12px] uppercase tracking-[1px] transition-colors",
                                      isActive(item.href) ? "text-[#C9A96E] font-medium" : "text-[#666] hover:text-[#C9A96E]"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href || "/"}
                        className={cn(
                          "block py-3 text-[13px] font-medium uppercase tracking-[1.28px] border-b border-[#2A2A2A] transition-colors last:border-b-0",
                          isActive(link.href || "") ? "text-[#C9A96E]" : "text-[#8C8680] active:text-[#C9A96E]"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-[#2A2A2A] bg-[#0D0D0D] sticky bottom-0 shrink-0">
              <a
                href="#booking"
                className="w-full h-12 flex items-center justify-center border border-[#C9A96E] text-[#C9A96E] font-medium text-[14px] uppercase tracking-[1.1px] active:scale-[0.98] transition-all hover:bg-[#C9A96E] hover:text-[#0D0D0D]"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  setTimeout(() => {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
                  }, 300)
                }}
              >
                {t("reserve")}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
