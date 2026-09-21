"use client"

/**
 * De onde veio a visita, para o nosso back-office.
 *
 * Isto não é atribuição. É observação: o que estava no endereço quando a pessoa
 * entrou. Quem decide se uma compra foi causada por um anúncio é a plataforma
 * de anúncios, com os dados dela — ver `oppref` mais abaixo, que é outra coisa
 * e vive à parte de propósito.
 *
 * Guarda-se num cookie primário e não na sessão porque tem de sobreviver a três
 * coisas: à navegação para páginas sem parâmetros, ao regresso da Stripe (que é
 * uma ida a outro domínio e uma volta), e a fechar e reabrir o separador antes
 * de pagar.
 *
 * Último toque, como na atribuição a parceiros: só se escreve quando o endereço
 * traz origem nova. Uma visita sem parâmetros **não apaga** o que lá estava —
 * era exactamente isso que fazia perder a origem a meio do checkout.
 */

const COOKIE = "et_src"
const DIAS = 60

/** Os campos que interessam. `utm_content` é o que identifica o anúncio. */
export type AdSource = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  campaignId?: string
  adGroupId?: string
  /** Quando foi vista pela primeira vez esta origem, em milissegundos. */
  capturedAt?: number
}

const DO_ENDERECO: Array<[keyof AdSource, string]> = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["campaignId", "campaign_id"],
  ["adGroupId", "ad_group_id"],
]

const limpar = (v: string | null) => {
  const t = (v ?? "").trim()
  /* 200 caracteres chega para qualquer campanha e trava um cookie gigante
     montado por alguém a brincar com o endereço. */
  return t ? t.slice(0, 200) : undefined
}

/** Lê a origem do endereço actual. Devolve `null` quando não há nada. */
export function readAdSourceFromUrl(search: string): AdSource | null {
  const p = new URLSearchParams(search)
  const fonte: AdSource = {}
  for (const [campo, param] of DO_ENDERECO) {
    const v = limpar(p.get(param))
    if (v) fonte[campo] = v as never
  }
  return Object.keys(fonte).length ? { ...fonte, capturedAt: Date.now() } : null
}

export function readAdSourceCookie(): AdSource | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`))
  if (!m?.[1]) return null
  try {
    const v = JSON.parse(decodeURIComponent(m[1]))
    return v && typeof v === "object" ? (v as AdSource) : null
  } catch {
    return null
  }
}

export function writeAdSourceCookie(fonte: AdSource): void {
  if (typeof document === "undefined") return
  document.cookie = `${COOKIE}=${encodeURIComponent(
    JSON.stringify(fonte),
  )}; max-age=${60 * 60 * 24 * DIAS}; path=/; samesite=lax`
}

/**
 * O identificador de atribuição da OpenAI.
 *
 * O Pixel recolhe-o do endereço e guarda-o no cookie `__oppref`. Nós só o
 * lemos e levamos connosco: vai **tal e qual**, sem ser inventado, adivinhado
 * ou substituído por UTMs. É o que permite à OpenAI ligar a compra ao anúncio
 * quando a conversão é enviada pelo servidor — e o webhook da Stripe não vê
 * cookies nenhuns, por isso tem de viajar dentro da reserva.
 */
export function readOppref(): string | undefined {
  if (typeof document === "undefined") return undefined
  const m = document.cookie.match(/(?:^|;\s*)__oppref=([^;]*)/)
  if (!m?.[1]) return undefined
  try {
    return decodeURIComponent(m[1]) || undefined
  } catch {
    return m[1] || undefined
  }
}

/**
 * O `oppref` é de um clique a sério, ou de uma pré-visualização?
 *
 * A pré-visualização de um anúncio no painel da OpenAI abre o site com
 * `?oppref=preview_mock`. O Pixel guarda-o como guardaria qualquer outro — e
 * bem, porque não lhe compete julgar —, mas esse valor fica no browser de quem
 * previu o anúncio durante semanas. A partir daí, qualquer compra feita nesse
 * computador era comunicada como conversão vinda do ChatGPT.
 *
 * É a mesma armadilha do cookie de parceiro que nos deu um pedido atribuído à
 * "Boutique Weddings" por causa de um teste: quem experimenta fica marcado.
 *
 * O valor continua a ser **guardado tal e qual** — vê-se no admin que a visita
 * veio de uma pré-visualização, o que é informação útil. O que não se faz é
 * declarar uma venda à conta dele.
 */
export function isOpprefDeCliqueReal(oppref: string | null | undefined): boolean {
  const v = (oppref ?? "").trim().toLowerCase()
  if (!v) return false
  return v !== "preview_mock" && !v.startsWith("preview")
}
