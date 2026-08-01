"use client"

import { Header } from "@/components/new-landing-page/header"
import { HomeThemeToggle, useHomeTheme } from "@/components/new-landing-page/home-theme"

/**
 * Header da página de detalhe de um evento. É o HomeHeader com os extras que
 * esta página precisa (transparente por cima da hero em telemóvel), por isso
 * não dá para usar o <HomeHeader /> tal e qual — mas o tema e o botão do
 * sol/lua são exactamente os mesmos.
 */
export function EventDetailsHeader() {
  const { theme } = useHomeTheme()

  return (
    <Header
      transparentOverHero
      transparentOverHeroMobileOnly
      heroScrollThreshold={100}
      variant={theme === "dark" ? "dark" : "light"}
      themeToggle={<HomeThemeToggle />}
    />
  )
}
