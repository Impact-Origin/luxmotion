"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Header } from "./header"

type HomeTheme = "light" | "dark"

const STORAGE_KEY = "lm-home-theme"

const HomeThemeContext = React.createContext<{
  theme: HomeTheme
  toggle: () => void
}>({ theme: "light", toggle: () => {} })

export function useHomeTheme() {
  return React.useContext(HomeThemeContext)
}

/**
 * Scoped light/dark theme for the public homepage only. The default is light
 * (wedding-page palette); the toggle flips a `.dark` class on the wrapper, which
 * swaps the `--lm-*` CSS variables (see globals.css). The choice persists in
 * localStorage. This is intentionally independent of the global next-themes
 * provider (which is `forcedTheme="light"`) so the rest of the site is untouched.
 */
export function HomeThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<HomeTheme>("light")

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "dark" || saved === "light") setTheme(saved)
  }, [])

  // The page scrollbar lives on <html> (outside this wrapper), so mirror the
  // home theme onto <html> to drive the light/dark scrollbar (see globals.css).
  React.useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("lm-home-light", theme === "light")
    html.classList.toggle("lm-home-dark", theme === "dark")
    return () => html.classList.remove("lm-home-light", "lm-home-dark")
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
    <HomeThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={cn(
          "home-theme min-h-screen bg-[var(--lm-bg,#0D0D0D)] text-[var(--lm-text,#fff)] transition-colors duration-300",
          theme === "dark" && "dark",
        )}
      >
        {children}
      </div>
    </HomeThemeContext.Provider>
  )
}

/** Sun/moon switcher button. Lives inside the homepage Header. */
export function HomeThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useHomeTheme()
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

/** Homepage Header: drives the shared Header's `variant` from the theme and
 *  injects the switcher button. */
export function HomeHeader() {
  const { theme } = useHomeTheme()
  return (
    <Header
      variant={theme === "dark" ? "dark" : "light"}
      themeToggle={<HomeThemeToggle />}
    />
  )
}
