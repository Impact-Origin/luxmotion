"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { ViewSectionOnSite, SECTION_URLS } from "@/components/admin/view-on-site"
import { ExperienceForm } from "@/components/admin/experience-form"
import {
  EntityFormDialog,
  useEntityFormParams,
} from "@/components/admin/entity-form-dialog"
import { Button } from "@workspace/ui/components/button"
import { Plus, Pencil, Trash2, MoreHorizontal, Briefcase, MapPin, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
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
import { toast } from "sonner"
import Image from "next/image"
import { StatusBadge } from "@/components/admin/status-badge"
import { TABLE_TEXT_CELL, DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table"

export default function AdminExperiencesPage() {
  const t = useTranslations("adminExperiences")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { isNew, editId, isOpen, openNew, openEdit, close } = useEntityFormParams()
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} })
  const res = useQuery(api.pastExperiences.listPaged, tableQuery)
  const removeExperience = useMutation(api.pastExperiences.remove)
  const updateExperience = useMutation(api.pastExperiences.update)

  // Só a galeria pública mostra o que estiver publicado. Alternar o estado
  // obrigava a abrir o formulário de edição, item a item.
  const togglePublished = async (exp: ExperienceRow) => {
    const next = exp.status === "published" ? "draft" : "published"
    try {
      await updateExperience({ id: exp._id, status: next })
      toast.success(next === "published" ? t("published") : t("draft"))
    } catch {
      toast.error(t("deleteError"))
    }
  }


  type ExperienceRow = NonNullable<typeof res>["rows"][number]

  const editing = editId ? res?.rows.find((r) => r._id === editId) : undefined

  const handleEdit = (experience: { _id: string }) => openEdit(experience._id)
  const handleCreate = () => openNew()

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await removeExperience({ id: deletingId as any })
      toast.success(t("deleteSuccess"))
    } catch (error) {
      toast.error(t("deleteError"))
    } finally {
      setDeletingId(null)
    }
  }

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`)
  }

  const rowActions = (exp: ExperienceRow) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(exp)}>
          <Pencil className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => togglePublished(exp)}>
          {exp.status === "published" ? (
            <EyeOff className="mr-2 size-4" />
          ) : (
            <Eye className="mr-2 size-4" />
          )}
          {exp.status === "published" ? t("draft") : t("published")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingId(exp._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const columns: DataTableColumn<ExperienceRow>[] = [
    {
      id: "title",
      header: t("form.titleLabel"),
      sortAccessor: (e) => e.title.toLowerCase(),
      cell: (e) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {e.imageUrl ? (
              <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
            ) : (
              <Briefcase className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className={TABLE_TEXT_CELL}>
            <span className="font-medium text-foreground line-clamp-1">{e.title}</span>
            <p className="text-xs text-muted-foreground line-clamp-1">{e.description}</p>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: t("category"),
      sortAccessor: (e) => e.category,
      cell: (e) => <span className="text-sm text-muted-foreground">{getCategoryLabel(e.category)}</span>,
    },
    {
      id: "location",
      header: t("form.locationLabel"),
      cell: (e) =>
        e.location ? (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <MapPin className="size-3.5 text-muted-foreground" />
            {e.location}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      id: "status",
      header: t("status"),
      cell: (e) => <StatusBadge status={e.status} label={t(e.status)} />,
    },
  ]

  const filters: DataTableFilter<ExperienceRow>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "published", label: t("published") },
        { value: "draft", label: t("draft") },
      ],
      predicate: (e, val) => e.status === val,
    },
    {
      id: "category",
      label: t("allCategories"),
      width: "w-[160px]",
      options: [
        { value: "corporate", label: t("categories.corporate") },
        { value: "weddings", label: t("categories.weddings") },
        { value: "events", label: t("categories.events") },
        { value: "privateTours", label: t("categories.privateTours") },
      ],
      predicate: (e, val) => e.category === val,
    },
  ]

  const renderCard = (exp: ExperienceRow) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[16/9] border-b border-border bg-muted/40">
        {exp.imageUrl ? (
          <Image src={exp.imageUrl} alt={exp.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Briefcase className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <StatusBadge status={exp.status} label={t(exp.status)} />
          {exp.location && (
            <span className="inline-flex items-center gap-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <MapPin className="size-3" />
              {exp.location}
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2">{rowActions(exp)}</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-xs text-muted-foreground">{getCategoryLabel(exp.category)}</div>
        <h3 className="line-clamp-1 font-medium text-foreground">{exp.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>
        {exp.tags && exp.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {exp.tags.map((tag: string) => (
              <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <DataTable<ExperienceRow>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["title", "location"]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        toolbarActions={
          <>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              {t("addExperience")}
            </Button>
            <ViewSectionOnSite href={SECTION_URLS.aboutUs} label="Ver no Sobre nós" />
          </>
        }
        emptyTitle={t("noExperiencesFound")}
        emptyDescription={t("tryFilters")}
        emptyIcon={Briefcase}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EntityFormDialog open={isOpen} onClose={close}>
        {isNew ? (
          <ExperienceForm onClose={close} />
        ) : editing ? (
          <ExperienceForm initialData={editing} onClose={close} />
        ) : (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </EntityFormDialog>
    </>
  )
}
