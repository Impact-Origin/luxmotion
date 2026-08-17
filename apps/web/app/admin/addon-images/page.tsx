"use client"

import * as React from "react"
import { useMemo } from "react"
import { useMutation, useQueries } from "convex/react"
import type { RequestForQueries } from "convex/react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { AlertTriangle, ImageIcon, Loader2, Search, Trash2, Upload } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { toast } from "sonner"
import { encolherImagem } from "@/lib/encolher-imagem"
import { MiniaturaImagem } from "@/components/admin/miniatura-imagem"

type ItemDaBiblioteca = {
  libraryId?: Id<"addonImages">
  storageId: string
  label: string
  url: string
  createdAt: number
  usageCount: number
}

type GrupoSemImagem = {
  titulo: string
  quantidade: number
  addonIds: Id<"tourAddons">[]
}

/**
 * `useQueries` e não `useQuery`, como em `hooks/use-site-settings.ts`: enquanto
 * as funções não estiverem deployadas no Convex o resultado chega como um Error
 * em vez de ser lançado durante o render, e a página abre vazia em vez de deitar
 * abaixo o admin inteiro.
 */
function useBiblioteca(): {
  itens: ItemDaBiblioteca[]
  semImagem: GrupoSemImagem[]
  aCarregar: boolean
  indisponivel: boolean
} {
  const queries = useMemo(
    () => ({
      biblioteca: { query: api.addonImages.list, args: {} },
      semImagem: { query: api.addonImages.listMissing, args: {} },
    }),
    [],
  )
  const r = useQueries(queries)

  return useMemo(() => {
    const lista = r.biblioteca
    const faltam = r.semImagem
    return {
      itens: Array.isArray(lista) ? (lista as ItemDaBiblioteca[]) : [],
      semImagem: Array.isArray(faltam) ? (faltam as GrupoSemImagem[]) : [],
      aCarregar: lista === undefined,
      indisponivel: lista instanceof Error,
    }
  }, [r.biblioteca, r.semImagem])
}

/**
 * Extras que aparecem no site sem fotografia nenhuma. Resolvem-se por título e
 * não um a um: "Bagagem Extra" é o mesmo extra repetido em dezenas de tours, e
 * escolher a imagem uma vez arruma-os todos.
 */
