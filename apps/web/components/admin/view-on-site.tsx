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
 * Nem tudo tem página própria: `corporateExperiences` e `pastExperiences` são
 * desenhados dentro de listagens (modal e mosaico de fotos), e os upsells,
 * viaturas, condutores e equipa não aparecem sozinhos em lado nenhum. Nesses
 * casos não há botão, em vez de haver um que dá 404.
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
