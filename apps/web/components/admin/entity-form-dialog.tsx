"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"

/**
 * Criar e editar sem sair da lista.
 *
 * Cada entidade do admin tinha três rotas — a lista, `/new` e `/[id]/edit` — e
 * as duas últimas eram cola: onze linhas a montar `<XForm onClose>` e trinta a
 * repetir `useParams` + `useQuery` + spinner. Os formulários já recebem
 * `{ initialData?, onClose }` e já trazem cabeçalho e X próprios; só lhes
 * faltava o invólucro.
 *
 * O estado vive no URL (`?new=1`, `?edit=<id>`) e não em `useState`, para o
 * bookmark, o F5 e o botão "voltar" continuarem a funcionar como funcionavam
 * com rotas — é a mesma convenção que `/admin/upsells` já usa com `?tab=`.
 */
export function useEntityFormParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isNew = searchParams.get("new") === "1"
  const editId = searchParams.get("edit")

  /* Preserva o que já lá estiver. O `/admin/upsells` guarda o separador aberto
     em `?tab=`; abrir um formulário não pode fazê-lo saltar para o outro. */
  const withParams = React.useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) next.delete(key)
        else next.set(key, value)
      }
      const qs = next.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, searchParams],
  )

  const openNew = React.useCallback(() => {
    router.push(withParams({ new: "1", edit: null }))
  }, [router, withParams])

  const openEdit = React.useCallback(
    (id: string) => {
      router.push(withParams({ edit: id, new: null }))
    },
    [router, withParams],
  )

  /* `replace` e não `push`: fechar não deve deixar o formulário no histórico,
     senão o "voltar" reabre-o em vez de sair da lista. */
  const close = React.useCallback(() => {
    router.replace(withParams({ new: null, edit: null }))
  }, [router, withParams])

  return { isNew, editId, isOpen: isNew || Boolean(editId), openNew, openEdit, close }
}

export function EntityFormDialog({
  open,
  onClose,
  children,
  /**
   * Bloqueia ESC e clique fora nos formulários grandes. Não há nenhuma guarda
   * contra perda de trabalho no admin — `beforeunload`, `isDirty` e `unsaved`
   * não aparecem uma única vez em `components/admin/` — por isso, com muitos
   * campos preenchidos, um ESC distraído apagava tudo sem aviso.
   */
  guardAgainstDismiss = false,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  guardAgainstDismiss?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl max-h-[90vh] p-0 flex flex-col overflow-hidden"
        onEscapeKeyDown={guardAgainstDismiss ? (e) => e.preventDefault() : undefined}
        onInteractOutside={guardAgainstDismiss ? (e) => e.preventDefault() : undefined}
      >
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
