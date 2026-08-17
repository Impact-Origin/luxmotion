"use client"

import * as React from "react"
import { useMemo } from "react"
import { useMutation, useQueries } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Button } from "@workspace/ui/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Layers, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  DataTable,
  TABLE_TEXT_CELL,
  type DataTableColumn,
} from "@/components/admin/data-table"
import { MiniaturaImagem } from "@/components/admin/miniatura-imagem"
import {
  EntityFormDialog,
  useEntityFormParams,
} from "@/components/admin/entity-form-dialog"
import {
  UniversalAddonForm,
  type AmbitoExtra,
} from "@/components/admin/universal-addon-form"
import { ConversorDeRepetidos } from "@/components/admin/universal-addons-migration"

type Linha = {
  _id: Id<"universalAddons">
  title: string
  description?: string
  imageUrl: string | null
  price: number
  pricingType: "per_person" | "flat"
  currency: string
  scopes: AmbitoExtra[]
  status: "draft" | "published"
  order: number
}

const ROTULO_AMBITO: Record<AmbitoExtra, string> = {
  tours: "Tours",
  events: "Eventos",
  ultraLuxury: "Ultra-luxo",
}

/**
 * `useQueries` e não `useQuery`, como em `hooks/use-site-settings.ts`: enquanto
 * `universalAddons.list` não estiver deployada, o resultado chega como um Error
 * em vez de ser lançado durante o render, e a página abre vazia em vez de deitar
 * abaixo o admin inteiro.
 */
function useUniversais() {
  const queries = useMemo(
    () => ({ lista: { query: api.universalAddons.list, args: {} } }),
    [],
  )
  const bruto = useQueries(queries).lista

  return useMemo(
    () => ({
      linhas: Array.isArray(bruto) ? (bruto as Linha[]) : [],
      aCarregar: bruto === undefined,
      indisponivel: bruto instanceof Error,
    }),
    [bruto],
  )
}

export default function AdminUniversalAddonsPage() {
  const { linhas, aCarregar, indisponivel } = useUniversais()
  const { isNew, editId, isOpen, openNew, openEdit, close } = useEntityFormParams()
  const remover = useMutation(api.universalAddons.remove)
  const [aApagar, setAApagar] = React.useState<Linha | null>(null)

  const aEditar = editId ? linhas.find((l) => l._id === editId) : undefined

  const colunas: DataTableColumn<Linha>[] = useMemo(
    () => [
      {
        id: "imagem",
        header: "Imagem",
        headerClassName: "w-[92px]",
        cell: (l) =>
          l.imageUrl ? (
            <MiniaturaImagem
              url={l.imageUrl}
              alt={l.title}
              className="h-12 w-[68px] overflow-hidden rounded"
            />
          ) : (
            <div className="h-12 w-[68px] rounded bg-muted/40" />
          ),
      },
      {
        id: "titulo",
        header: "Título",
        /* Sem tecto de largura, a descrição — que é uma frase inteira — vira
           uma linha indivisível e empurra a tabela para fora do ecrã. É o que o
           `TABLE_TEXT_CELL` existe para resolver. */
        cellClassName: TABLE_TEXT_CELL,
        cell: (l) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{l.title}</p>
            {l.description && (
              <p className="truncate text-xs text-muted-foreground">{l.description}</p>
            )}
          </div>
        ),
        sortAccessor: (l) => l.title.toLowerCase(),
      },
      {
        id: "ambitos",
        header: "Onde aparece",
        headerClassName: "w-[200px]",
        cell: (l) => (
          <div className="flex flex-wrap gap-1">
            {l.scopes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {ROTULO_AMBITO[s]}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "preco",
        header: "Preço",
        headerClassName: "w-[140px]",
        cell: (l) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {l.price.toFixed(2)} € {l.pricingType === "per_person" ? "/ pessoa" : "fixo"}
          </span>
        ),
        sortAccessor: (l) => l.price,
      },
      {
        id: "estado",
        header: "Estado",
        headerClassName: "w-[110px]",
        cell: (l) => (
          <span className="text-muted-foreground">
            {l.status === "published" ? "Publicado" : "Rascunho"}
          </span>
        ),
        sortAccessor: (l) => l.status,
      },
    ],
    [],
  )

  const confirmarApagar = async () => {
    const alvo = aApagar
    if (!alvo) return
    setAApagar(null)
    try {
      await remover({ id: alvo._id })
      toast.success("Extra universal apagado.")
    } catch (erro) {
      console.error(erro)
      toast.error("Não foi possível apagar.")
    }
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Um extra definido aqui aparece em todos os tours ou eventos do seu âmbito,
        sem ser copiado para cada um. Cada tour pode desligar os que não lhe servem,
        no seu próprio separador de complementos.
      </p>

      <ConversorDeRepetidos />

      {indisponivel ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Os extras universais ainda não estão disponíveis no servidor. Faz o deploy
          do Convex e volta aqui.
        </div>
      ) : (
        <DataTable<Linha>
          data={aCarregar ? undefined : linhas}
          columns={colunas}
          searchKeys={["title"]}
          searchPlaceholder="Procurar por título"
          pageSize={12}
          getRowId={(l) => l._id}
          onRowClick={(l) => openEdit(l._id)}
          rowActions={(l) => (
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openEdit(l._id)}
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setAApagar(l)}
                title="Apagar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          toolbarActions={
            <Button onClick={openNew}>
              <Plus className="mr-2 size-4" />
              Novo extra universal
            </Button>
          }
          emptyTitle="Ainda não há extras universais"
          emptyDescription="Cria o primeiro, ou converte os repetidos que já existem."
          emptyIcon={Layers}
        />
      )}

      <EntityFormDialog open={isOpen} onClose={close}>
        {isNew ? (
          <UniversalAddonForm onClose={close} />
        ) : aEditar ? (
          <UniversalAddonForm initialData={aEditar} onClose={close} />
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Extra não encontrado.
          </div>
        )}
      </EntityFormDialog>

      <AlertDialog
        open={aApagar !== null}
        onOpenChange={(aberto) => !aberto && setAApagar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar &quot;{aApagar?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Deixa de aparecer em todos os tours e eventos do seu âmbito. As reservas
              já feitas guardam o que foi vendido e não mudam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarApagar}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
