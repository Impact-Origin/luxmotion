"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { useSafeQuery } from "@/hooks/use-safe-query"
import { UpsellStopForm } from "@/components/admin/upsell-stop-form"
import { UpsellExperienceForm } from "@/components/admin/upsell-experience-form"
import {
  EntityFormDialog,
  useEntityFormParams,
} from "@/components/admin/entity-form-dialog"
import type { Id } from "@workspace/convex/dataModel"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  MapPin,
  Globe2,
  Sparkles,
  Send,
  EyeOff,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import { cn } from "@workspace/ui/lib/utils"
import { StatusBadge } from "@/components/admin/status-badge"
import { TABLE_TEXT_CELL, DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table"
import {
  PRICING_LABELS,
  TAG_LABELS,
  type UpsellTag,
} from "@/components/admin/upsell-shared"
import { useSiteSettings } from "@/hooks/use-site-settings"

type Tab = "stops" | "experiences"

const STATUS_FILTER = {
  id: "status",
  label: "Todos os estados",
  width: "w-[150px]",
  options: [
    { value: "published", label: "Publicado" },
    { value: "draft", label: "Rascunho" },
  ],
} as const

const SCOPE_FILTER = {
  id: "scope",
  label: "Universal e geográficos",
  width: "w-[190px]",
  options: [
    { value: "universal", label: "Universais" },
    { value: "geographic", label: "Por localização" },
  ],
} as const

function TagBadge({ tag }: { tag: UpsellTag }) {
  if (tag === "none") return null
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tag === "mostPopular"
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground",
      )}
    >
      {TAG_LABELS[tag]}
    </span>
  )
}

function ScopeCell({
  universal,
  location,
}: {
  universal: boolean
  location?: { title: string; lat?: number; lng?: number } | null
}) {
  if (universal) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Globe2 className="size-3.5" />
        Universal
      </span>
    )
  }
  // Sem coordenadas o cross-match nunca o mostra — dizê-lo aqui poupa a
  // ninguém andar à procura do upsell que "não aparece".
  const missing = location?.lat == null || location?.lng == null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm",
        missing ? "text-destructive" : "text-muted-foreground",
      )}
    >
      <MapPin className="size-3.5" />
      {missing ? "Sem coordenadas" : location?.title}
    </span>
  )
}

function Thumb({ url, title }: { url: string | null; title: string }) {
  return (
    <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
      {url ? (
        <Image src={url} alt={title} fill className="object-cover" />
      ) : (
        <ImageIcon className="size-4 text-muted-foreground" />
      )}
    </div>
  )
}

function FormLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function AdminUpsellsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const settings = useSiteSettings()

  const [tab, setTab] = React.useState<Tab>(
    searchParams.get("tab") === "experiences" ? "experiences" : "stops",
  )
  const [stopsQuery, setStopsQuery] = React.useState<DataTableQuery>({
    page: 0,
    pageSize: 10,
    filters: {},
  })
  const [experiencesQuery, setExperiencesQuery] = React.useState<DataTableQuery>({
    page: 0,
    pageSize: 10,
    filters: {},
  })
  const [deleting, setDeleting] = React.useState<{ type: Tab; id: string } | null>(null)
  /* O separador aberto já decide o tipo, por isso o formulário não precisa de o
     repetir no URL: `?tab=experiences&new=1` é uma experiência nova. */
  const { isNew, editId, isOpen, openNew, openEdit, close } = useEntityFormParams()

  /* As duas queries ficam sempre montadas: assim trocar de tab é instantâneo em
     vez de mostrar um skeleton de cada vez que se salta entre elas.

     `useSafeQuery` e não `useQuery`: enquanto o Convex não for deployed estas
     funções não existem, e o `useQuery` rebentava esta página inteira — que é
     precisamente o único sítio onde os upsells se criam. Aqui o erro é
     apresentado, com o comando que o resolve. */
  const { data: stopsRes, error: stopsError } = useSafeQuery(
    api.upsells.listStopsPaged,
    stopsQuery,
  )
  const { data: experiencesRes, error: experiencesError } = useSafeQuery(
    api.upsells.listExperiencesPaged,
    experiencesQuery,
  )
  const backendMissing = stopsError ?? experiencesError

  const removeStop = useMutation(api.upsells.removeStop)
  const removeExperience = useMutation(api.upsells.removeExperience)
  const updateStop = useMutation(api.upsells.updateStop)
  const updateExperience = useMutation(api.upsells.updateExperience)

  type StopRow = NonNullable<typeof stopsRes>["rows"][number]
  type ExperienceRow = NonNullable<typeof experiencesRes>["rows"][number]

  const editingStop = editId ? stopsRes?.rows.find((r) => r._id === editId) : undefined
  const editingExperience = editId
    ? experiencesRes?.rows.find((r) => r._id === editId)
    : undefined

  const changeTab = (next: Tab) => {
    setTab(next)
    router.replace(next === "stops" ? "/admin/upsells" : "/admin/upsells?tab=experiences")
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      if (deleting.type === "stops") {
        await removeStop({ id: deleting.id as Id<"upsellStops"> })
      } else {
        await removeExperience({ id: deleting.id as Id<"upsellExperiences"> })
      }
      toast.success("Apagado")
    } catch {
      toast.error("Não foi possível apagar")
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (type: Tab, id: string, isPublished: boolean) => {
    const status = isPublished ? "draft" : "published"
    try {
      if (type === "stops") {
        await updateStop({ id: id as Id<"upsellStops">, status })
      } else {
        await updateExperience({ id: id as Id<"upsellExperiences">, status })
      }
      toast.success(isPublished ? "Passou a rascunho" : "Publicado")
    } catch {
      toast.error("Não foi possível actualizar")
    }
  }

  const rowMenu = (type: Tab, id: string, isPublished: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openEdit(id)}>
          <Pencil className="mr-2 size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => togglePublish(type, id, isPublished)}>
          {isPublished ? (
            <>
              <EyeOff className="mr-2 size-4" />
              Despublicar
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Publicar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeleting({ type, id })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const stopColumns: DataTableColumn<StopRow>[] = [
    {
      id: "title",
      header: "Paragem",
      sortAccessor: (r) => r.title.toLowerCase(),
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Thumb url={r.imageUrl} title={r.title} />
          <div className={TABLE_TEXT_CELL}>
            <div className="flex items-center gap-1.5">
              <span className="line-clamp-1 font-medium text-foreground">{r.title}</span>
              <TagBadge tag={r.tag} />
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">{r.description}</p>
          </div>
        </div>
      ),
    },
    {
      id: "scope",
      header: "Onde aparece",
      cell: (r) => <ScopeCell universal={r.universal} location={r.location} />,
    },
    {
      id: "status",
      header: "Estado",
      cell: (r) => (
        <StatusBadge
          status={r.status}
          label={r.status === "published" ? "Publicado" : "Rascunho"}
        />
      ),
    },
    {
      id: "price",
      header: "Preço",
      align: "right",
      sortAccessor: (r) => r.price30,
      cell: (r) => (
        <div className="text-sm tabular-nums">
          <span className="font-medium text-foreground">€{r.price30.toFixed(0)}</span>
          <span className="ml-1 text-muted-foreground">/ 30 min</span>
          {r.price15 != null && (
            <div className="text-xs text-muted-foreground">
              €{r.price15.toFixed(0)} / 15 min
            </div>
          )}
        </div>
      ),
    },
  ]

  const experienceColumns: DataTableColumn<ExperienceRow>[] = [
    {
      id: "title",
      header: "Experiência",
      sortAccessor: (r) => r.title.toLowerCase(),
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Thumb url={r.imageUrl} title={r.title} />
          <div className={TABLE_TEXT_CELL}>
            <div className="flex items-center gap-1.5">
              <span className="line-clamp-1 font-medium text-foreground">{r.title}</span>
              <TagBadge tag={r.tag} />
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {r.duration ? `${r.duration} · ` : ""}
              {(r.addons ?? []).length > 0
                ? `${(r.addons ?? []).length} extra(s)`
                : "sem extras"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "scope",
      header: "Onde aparece",
      cell: (r) => <ScopeCell universal={r.universal} location={r.location} />,
    },
    {
      id: "status",
      header: "Estado",
      cell: (r) => (
        <StatusBadge
          status={r.status}
          label={r.status === "published" ? "Publicado" : "Rascunho"}
        />
      ),
    },
    {
      id: "price",
      header: "Preço",
      align: "right",
      sortAccessor: (r) => r.basePrice,
      cell: (r) => (
        <div className="text-sm tabular-nums">
          <span className="font-medium text-foreground">€{r.basePrice.toFixed(0)}</span>
          <div className="text-xs text-muted-foreground">
            {PRICING_LABELS[r.pricingModel]}
          </div>
        </div>
      ),
    },
  ]

  const stopFilters: DataTableFilter<StopRow>[] = [
    { ...STATUS_FILTER, options: [...STATUS_FILTER.options] },
    { ...SCOPE_FILTER, options: [...SCOPE_FILTER.options] },
  ]
  const experienceFilters: DataTableFilter<ExperienceRow>[] = [
    { ...STATUS_FILTER, options: [...STATUS_FILTER.options] },
    { ...SCOPE_FILTER, options: [...SCOPE_FILTER.options] },
    {
      id: "pricingModel",
      label: "Todos os modelos",
      width: "w-[160px]",
      options: [
        { value: "perPerson", label: "Por pessoa" },
        { value: "flat", label: "Preço fixo" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Upsells</h1>
        <p className="text-sm text-muted-foreground">
          Os extras oferecidos a meio do checkout de um transfer. Os que não são
          universais só aparecem a menos de{" "}
          <strong className="font-medium text-foreground">
            {settings.checkoutUpsellRadiusKm} km
          </strong>{" "}
          do destino — muda o raio em{" "}
          <Link href="/admin/numbers" className="underline underline-offset-2">
            Numbers
          </Link>
          .
        </p>
      </div>

      {backendMissing && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-foreground">
            O backend ainda não tem os upsells.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            As tabelas existem no código mas não no deployment. Corre{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              npx convex deploy
            </code>{" "}
            a partir de <code className="text-xs">packages/convex</code>. Até lá
            esta página fica vazia e não é possível gravar.
          </p>
        </div>
      )}

      <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1">
        {(
          [
            { id: "stops" as const, label: "Paragens extra", icon: MapPin },
            { id: "experiences" as const, label: "Experiências", icon: Sparkles },
          ]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeTab(item.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "stops" ? (
        <DataTable<StopRow>
          mode="server"
          data={stopsRes?.rows}
          total={stopsRes?.total ?? 0}
          pageSize={10}
          onQueryChange={setStopsQuery}
          columns={stopColumns}
          views={["table"]}
          searchPlaceholder="Procurar paragens…"
          filters={stopFilters}
          rowActions={(r) => rowMenu("stops", r._id, r.status === "published")}
          onRowClick={(r) => openEdit(r._id)}
          toolbarActions={
            <Button onClick={openNew}>
              <Plus className="mr-2 size-4" />
              Paragem
            </Button>
          }
          emptyTitle="Ainda não há paragens extra"
          emptyDescription="Uma paragem é um desvio curto no trajecto, cobrado a preço fixo."
          emptyIcon={MapPin}
        />
      ) : (
        <DataTable<ExperienceRow>
          mode="server"
          data={experiencesRes?.rows}
          total={experiencesRes?.total ?? 0}
          pageSize={10}
          onQueryChange={setExperiencesQuery}
          columns={experienceColumns}
          views={["table"]}
          searchPlaceholder="Procurar experiências…"
          filters={experienceFilters}
          rowActions={(r) => rowMenu("experiences", r._id, r.status === "published")}
          onRowClick={(r) => openEdit(r._id)}
          toolbarActions={
            <Button onClick={openNew}>
              <Plus className="mr-2 size-4" />
              Experiência
            </Button>
          }
          emptyTitle="Ainda não há experiências"
          emptyDescription="Experiências no destino, com extras próprios, oferecidas no checkout."
          emptyIcon={Sparkles}
        />
      )}

      <EntityFormDialog open={isOpen} onClose={close} guardAgainstDismiss>
        {tab === "stops" ? (
          isNew ? (
            <UpsellStopForm onClose={close} />
          ) : editingStop ? (
            <UpsellStopForm initialData={editingStop} onClose={close} />
          ) : (
            <FormLoading />
          )
        ) : isNew ? (
          <UpsellExperienceForm onClose={close} />
        ) : editingExperience ? (
          <UpsellExperienceForm initialData={editingExperience} onClose={close} />
        ) : (
          <FormLoading />
        )}
      </EntityFormDialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar este upsell?</AlertDialogTitle>
            <AlertDialogDescription>
              Deixa de aparecer no checkout imediatamente. As reservas já feitas não são
              afectadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
