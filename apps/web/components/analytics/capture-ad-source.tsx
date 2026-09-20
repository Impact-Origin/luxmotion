"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  readAdSourceCookie,
  readAdSourceFromUrl,
  writeAdSourceCookie,
} from "@/lib/ad-source"

/**
 * Guarda a origem da visita na entrada do site.
 *
 * Corre em cada navegação porque a primeira página pode não ser a que tem os
 * parâmetros: quem chega a `/en` e clica para `/en/fleet?utm_source=…` entrou
 * pelo anúncio na mesma.
 *
 * Só escreve quando o endereço traz origem. Uma página sem parâmetros deixa o
 * cookie como está — e é isso que faz a origem sobreviver ao checkout e ao
 * regresso da Stripe.
 */
export function CaptureAdSource() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const doEndereco = readAdSourceFromUrl(searchParams.toString())
    if (!doEndereco) return

    /* Último toque, como na atribuição a parceiros: a campanha mais recente é
       a que fica. Mas guarda-se a data da primeira vez que a vimos, para se
       poder distinguir uma visita de hoje de uma de há sete semanas. */
    const guardada = readAdSourceCookie()
    const mesmaCampanha =
      guardada?.utmSource === doEndereco.utmSource &&
      guardada?.utmCampaign === doEndereco.utmCampaign &&
      guardada?.utmContent === doEndereco.utmContent

    writeAdSourceCookie({
      ...doEndereco,
      capturedAt: mesmaCampanha ? (guardada?.capturedAt ?? doEndereco.capturedAt) : doEndereco.capturedAt,
    })
  }, [pathname, searchParams])

  return null
}
