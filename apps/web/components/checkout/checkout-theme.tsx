"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

type CheckoutTheme = "light" | "dark"

// Shared with the homepage toggle so the light/dark choice follows the user across
// the site ("seguir o homepage"). Default light (the homepage default).
const STORAGE_KEY = "lm-home-theme"

const CheckoutThemeContext = React.createContext<{
  theme: CheckoutTheme
  toggle: () => void
}>({ theme: "light", toggle: () => {} })

export function useCheckoutTheme() {
  return React.useContext(CheckoutThemeContext)
}

/**
 * Switchable light/dark theme scoped to the main /checkout. Mirrors the homepage
 * toggle (new-landing-page/home-theme.tsx): flips a `.dark` / `.light` class on the
 * `.checkout-theme` wrapper, which swaps the `--ck-*` CSS variables (globals.css).
 * The choice is shared with the homepage via localStorage["lm-home-theme"] and
 * defaults light. Independent of the global next-themes provider (forcedTheme="light").
 */
export function CheckoutThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = React.useState<CheckoutTheme>("light")

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "dark" || saved === "light") setTheme(saved)
  }, [])

  // The page scrollbar lives on <html> (outside this wrapper), so mirror the
  // theme onto <html> to drive the light/dark scrollbar (see globals.css).
  React.useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("lm-checkout-light", theme === "light")
    html.classList.toggle("lm-checkout-dark", theme === "dark")
    return () => html.classList.remove("lm-checkout-light", "lm-checkout-dark")
  }, [theme])

  const toggle = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return (
    <CheckoutThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={cn(
          "checkout-theme min-h-screen flex flex-col bg-[var(--ck-bg,#0d0d0d)] text-[var(--ck-text,#f7f4ef)] transition-colors duration-300",
          theme === "dark" ? "dark" : "light",
        )}
      >
        {children}
      </div>
    </CheckoutThemeContext.Provider>
  )
}

/** Sun/moon switcher — mirrors HomeThemeToggle. Lives inside the CheckoutHeader. */
export function CheckoutThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useCheckoutTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className={cn(
        "flex items-center justify-center size-[40px] border transition-colors cursor-pointer",
        isDark
          ? "border-[rgba(201,169,110,0.22)] text-[#C9A96E] hover:border-[rgba(201,169,110,0.45)]"
          : "border-[rgba(160,130,72,0.28)] text-[#A08248] hover:border-[rgba(160,130,72,0.5)]",
        className,
      )}
    >
      {isDark ? <Sun className="size-[16px]" /> : <Moon className="size-[16px]" />}
    </button>
  )
}
