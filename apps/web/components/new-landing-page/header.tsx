"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

const HERO_SCROLL_THRESHOLD = 320

const MOBILE_MAX_WIDTH = 767

export interface HeaderProps {
  /** When true, header is transparent over hero image and gets white background after scrolling past it */
  transparentOverHero?: boolean
  /** When true with transparentOverHero, the transparent-over-hero effect applies only on mobile (desktop always solid) */
  transparentOverHeroMobileOnly?: boolean
  /** Scroll Y (px) after which the header becomes solid. Default 320 */
  heroScrollThreshold?: number
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

  const useTransparent =
    transparentOverHero &&
    overHero &&
    (!transparentOverHeroMobileOnly || isMobile)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const setMobile = () => setIsMobile(mq.matches)
    setMobile()
    mq.addEventListener("change", setMobile)
    return () => mq.removeEventListener("change", setMobile)
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
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            })
          },
          { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    const handleScrollTop = () => {
      if (window.scrollY < 100) {
        setActiveSection(null)
      }
    }

    if (transparentOverHero) {
      setOverHero(window.scrollY < heroScrollThreshold)
    }
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleScrollTop)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleScrollTop)
      observers.forEach((observer) => observer.disconnect())
    }
  }, [transparentOverHero, heroScrollThreshold])

  const isActive = (href: string, hasDropdown?: boolean, items?: { href: string }[]) => {
    if (hasDropdown && items) {
      return items.some(item => pathname.startsWith(item.href))
    }
    if (href === "/") {
      return pathname === "/" && !activeSection
    }
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2)
      return pathname === "/" && activeSection === sectionId
    }
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

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          header.landing-topnav-mobile-white:not(.header-over-hero) {
            background-color: #ffffff !important;
          }
        }
      `}</style>
      <header 
        className={cn(
          "landing-topnav-mobile-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-[9px]",
          useTransparent && "header-over-hero bg-transparent shadow-none",
          !useTransparent && "bg-white",
          !useTransparent && isScrolled ? "shadow-md" : ""
        )}
      >
      <div className="max-w-[1440px] mx-auto px-4 md:px-[80px] lg:px-[120px] xl:px-[156px] flex items-center justify-between gap-4">
        <Link href="/" className="relative w-[180px] h-[32px] md:w-[212px] md:h-[28px] shrink-0">
          <Image
            src="/svgs/easytransfer-logo.svg"
            alt="EasyTransfer"
            fill
            className={cn(
              "object-contain object-left transition-all duration-300",
              useTransparent && "brightness-0 invert"
            )}
            priority
          />
        </Link>

        <nav className="hidden xl:flex items-center justify-end flex-1 gap-[12px] 2xl:gap-[16px]">
          <div className="flex gap-[12px] 2xl:gap-[16px] items-center">
            {navLinks.map((link) => (
              link.hasDropdown && mounted ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap outline-none cursor-pointer",
                        useTransparent
                          ? "text-white/90 hover:text-white"
                          : isActive(link.href || "", link.hasDropdown, link.items)
                            ? "text-[#27c7ff] font-medium"
                            : "text-[#808080] font-normal hover:text-[#27c7ff]"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn(
                        "w-[18px] h-[18px]",
                        useTransparent ? "text-white/90" : isActive(link.href || "", link.hasDropdown, link.items)
                          ? "text-[#27c7ff]"
                          : "text-[#808080]"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-zinc-100 shadow-xl rounded-xl p-2 min-w-[200px]">
                    {link.items?.map((item) => (
                      <DropdownMenuItem key={item.label} asChild className="focus:bg-[#27c7ff]/10 focus:text-[#27c7ff] rounded-lg">
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
                  className={cn(
                    "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap outline-none cursor-pointer",
                    useTransparent
                      ? "text-white/90 hover:text-white"
                      : isActive(link.href || "", link.hasDropdown, link.items)
                        ? "text-[#27c7ff] font-medium"
                        : "text-[#808080] font-normal hover:text-[#27c7ff]"
                  )}
                >
                  {link.label}
                  <ChevronDown className={cn(
                    "w-[18px] h-[18px]",
                    useTransparent ? "text-white/90" : isActive(link.href || "", link.hasDropdown, link.items)
                      ? "text-[#27c7ff]"
                      : "text-[#808080]"
                  )} />
                </button>
              ) : (
              <Link
                key={link.label}
                href={link.href || "/"}
                className={cn(
                  "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap",
                  useTransparent
                    ? "text-white/90 hover:text-white"
                    : isActive(link.href || "")
                      ? "text-[#27c7ff] font-medium"
                      : "text-[#808080] font-normal hover:text-[#27c7ff]"
                )}
              >
                {link.label}
              </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-[12px] 2xl:gap-[16px] ml-4">
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={cn(
                "h-[36px] pl-3 pr-1.5 flex items-center gap-1.5 rounded-[14px] transition-all whitespace-nowrap cursor-pointer",
                useTransparent
                  ? "bg-white/20 hover:bg-white/30 text-white border border-white/40"
                  : "bg-[#27c7ff] hover:brightness-95 text-white"
              )}
            >
              <span className="text-[13px] font-medium tracking-[0.12px] uppercase leading-[1.2]">
                {t("bookNow")}
              </span>
              <ArrowUpRight className="size-5" />
            </a>

            <LanguageSwitcher variant="navbar" className={useTransparent ? "md:text-white md:[&_button]:text-white md:[&_button]:border-white/40" : undefined} />
          </div>
        </nav>

        <div className="xl:hidden flex items-center gap-4">
            <LanguageSwitcher variant="navbar" className={useTransparent ? "text-white [&_button]:text-white [&_button]:border-white/40" : undefined} />
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={cn("transition-colors", useTransparent ? "text-white/90 hover:text-white" : "text-[#808080] hover:text-[#27c7ff]")}
          >
            <Menu className="w-8 h-8" />
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
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => { setMobileMenuOpen(false); setMobileExpandedDropdown(null) }}
        />
        
        <div 
          className={cn(
            "absolute left-0 right-0 top-0 bg-white shadow-2xl transition-transform duration-300 flex flex-col max-h-[90vh] overflow-y-auto",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="p-4 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white z-10 shrink-0">
            <div className="relative w-[150px] h-[24px]">
              <Image
                src="/svgs/easytransfer-logo.svg"
                alt="EasyTransfer"
                fill
                className="object-contain object-left"
              />
            </div>
            <button 
              onClick={() => { setMobileMenuOpen(false); setMobileExpandedDropdown(null) }}
              className="p-2 -m-2 text-[#808080] hover:text-[#27c7ff]"
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
                    <div className="border-b border-zinc-100 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setMobileExpandedDropdown((prev) => (prev === link.label ? null : link.label))}
                        className={cn(
                          "flex items-center justify-between w-full py-3 text-[15px] font-medium transition-colors text-left",
                          mobileExpandedDropdown === link.label
                            ? "text-[#27c7ff]"
                            : "text-[#222222]"
                        )}
                        aria-expanded={mobileExpandedDropdown === link.label}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 shrink-0 transition-transform duration-200",
                            mobileExpandedDropdown === link.label ? "rotate-180 text-[#27c7ff]" : "text-[#808080]"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200 ease-out",
                          mobileExpandedDropdown === link.label ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <ul className="pl-3 pb-3 space-y-0 border-l-2 border-[#27c7ff]/20 ml-2">
                          {link.items?.map((item) => (
                            <li key={item.label}>
                              {item.href.startsWith("http") ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block py-2 text-[14px] text-[#555] hover:text-[#27c7ff] active:text-[#27c7ff]"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {item.label}
                                </a>
                              ) : (
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "block py-2 text-[14px] transition-colors",
                                    isActive(item.href) ? "text-[#27c7ff] font-medium" : "text-[#555] hover:text-[#27c7ff] active:text-[#27c7ff]"
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
                        "block py-3 text-[15px] font-medium border-b border-zinc-100 transition-colors last:border-b-0",
                        isActive(link.href || "") ? "text-[#27c7ff]" : "text-[#222222] active:text-[#27c7ff]"
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

          <div className="p-4 border-t border-zinc-200 space-y-3 bg-white sticky bottom-0 shrink-0">
            <a
              href="#booking"
              className="w-full bg-[#27c7ff] hover:bg-[#1fb8ff] text-white h-12 px-4 flex items-center justify-center gap-2 rounded-xl font-semibold text-[14px] uppercase tracking-wide active:scale-[0.98] transition-all"
              onClick={(e) => {
                e.preventDefault()
                setMobileMenuOpen(false)
                setTimeout(() => {
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                }, 300)
              }}
            >
              {t("bookNow")}
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <div className="flex justify-center">
              <LanguageSwitcher variant="default" className="!w-full !rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
