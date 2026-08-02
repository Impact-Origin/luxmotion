"use client"

import { useEffect } from "react"
import { RefreshCw, ArrowLeft } from "lucide-react"

/**
 * Rede de segurança do checkout.
 *
 * Sem isto, qualquer excepção durante o render cai no boundary por omissão do
 * Next e o cliente vê "Application error: a client-side exception has occurred"
 * — ecrã branco, sem forma de recuperar, a meio de uma compra. Aconteceu por uma
 * query do Convex que ainda não estava deployed; o próximo motivo será outro.
 *
 * Não substitui tratar o erro na origem: serve para o cliente ter sempre uma
 * saída e para o erro ficar registado.
 */
export function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[checkout] erro não apanhado:", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col gap-3">
        <h1
          className="text-[28px] leading-tight text-[#f7f4ef]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          Algo correu mal a preparar a sua reserva
        </h1>
        <p className="max-w-[440px] text-[15px] leading-relaxed text-[#999]">
          Não foi cobrado nada. Tente novamente — se o problema persistir,
          contacte-nos e tratamos da reserva consigo.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center gap-2 bg-[#c9a96e] px-8 text-[13px] font-semibold uppercase tracking-[1px] text-[#0d0d0d] transition-colors hover:bg-[#b89558]"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          Tentar novamente
        </button>
        {/* `<a>` e não `<Link>` de propósito: aqui já rebentou alguma coisa, e o
            router do cliente pode ser parte do que está partido. Uma navegação
            dura recarrega tudo do zero e é a saída que nunca falha. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex h-12 items-center gap-2 border border-[rgba(255,255,255,0.12)] bg-[#1a1918] px-6 text-[13px] font-semibold uppercase tracking-[1px] text-[#f7f4ef] transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Voltar ao início
        </a>
      </div>

      {error.digest && (
        <p className="text-[12px] text-[#696969]">Referência: {error.digest}</p>
      )}
    </div>
  )
}
