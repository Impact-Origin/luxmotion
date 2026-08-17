"use client"

import * as React from "react"
import { useMemo } from "react"
import { useMutation, useQueries } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
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
import { ImageIcon, Loader2, Search, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

type ItemDaBiblioteca = {
  libraryId?: Id<"addonImages">
  storageId: string
  label: string
  url: string
  createdAt: number
  usageCount: number
}

/**
 * `useQueries` e não `useQuery`, como em `hooks/use-site-settings.ts`: enquanto
 * `addonImages.list` não estiver deployada no Convex o resultado chega como um
 * Error em vez de ser lançado durante o render, e a página abre vazia em vez de
 * deitar abaixo o admin inteiro.
 */
function useBiblioteca(): {
  itens: ItemDaBiblioteca[]
  aCarregar: boolean
  indisponivel: boolean
} {
  const queries = useMemo(
    () => ({ biblioteca: { query: api.addonImages.list, args: {} } }),
    [],
  )
  const bruto = useQueries(queries).biblioteca

  return useMemo(() => {
    if (bruto instanceof Error)
      return { itens: [], aCarregar: false, indisponivel: true }
    if (bruto === undefined)
      return { itens: [], aCarregar: true, indisponivel: false }
    return {
      itens: bruto as ItemDaBiblioteca[],
      aCarregar: false,
      indisponivel: false,
    }
  }, [bruto])
}

export default function AdminAddonImagesPage() {
  const { itens, aCarregar, indisponivel } = useBiblioteca()

  const gerarUrlDeUpload = useMutation(api.addonImages.generateUploadUrl)
  const registar = useMutation(api.addonImages.add)
  const renomear = useMutation(api.addonImages.rename)
  const remover = useMutation(api.addonImages.remove)

  const [pesquisa, setPesquisa] = React.useState("")
  const [aEnviar, setAEnviar] = React.useState(0)
  const [aApagar, setAApagar] = React.useState<ItemDaBiblioteca | null>(null)

  const visiveis = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase()
    if (!termo) return itens
    return itens.filter((i) => i.label.toLowerCase().includes(termo))
  }, [itens, pesquisa])

  const carregar = async (ficheiros: FileList) => {
    const lista = [...ficheiros]
    setAEnviar(lista.length)
    let falhas = 0

    for (const ficheiro of lista) {
      try {
        const url = await gerarUrlDeUpload()
        const resposta = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": ficheiro.type },
          body: ficheiro,
        })
        const { storageId } = await resposta.json()
        await registar({
          storageId: storageId as Id<"_storage">,
          // Nome do ficheiro sem extensão: é o melhor palpite, e edita-se aqui.
          label: ficheiro.name.replace(/\.[^.]+$/, ""),
        })
      } catch (erro) {
        console.error("Upload da imagem falhou:", erro)
        falhas++
      } finally {
        setAEnviar((n) => n - 1)
      }
    }

    if (falhas === 0) {
      toast.success(
        lista.length === 1
          ? "Imagem carregada."
          : `${lista.length} imagens carregadas.`,
      )
    } else {
      toast.error(`${falhas} de ${lista.length} imagens não foram carregadas.`)
    }
  }

  const confirmarApagar = async () => {
    const alvo = aApagar
    if (!alvo?.libraryId) return
    setAApagar(null)
    try {
      const r = await remover({ id: alvo.libraryId })
      toast.success(
        r?.ficheiroMantido
          ? "Retirada da biblioteca. O ficheiro fica, porque há extras a usá-lo."
          : "Imagem apagada.",
      )
    } catch (erro) {
      console.error(erro)
      toast.error("Não foi possível apagar a imagem.")
    }
  }

  const guardarNome = (item: ItemDaBiblioteca, valor: string) => {
    const novo = valor.trim()
    if (!novo || novo === item.label) return
    /* As imagens herdadas dos extras ainda não têm linha na biblioteca: escrever
       o nome é o que as regista. Sem isto o nome não ficava guardado. */
    if (item.libraryId) {
      void renomear({ id: item.libraryId, label: novo })
    } else {
      void registar({ storageId: item.storageId as Id<"_storage">, label: novo })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Carrega aqui as imagens dos extras uma vez. Depois, no separador dos
          extras de um tour ou de um evento, é só escolhê-las da biblioteca — sem
          voltar a carregar o ficheiro.
        </p>

        <label className="shrink-0">
          <Button asChild disabled={aEnviar > 0 || indisponivel}>
            <span className="cursor-pointer">
              {aEnviar > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A carregar…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Carregar imagens
                </>
              )}
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={aEnviar > 0 || indisponivel}
            onChange={(e) => {
              const f = e.target.files
              if (f && f.length > 0) void carregar(f)
              e.target.value = ""
            }}
          />
        </label>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Procurar por nome"
          className="pl-9"
        />
      </div>

      {indisponivel ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          A biblioteca ainda não está disponível no servidor. Faz o deploy do
          Convex e volta aqui.
        </div>
      ) : aCarregar ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : visiveis.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {itens.length === 0
              ? "Ainda não há imagens. Carrega as primeiras aqui em cima."
              : "Nenhuma imagem com esse nome."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visiveis.map((item) => (
            <div
              key={item.storageId}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative aspect-video bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.label}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2 p-3">
                <Input
                  defaultValue={item.label}
                  onBlur={(e) => guardarNome(item, e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {item.usageCount === 0
                      ? "Sem uso"
                      : item.usageCount === 1
                        ? "Em 1 extra"
                        : `Em ${item.usageCount} extras`}
                  </span>
                  {/* Só as registadas se apagam: as herdadas não têm linha para
                      apagar, e o ficheiro é do extra que a usa. */}
                  {item.libraryId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setAApagar(item)}
                      title="Apagar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={aApagar !== null}
        onOpenChange={(aberto) => !aberto && setAApagar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar &quot;{aApagar?.label}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              {aApagar && aApagar.usageCount > 0
                ? `Esta imagem está a ser usada em ${aApagar.usageCount} ${
                    aApagar.usageCount === 1 ? "extra" : "extras"
                  }. Sai da biblioteca, mas o ficheiro fica e esses extras continuam a mostrá-la.`
                : "Ninguém está a usar esta imagem, por isso o ficheiro é mesmo apagado. Não há como voltar atrás."}
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