function BlocoSemImagem({
  grupos,
  biblioteca,
  onEscolher,
  onCarregar,
}: {
  grupos: GrupoSemImagem[]
  biblioteca: ItemDaBiblioteca[]
  onEscolher: (grupo: GrupoSemImagem, storageId: Id<"_storage">) => Promise<void>
  onCarregar: (ficheiro: File, nome?: string) => Promise<Id<"_storage">>
}) {
  const [aberto, setAberto] = React.useState<GrupoSemImagem | null>(null)
  const [aEnviar, setAEnviar] = React.useState(false)

  const total = grupos.reduce((n, g) => n + g.quantidade, 0)

  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {grupos.length} {grupos.length === 1 ? "extra" : "extras"} sem imagem,
            em {total} {total === 1 ? "tour ou evento" : "tours e eventos"}
          </p>
          <p className="text-xs text-muted-foreground">
            Escolhe uma imagem para cada um: fica logo em todos os tours e
            eventos onde esse extra aparece.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {grupos.map((g) => (
          <div
            key={g.titulo}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{g.titulo}</p>
              <p className="text-xs text-muted-foreground">
                Em {g.quantidade} {g.quantidade === 1 ? "extra" : "extras"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 text-xs"
              onClick={() => setAberto(g)}
            >
              Escolher
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={aberto !== null} onOpenChange={(v) => !v && setAberto(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Imagem para &quot;{aberto?.titulo}&quot;</DialogTitle>
            <DialogDescription>
              Fica em {aberto?.quantidade}{" "}
              {aberto?.quantidade === 1 ? "extra" : "extras"} de uma só vez.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {biblioteca.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                A biblioteca está vazia. Carrega uma imagem aqui em baixo.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {biblioteca.map((item) => (
                  <button
                    key={item.storageId}
                    type="button"
                    title={item.label}
                    onClick={async () => {
                      const g = aberto
                      setAberto(null)
                      if (g) await onEscolher(g, item.storageId as Id<"_storage">)
                    }}
                    className="overflow-hidden rounded-md border-2 border-transparent transition-colors hover:border-primary"
                  >
                    <MiniaturaImagem url={item.url} alt={item.label} />
                    <span className="block truncate px-1 py-1 text-[11px] text-muted-foreground">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:bg-accent ${
              aEnviar ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {aEnviar ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />A carregar…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Carregar uma imagem nova
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={aEnviar}
              onChange={async (e) => {
                const f = e.target.files?.[0]
                e.target.value = ""
                const g = aberto
                if (!f || !g) return
                try {
                  setAEnviar(true)
                  const storageId = await onCarregar(f, g.titulo)
                  setAberto(null)
                  await onEscolher(g, storageId)
                } catch (erro) {
                  console.error(erro)
                  toast.error("Não foi possível carregar a imagem.")
                } finally {
                  setAEnviar(false)
                }
              }}
            />
          </label>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/**
 * Detalhe de uma imagem, em painel lateral: a imagem em grande, o nome
 * editável e a lista de extras que a usam — que é o que interessa saber antes
 * de lhe mexer.
 */
function PainelDeDetalhe({
  item,
  onFechar,
  onRenomear,
  onApagar,
}: {
  item: ItemDaBiblioteca | null
  onFechar: () => void
  onRenomear: (item: ItemDaBiblioteca, valor: string) => void
  onApagar: (item: ItemDaBiblioteca) => void
}) {
  /* A query só corre com o painel aberto: percorre os extras todos, e não vale
     fazê-lo enquanto ninguém está a olhar. */
  const queries = useMemo(
    () =>
      (item
        ? {
            usos: {
              query: api.addonImages.usedBy,
              args: { storageId: item.storageId as Id<"_storage"> },
            },
          }
        : {}) as RequestForQueries,
    [item],
  )
  const bruto = (useQueries(queries) as Record<string, unknown>).usos
  const usos = Array.isArray(bruto)
    ? (bruto as {
        addonId: string
        addonTitle: string
        tipo: "tour" | "event"
        donoTitulo: string
      }[])
    : []

  return (
    <Sheet open={item !== null} onOpenChange={(aberto) => !aberto && onFechar()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        {item && (
          <>
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle className="truncate">{item.label}</SheetTitle>
              <SheetDescription>
                {item.usageCount === 0
                  ? "Não está a ser usada em nenhum extra"
                  : `Usada em ${item.usageCount} ${item.usageCount === 1 ? "extra" : "extras"}`}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <MiniaturaImagem
                url={item.url}
                alt={item.label}
                className="overflow-hidden rounded-lg border border-border"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Nome
                </label>
                <Input
                  key={item.storageId}
                  defaultValue={item.label}
                  onBlur={(e) => onRenomear(item, e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Onde aparece
                </p>
                {bruto === undefined ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : bruto instanceof Error ? (
                  /* Não é o mesmo que "ninguém a usa": dizer isso quando a
                     query falhou seria mentir sobre 23 extras. */
                  <p className="text-sm text-muted-foreground">
                    Não foi possível ler onde esta imagem aparece.
                  </p>
                ) : usos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum extra a usa de momento.
                  </p>
                ) : (
                  <ul className="divide-y divide-border rounded-md border border-border">
                    {usos.map((u) => (
                      <li key={u.addonId} className="px-3 py-2">
                        <p className="text-sm font-medium">{u.addonTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {u.tipo === "event" ? "Evento" : "Tour"} · {u.donoTitulo}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border-t border-border p-6">
              <Button
                type="button"
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onApagar(item)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar imagem
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default function AdminAddonImagesPage() {
  const { itens, semImagem, aCarregar, indisponivel } = useBiblioteca()

  const gerarUrlDeUpload = useMutation(api.addonImages.generateUploadUrl)
  const registar = useMutation(api.addonImages.add)
  const renomear = useMutation(api.addonImages.rename)
  const remover = useMutation(api.addonImages.remove)
  const atribuir = useMutation(api.addonImages.assign)

  const [pesquisa, setPesquisa] = React.useState("")
  const [aEnviar, setAEnviar] = React.useState(0)
  const [aApagar, setAApagar] = React.useState<ItemDaBiblioteca | null>(null)
  const [detalhe, setDetalhe] = React.useState<ItemDaBiblioteca | null>(null)

  const visiveis = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase()
    if (!termo) return itens
    return itens.filter((i) => i.label.toLowerCase().includes(termo))
  }, [itens, pesquisa])

  /** Sobe um ficheiro e devolve o `storageId`, já registado na biblioteca. */
  const subirUm = async (ficheiro: File, nome?: string) => {
    // Encolhida antes de subir: ver `lib/encolher-imagem.ts` para o porquê.
    const leve = await encolherImagem(ficheiro)
    const url = await gerarUrlDeUpload()
    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": leve.type },
      body: leve,
    })
    const { storageId } = await resposta.json()
    await registar({
      storageId: storageId as Id<"_storage">,
      // Nome do ficheiro sem extensão: é o melhor palpite, e edita-se depois.
      label: nome?.trim() || ficheiro.name.replace(/\.[^.]+$/, ""),
    })
    return storageId as Id<"_storage">
  }

  const carregar = async (ficheiros: FileList) => {
    const lista = [...ficheiros]
    setAEnviar(lista.length)
    let falhas = 0

    for (const ficheiro of lista) {
      try {
        await subirUm(ficheiro)
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
    if (!alvo) return
    setAApagar(null)
    try {
      const r = await remover({ storageId: alvo.storageId as Id<"_storage"> })
      const n = r?.extrasAfectados ?? 0
      toast.success(
        n > 0
          ? `Imagem apagada. ${n} ${n === 1 ? "extra ficou" : "extras ficaram"} sem imagem.`
          : "Imagem apagada.",
      )
    } catch (erro) {
      console.error(erro)
      toast.error("Não foi possível apagar a imagem.")
    }
  }

  const darImagemAoGrupo = async (
    grupo: GrupoSemImagem,
    storageId: Id<"_storage">,
  ) => {
    try {
      const r = await atribuir({
        storageId,
        addonIds: grupo.addonIds,
        label: grupo.titulo,
      })
      const n = r?.atribuidos ?? grupo.addonIds.length
      toast.success(
        `"${grupo.titulo}" ficou com imagem em ${n} ${n === 1 ? "extra" : "extras"}.`,
      )
    } catch (erro) {
      console.error(erro)
      toast.error("Não foi possível atribuir a imagem.")
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

      {semImagem.length > 0 && (
        <BlocoSemImagem
          grupos={semImagem}
          biblioteca={itens}
          onEscolher={darImagemAoGrupo}
          onCarregar={subirUm}
        />
      )}

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
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[92px]">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[140px]">Uso</TableHead>
                <TableHead className="w-[60px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((item) => (
                <TableRow
                  key={item.storageId}
                  className="cursor-pointer"
                  onClick={() => setDetalhe(item)}
                >
                  <TableCell className="py-2">
                    <MiniaturaImagem
                      url={item.url}
                      alt={item.label}
                      className="h-12 w-[68px] overflow-hidden rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.usageCount === 0
                      ? "Sem uso"
                      : item.usageCount === 1
                        ? "Em 1 extra"
                        : `Em ${item.usageCount} extras`}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      /* Sem isto o clique subia à linha e abria o painel por
                         cima do diálogo de apagar. */
                      onClick={(e) => {
                        e.stopPropagation()
                        setAApagar(item)
                      }}
                      title="Apagar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PainelDeDetalhe
        item={detalhe}
        onFechar={() => setDetalhe(null)}
        onRenomear={guardarNome}
        onApagar={(item) => {
          setDetalhe(null)
          setAApagar(item)
        }}
      />

      <AlertDialog
        open={aApagar !== null}
        onOpenChange={(aberto) => !aberto && setAApagar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar &quot;{aApagar?.label}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              {aApagar && aApagar.usageCount > 0
                ? `Está a ser usada em ${aApagar.usageCount} ${
                    aApagar.usageCount === 1 ? "extra, que fica" : "extras, que ficam"
                  } sem imagem. O ficheiro é apagado e não há como voltar atrás.`
                : "Ninguém está a usar esta imagem. O ficheiro é apagado e não há como voltar atrás."}
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
