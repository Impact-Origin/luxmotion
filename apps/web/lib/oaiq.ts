/**
 * O pixel do ChatGPT Ads.
 *
 * São duas coisas separadas e é bom não as confundir. O script base carrega uma
 * vez por página (`components/analytics/openai-pixel.tsx`) e serve para o
 * OpenAI reconhecer a visita. O evento `lead_created` é outra coisa: só sai
 * quando um pedido de orçamento foi mesmo recebido e guardado.
 *
 * A regra que interessa, e a razão de isto viver aqui e não solto em cada
 * formulário: **uma vez por pedido**. Não quando alguém abre o formulário, não
 * quando carrega em enviar, não quando a submissão dá erro. Um número de leads
 * inflacionado estraga a campanha de duas maneiras — paga-se por conversões que
 * não existem e as decisões passam a ser tomadas sobre um número falso.
 */

type Oaiq = (comando: string, ...resto: unknown[]) => void

declare global {
  interface Window {
    oaiq?: Oaiq
  }
}

export const OPENAI_PIXEL_ID =
  process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || "NiXDfgy1G93cgyambT8Kt2"

/**
 * Um pedido de orçamento que já está guardado do nosso lado.
 *
 * Chamar só a seguir a a mutation resolver, nunca antes. Nada aqui rebenta: se
 * o script não carregou — bloqueador de anúncios, rede a falhar — a submissão
 * do visitante não pode ir atrás.
 */
export function medirPedidoDeOrcamento(): void {
  try {
    window.oaiq?.("measure", "lead_created", { type: "customer_action" })
  } catch {
    /* Uma medição perdida não é motivo para partir um formulário. */
  }
}
