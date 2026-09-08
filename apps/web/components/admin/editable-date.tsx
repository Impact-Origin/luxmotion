"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { formatAdminDate, formatAdminRelative } from "@/lib/admin-date"

/**
 * Uma data que se pode corrigir sem sair da lista.
 *
 * Nasceu para as reviews: uma review só entra pelo formulário do site, que
 * grava o instante da submissão. Quando é uma avaliação antiga a ser passada
 * para cá, a data fica a de hoje — e é essa que o visitante lê.
 *
 * Mostra o que `ReceivedAt` mostra, com um lápis ao lado. É genérico de
 * propósito: qualquer campo de data do back-office pode usá-lo.
 */

function paraCampo(ts: number): string {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ""
  const dois = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}T${dois(d.getHours())}:${dois(d.getMinutes())}`
}

export function EditableDate({
  ts,
  onSave,
  label = "Alterar a data",
  className,
}: {
  ts: number
  /** Recebe o novo instante em milissegundos. Lança para recusar. */
  onSave: (ms: number) => Promise<unknown>
  label?: string
  className?: string
}) {
  const [aEditar, setAEditar] = React.useState(false)
  const [valor, setValor] = React.useState(() => paraCampo(ts))
  const [aGravar, setAGravar] = React.useState(false)

  /* Enquanto não se está a editar, o campo segue o que vem de fora — senão uma
     gravação feita noutro sítio deixava aqui o valor velho à espera. */
  React.useEffect(() => {
    if (!aEditar) setValor(paraCampo(ts))
  }, [ts, aEditar])

  async function gravar() {
    const ms = new Date(valor).getTime()
    if (Number.isNaN(ms)) {
      toast.error("Data inválida")
      return
    }
    setAGravar(true)
    try {
      await onSave(ms)
      toast.success("Data actualizada")
      setAEditar(false)
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível gravar a data")
    } finally {
      setAGravar(false)
    }
  }

  if (!aEditar) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <span>
          {formatAdminDate(ts)} · {formatAdminRelative(ts)}
        </span>
        <button
          type="button"
          onClick={() => setAEditar(true)}
          aria-label={label}
          title={label}
          /* Sempre visível, e não só ao passar o rato: um lápis que só aparece
             quando já se sabe que está lá não serve a quem o anda a procurar. */
          className="rounded p-0.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
        >
          <Pencil className="size-3" />
        </button>
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <input
        type="datetime-local"
        value={valor}
        autoFocus
        disabled={aGravar}
        max={paraCampo(Date.now())}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            void gravar()
          }
          if (e.key === "Escape") setAEditar(false)
        }}
        className="h-7 rounded-md border border-border bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
      <button
        type="button"
        onClick={() => void gravar()}
        disabled={aGravar}
        aria-label="Gravar"
        className="rounded p-1 text-green-600 hover:bg-accent disabled:opacity-50"
      >
        <Check className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setAEditar(false)}
        disabled={aGravar}
        aria-label="Cancelar"
        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
      >
        <X className="size-3.5" />
      </button>
    </span>
  )
}
