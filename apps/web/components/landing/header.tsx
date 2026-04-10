"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useParams } from "next/navigation"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useDynamicTheme } from "@/components/dynamic-theme-provider"
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
  minimalNavigation?: boolean
}

export function Header({
  transparentOverHero = false,
  transparentOverHeroMobileOnly = false,
  heroScrollThreshold = HERO_SCROLL_THRESHOLD,
  minimalNavigation = false,
}: HeaderProps = {}) {
  const t = useTranslations("header")
  const pathname = usePathname()
  const params = useParams()
  const referral = params?.referral as string | undefined
  const homePath = referral ? `/${referral}` : "/"
  const { logoUrl } = useDynamicTheme()

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
      if (!element) return
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
      observers.forEach((observer) => observer.disconnect())
    }
  }, [transparentOverHero, heroScrollThreshold])

  const isActive = (href: string, hasDropdown?: boolean, items?: { href: string }[]) => {
    if (hasDropdown && items) {
      return items.some((item) => item.href.startsWith("/") && pathname.startsWith(item.href))
    }
    if (href === "/") return pathname === "/" && !activeSection
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2)
      return pathname === "/" && activeSection === sectionId
    }
    return href.startsWith("/") ? pathname === href || pathname.startsWith(href + "/") : false
  }

  const navLinks = minimalNavigation
    ? [{ href: homePath, label: t("home"), hasDropdown: false, items: [] }]
    : [
        { href: homePath, label: t("home"), hasDropdown: false, items: [] },
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
          ],
        },
        {
          label: t("forPartners"),
          hasDropdown: true,
          items: [
            { href: "https://easytransferpartnership.com/", label: t("hotels") },
            { href: "https://easytransferpartnership.com/partner/", label: t("partnerGuide") },
          ],
        },
        {
          label: t("forDrivers"),
          hasDropdown: true,
          items: [
            { href: "#", label: t("individualDrivers") },
            { href: "#", label: t("driverCompanies") },
          ],
        },
        { href: "/blogs", label: t("blog"), hasDropdown: false, items: [] },
      ]

  const headerBg = "var(--theme-landing-header-bg, #ffffff)"
  const headerText = "var(--theme-landing-header-text, #808080)"
  const headerHoverText = "var(--theme-landing-header-hover-text, #27c7ff)"
  const headerButtonBg = "var(--theme-landing-header-button-bg, #27c7ff)"
  const headerButtonText = "var(--theme-landing-header-button-text, #ffffff)"
  const headerButtonIcon = "var(--theme-landing-header-button-icon, #ffffff)"
  const headerMenuBg = "var(--theme-landing-header-menu-bg, #ffffff)"
  const headerMenuIcon = "var(--theme-landing-header-menu-icon, #27c7ff)"
  const headerMenuBorder = "var(--theme-landing-header-menu-border, #e5e7eb)"

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          header.landing-topnav-mobile-white:not(.header-over-hero) {
            background-color: ${headerBg} !important;
          }
        }
      `}</style>
      <header
        data-theme-color="landingHeaderBg"
        className={cn(
          "landing-topnav-mobile-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-[9px]",
          useTransparent && "header-over-hero bg-transparent shadow-none",
          !useTransparent && isScrolled ? "shadow-md" : ""
        )}
        style={!useTransparent ? { backgroundColor: headerBg } : undefined}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-[80px] lg:px-[120px] xl:px-[156px] flex items-center justify-between gap-4">
          <Link href={homePath} data-theme-color="logoBg" className="relative w-[180px] h-[32px] md:w-[212px] md:h-[28px] shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="EasyTransfer"
                fill
                className={cn(
                  "object-contain object-left transition-all duration-300",
                  useTransparent && "brightness-0 invert"
                )}
                priority
              />
            ) : (
              <div
                data-theme-color="logoBg"
                className="w-full h-full rounded-md flex items-center justify-center"
                style={{ backgroundColor: "var(--theme-logo-bg, #000000)", color: "var(--theme-logo-text, #ffffff)" }}
              >
                <span data-theme-color="logoText" className="text-[12px] font-bold tracking-wide">LOGO</span>
              </div>
            )}
          </Link>

          <nav className="hidden xl:flex items-center justify-end flex-1 gap-[12px] 2xl:gap-[16px]">
            <div className="flex gap-[12px] 2xl:gap-[16px] items-center">
              {navLinks.map((link) => (
                link.hasDropdown && mounted ? (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        data-theme-color="landingHeaderText"
                        className={cn(
                          "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap outline-none cursor-pointer",
                          useTransparent ? "text-white/90 hover:text-white" : ""
                        )}
                        style={!useTransparent ? { color: isActive(link.href || "", link.hasDropdown, link.items) ? headerHoverText : headerText } : undefined}
                      >
                        {link.label}
                        <ChevronDown
                          data-theme-color="landingHeaderMenuIcon"
                          className="w-[18px] h-[18px]"
                          style={{ color: useTransparent ? "rgba(255,255,255,0.9)" : (isActive(link.href || "", link.hasDropdown, link.items) ? headerHoverText : headerMenuIcon) }}
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      data-theme-color="landingHeaderMenuBg"
                      align="start"
                      className="shadow-xl rounded-xl p-2 min-w-[200px]"
                      style={{ backgroundColor: headerMenuBg, borderColor: headerMenuBorder }}
                    >
                      {link.items?.map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          asChild
                          data-theme-color="landingHeaderMenuItemHoverBg"
                          className="rounded-lg"
                        >
                          {item.href.startsWith("http") ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer" className="w-full block" style={{ color: headerText }}>
                              {item.label}
                            </a>
                          ) : (
                            <Link href={item.href} className="w-full" style={{ color: headerText }}>
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
                    data-theme-color="landingHeaderText"
                    className={cn(
                      "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap outline-none cursor-pointer",
                      useTransparent ? "text-white/90 hover:text-white" : ""
                    )}
                    style={!useTransparent ? { color: isActive(link.href || "", link.hasDropdown, link.items) ? headerHoverText : headerText } : undefined}
                  >
                    {link.label}
                    <ChevronDown
                      data-theme-color="landingHeaderMenuIcon"
                      className="w-[18px] h-[18px]"
                      style={{ color: useTransparent ? "rgba(255,255,255,0.9)" : (isActive(link.href || "", link.hasDropdown, link.items) ? headerHoverText : headerMenuIcon) }}
                    />
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href || "/"}
                    data-theme-color="landingHeaderText"
                    className={cn(
                      "text-[14px] tracking-[0.14px] transition-colors flex items-center gap-[4px] whitespace-nowrap",
                      useTransparent ? "text-white/90 hover:text-white" : ""
                    )}
                    style={!useTransparent ? { color: isActive(link.href || "") ? headerHoverText : headerText } : undefined}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-[12px] 2xl:gap-[16px] ml-4">
              <a
                href="#booking"
                data-theme-color="landingHeaderButtonBg"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={cn(
                  "h-[36px] pl-3 pr-1.5 flex items-center gap-1.5 rounded-[14px] transition-all whitespace-nowrap cursor-pointer",
                  useTransparent ? "bg-white/20 hover:bg-white/30 text-white border border-white/40" : ""
                )}
                style={!useTransparent ? { backgroundColor: headerButtonBg, color: headerButtonText } : undefined}
              >
                <span data-theme-color="landingHeaderButtonText" className="text-[13px] font-medium tracking-[0.12px] uppercase leading-[1.2]">
                  {t("bookNow")}
                </span>
                <ArrowUpRight data-theme-color="landingHeaderButtonIcon" className="size-5" style={!useTransparent ? { color: headerButtonIcon } : undefined} />
              </a>

              <div data-theme-color="landingHeaderMenuBg">
                <LanguageSwitcher
                  variant="navbar"
                  useThemeStyles={!useTransparent}
                  className={useTransparent ? "md:text-white md:[&_button]:text-white md:[&_button]:border-white/40" : undefined}
                />
              </div>
            </div>
          </nav>

          <div className="xl:hidden flex items-center gap-4">
            <div data-theme-color="landingHeaderMenuBg">
              <LanguageSwitcher variant="navbar" useThemeStyles={!useTransparent} className={useTransparent ? "text-white [&_button]:text-white [&_button]:border-white/40" : undefined} />
            </div>
            <button
              data-theme-color="landingHeaderMenuIcon"
              onClick={() => setMobileMenuOpen(true)}
              className={cn("transition-colors", useTransparent ? "text-white/90 hover:text-white" : "")}
              style={!useTransparent ? { color: headerMenuIcon } : undefined}
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
            onClick={() => {
              setMobileMenuOpen(false)
              setMobileExpandedDropdown(null)
            }}
          />

          <div
            data-theme-color="landingHeaderMenuBg"
            className={cn(
              "absolute left-0 right-0 top-0 shadow-2xl transition-transform duration-300 flex flex-col max-h-[90vh] overflow-y-auto",
              mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            )}
            style={{ backgroundColor: headerMenuBg }}
          >
            <div
              data-theme-color="landingHeaderMenuBorder"
              className="p-4 flex items-center justify-between border-b sticky top-0 z-10 shrink-0"
              style={{ borderColor: headerMenuBorder, backgroundColor: headerMenuBg }}
            >
              <Link href={homePath} data-theme-color="logoBg" className="relative w-[150px] h-[24px]">
                {logoUrl ? (
                  <Image src={logoUrl} alt="EasyTransfer" fill className="object-contain object-left" />
                ) : (
                  <div
                    data-theme-color="logoBg"
                    className="w-full h-full rounded-md flex items-center justify-center"
                    style={{ backgroundColor: "var(--theme-logo-bg, #000000)", color: "var(--theme-logo-text, #ffffff)" }}
                  >
                    <span data-theme-color="logoText" className="text-[10px] font-bold tracking-wide">LOGO</span>
                  </div>
                )}
              </Link>
              <button
                data-theme-color="landingHeaderMenuIcon"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setMobileExpandedDropdown(null)
                }}
                className="p-2 -m-2"
                aria-label="Close menu"
                style={{ color: headerMenuIcon }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 pb-2 overflow-y-auto min-h-0">
              <ul className="space-y-0">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    {link.hasDropdown ? (
                      <div className="border-b border-zinc-100 last:border-b-0" style={{ borderColor: headerMenuBorder }}>
                        <button
                          type="button"
                          data-theme-color="landingHeaderText"
                          onClick={() => setMobileExpandedDropdown((prev) => (prev === link.label ? null : link.label))}
                          className="flex items-center justify-between w-full py-3 text-[15px] font-medium transition-colors text-left"
                          aria-expanded={mobileExpandedDropdown === link.label}
                          style={{ color: mobileExpandedDropdown === link.label ? headerHoverText : headerText }}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            data-theme-color="landingHeaderMenuIcon"
                            className={cn(
                              "w-5 h-5 shrink-0 transition-transform duration-200",
                              mobileExpandedDropdown === link.label ? "rotate-180" : ""
                            )}
                            style={{ color: mobileExpandedDropdown === link.label ? headerHoverText : headerMenuIcon }}
                          />
                        </button>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200 ease-out",
                            mobileExpandedDropdown === link.label ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <ul
                            data-theme-color="landingHeaderMenuBorder"
                            className="pl-3 pb-3 space-y-0 border-l-2 ml-2"
                            style={{ borderColor: `${headerMenuBorder}` }}
                          >
                            {link.items?.map((item) => (
                              <li key={item.label}>
                                {item.href.startsWith("http") ? (
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-theme-color="landingHeaderText"
                                    className="block py-2 text-[14px] transition-colors"
                                    style={{ color: headerText }}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.label}
                                  </a>
                                ) : (
                                  <Link
                                    href={item.href}
                                    data-theme-color="landingHeaderText"
                                    className="block py-2 text-[14px] transition-colors"
                                    style={{ color: isActive(item.href) ? headerHoverText : headerText }}
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
                        data-theme-color="landingHeaderText"
                        className="block py-3 text-[15px] font-medium border-b border-zinc-100 transition-colors last:border-b-0"
                        style={{ color: isActive(link.href || "") ? headerHoverText : headerText, borderColor: headerMenuBorder }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div
              data-theme-color="landingHeaderMenuBorder"
              className="p-4 border-t space-y-3 sticky bottom-0 shrink-0"
              style={{ borderColor: headerMenuBorder, backgroundColor: headerMenuBg }}
            >
              <a
                href="#booking"
                data-theme-color="landingHeaderButtonBg"
                className="w-full h-12 px-4 flex items-center justify-center gap-2 rounded-xl font-semibold text-[14px] uppercase tracking-wide active:scale-[0.98] transition-all"
                style={{ backgroundColor: headerButtonBg, color: headerButtonText }}
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  setTimeout(() => {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
                  }, 300)
                }}
              >
                <span data-theme-color="landingHeaderButtonText">{t("bookNow")}</span>
                <ArrowUpRight data-theme-color="landingHeaderButtonIcon" className="w-4 h-4" style={{ color: headerButtonIcon }} />
              </a>
              <div className="flex justify-center" data-theme-color="landingHeaderMenuBg">
                <LanguageSwitcher variant="default" useThemeStyles={true} className="!w-full !rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
