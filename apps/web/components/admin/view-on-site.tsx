"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

/**
 * Botão "ver no site", para as entidades que têm página individual pública.
 *
 * Estava escondido dentro do menu de três pontos em tours, events e blogs, e
 * nem existia noutras listas — para ver o que se acabou de editar era preciso
 * abrir o menu e procurar. Passa a ser um botão à vista, ao lado do menu.
 *
 * Nem tudo tem página própria. Quem não tem aparece dentro de uma secção de
 * outra página, e é para lá que vai — com `ViewSectionOnSite`, na barra de
 * cima, em vez de um link igual repetido em cada linha.
 */
export function ViewOnSite({ href, label = "Ver no site" }: { href: string; label?: string }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-foreground"
      title={label}
      onClick={(e) => e.stopPropagation()}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <ExternalLink className="size-4" />
      </Link>
    </Button>
  )
}

/**
 * Versão para a barra de cima, quando a lista inteira vai parar à mesma página.
 *
 * Uma equipa, um condutor ou uma viatura não têm URL próprio — aparecem dentro
 * de uma secção. Repetir o mesmo link em cada linha não dizia nada; um botão só,
 * ao lado do "adicionar", leva ao sítio onde aquilo se vê.
 */
export function ViewSectionOnSite({
  href,
  label = "Ver no site",
}: {
  href: string
  label?: string
}) {
  return (
    <Button asChild variant="outline">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 size-4" />
        {label}
      </Link>
    </Button>
  )
}

/* --------------------------------------------------------------------------
   O URL público de cada entidade, num sítio só.

   O do tour tinha um defeito: o admin mandava SEMPRE para /tours/tour/<slug>,
   mas um tour ultra-luxo é publicado em /ultra-luxury-tours/tours/<slug> (é
   assim que os cartões do site lhe chamam). As duas rotas aceitam qualquer
   slug e desenham layouts diferentes, por isso o link antigo abria o tour na
   página errada em vez de dar erro — e ninguém notava.
--------------------------------------------------------------------------- */

export function tourPublicUrl(tour: { slug: string; isUltraLuxury?: boolean }) {
  return tour.isUltraLuxury
    ? `/ultra-luxury-tours/tours/${tour.slug}`
    : `/tours/tour/${tour.slug}`
}

export const eventPublicUrl = (slug: string) => `/events/${slug}`
export const blogPublicUrl = (slug: string) => `/blogs/${slug}`
export const partnershipPublicUrl = (slug: string) => `/${slug}`

/**
 * A página onde cada lista sem URL próprio é mostrada. Levantado a partir de
 * quem consome cada query no site, não de suposições:
 *   pastExperiences      → components/about/past-experiences-section  → /about-us
 *   corporateExperiences → components/corporate/experiences-listing   → /corporate/experiences
 *   teamMembers          → components/about/team-section              → /about-us
 *   drivers              → components/about/drivers-section           → /about-us
 *   vehicles             → hooks/use-vehicles (cartões do passo 1)    → /checkout
 *   upsells              → passo 2 do checkout                        → /checkout
 */
export const SECTION_URLS = {
  aboutUs: "/about-us",
  corporateExperiences: "/corporate/experiences",
  checkout: "/checkout",
} as const
