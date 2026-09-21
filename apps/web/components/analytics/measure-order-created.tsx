"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { medirCompra } from "@/lib/oaiq"
import { isOpprefDeCliqueReal } from "@/lib/ad-source"

/**
 * Dispara a conversão quando a reserva está mesmo paga.
 *
 * Não é a página de sucesso que decide: em MB WAY e Multibanco essa página
 * abre antes de existir dinheiro. Quem decide é o estado da encomenda na nossa
 * base, que só passa a pago quando a Stripe confirma.
 *
 * **Só para quem veio do ChatGPT.** A prova é o `opprefId` — o identificador
 * que a própria OpenAI põe no endereço e que o Pixel guarda — ou, em segunda
 * mão, a origem que observámos na entrada. Repara que nenhuma das duas é o
 * endereço da página final: essa já não tem parâmetros nenhuns, e condicionar
 * o envio a isso perderia quase todas as compras.
 *
 * Uma vez por encomenda. A marca fica no `sessionStorage` para um F5 no ecrã de
 * confirmação não contar uma segunda compra; e mesmo que contasse, o
 * identificador é o mesmo e a OpenAI despreza o repetido.
 */
export function MeasureOrderCreated({ orderNumber }: { orderNumber: string | null }) {
  const enviado = useRef(false)

  const order = useQuery(
    api.orders.getByOrderNumber,
    orderNumber ? { orderNumber } : "skip",
  ) as any

  /* Numa ida e volta são duas linhas na base, uma por perna. A compra é uma
     só, e o valor tem de ser o que a pessoa pagou. */
  const relatedId = order?.relatedOrderId ?? null
  const related = useQuery(
    api.orders.getById,
    relatedId ? { orderId: relatedId } : "skip",
  ) as any

  useEffect(() => {
    if (enviado.current || !orderNumber || !order) return

    const pago = order.paymentStatus === "completed" || order.status === "paid"
    if (!pago) return

    /* Uma pré-visualização de anúncio não é uma venda vinda de um anúncio.
       Ver `isOpprefDeCliqueReal`. */
    const doChatGpt =
      isOpprefDeCliqueReal(order.opprefId) ||
      String(order.adSource?.utmSource ?? "").toLowerCase() === "chatgpt"
    if (!doChatGpt) return

    /* Se há perna de volta, espera por ela antes de enviar um valor a metade. */
    if (relatedId && related === undefined) return

    const chave = `oaiq_order_created:${orderNumber}`
    try {
      if (sessionStorage.getItem(chave)) {
        enviado.current = true
        return
      }
    } catch {
      /* Sem sessionStorage vale o identificador, que já evita o duplicado. */
    }

    const total = (order.totalAmount ?? 0) + (related?.totalAmount ?? 0)
    if (!(total > 0)) return

    medirCompra({ orderNumber, amountCents: Math.round(total * 100) })
    enviado.current = true
    try {
      sessionStorage.setItem(chave, "1")
    } catch {
      /* idem */
    }
  }, [orderNumber, order, relatedId, related])

  return null
}
