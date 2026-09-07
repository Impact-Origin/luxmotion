"use client"

import { cn } from "@workspace/ui/lib/utils"
import { formatAdminDate, formatAdminRelative } from "@/lib/admin-date"

/**
 * Quando é que isto entrou.
 *
 * Duas linhas de propósito: a data exacta, para se saber, e por baixo "há 9
 * dias", para se reparar. Numa lista de vinte pedidos é a segunda linha que faz
 * o trabalho — foi por não haver nenhuma das duas em metade dos separadores que
 * houve pedidos a passarem despercebidos.
 *
 * O relativo é calculado na altura da renderização e estas listas são todas do
 * lado do cliente (`useQuery` devolve `undefined` no servidor e desenha o
 * carregador), portanto não há aqui um desencontro de hidratação à espera.
 */
export function ReceivedAt({
  ts,
  className,
  compact = false,
}: {
  ts: number | undefined | null
  className?: string
  /** Só o relativo, com a data exacta no title. Para colunas estreitas. */
  compact?: boolean
}) {
  const exacta = formatAdminDate(ts)
  const relativa = formatAdminRelative(ts)

  if (compact) {
    return (
      <span className={cn("whitespace-nowrap text-muted-foreground", className)} title={exacta}>
        {relativa}
      </span>
    )
  }

  return (
    <div className={cn("whitespace-nowrap leading-tight", className)}>
      <div className="text-foreground tabular-nums">{exacta}</div>
      <div className="text-xs text-muted-foreground">{relativa}</div>
    </div>
  )
}
