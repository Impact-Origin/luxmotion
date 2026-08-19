"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { ViewOnSite, tourPublicUrl } from "@/components/admin/view-on-site"
import { Button } from "@workspace/ui/components/button"
import { TourTranslationForm } from "@/components/admin/tour-translation-form"
import { StatusBadge } from "@/components/admin/status-badge"
import { TABLE_TEXT_CELL, DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table"
import { Plus, Star, Award, Globe, Pencil, Trash2, MoreHorizontal, Map } from "lucide-react"
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

export default function AdminToursPage() {
  const t = useTranslations("adminTours")
  const router = useRouter()
  const [translatingTour, setTranslatingTour] = React.useState<any>(null)
  const [deletingTourId, setDeletingTourId] = React.useState<string | null>(null)

  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} })
  const res = useQuery(api.tours.listPaged, tableQuery)
  const destinations = useQuery(api.tours.getDestinations)
  const removeTour = useMutation(api.tours.remove)
  const toggleFeatured = useMutation(api.tours.toggleFeatured)
  const toggleBestseller = useMutation(api.tours.toggleBestseller)

  type Tour = NonNullable<typeof res>["rows"][number]

  const handleEdit = (tour: Tour) => {
    router.push(`/admin/tours/${tour._id}/edit`)
  }

  const handleCreate = () => {
    router.push("/admin/tours/new")
  }

  const handleDelete = async () => {
    if (!deletingTourId) return

    try {
      await removeTour({ id: deletingTourId as any })
      toast.success("Tour deleted successfully")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete tour",
      )
    } finally {
      setDeletingTourId(null)
    }
  }

  const handleToggleFeatured = async (tourId: string) => {
    try {
      await toggleFeatured({ id: tourId as any })
      toast.success("Tour updated")
    } catch (error) {
      toast.error("Failed to update tour")
    }
  }

  const handleToggleBestseller = async (tourId: string) => {
    try {
      await toggleBestseller({ id: tourId as any })
      toast.success("Tour updated")
    } catch (error) {
      toast.error("Failed to update tour")
    }
  }

  const priceSymbol = (currency: string) =>
    currency === "EUR" ? "€" : currency === "USD" ? "$" : "£"

  const rowActions = (tour: Tour) => (
    <div className="flex items-center justify-end gap-1">
    <ViewOnSite href={tourPublicUrl(tour)} />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleEdit(tour)}>
          <Pencil className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTranslatingTour(tour)}>
          <Globe className="mr-2 size-4" />
          {t("translations")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleFeatured(tour._id)}>
          <Star className="mr-2 size-4" />
          {tour.isFeatured ? t("removeFeatured") : t("markFeatured")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleBestseller(tour._id)}>
          <Award className="mr-2 size-4" />
          {tour.isBestSeller ? t("removeBestSeller") : t("markBestSeller")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingTourId(tour._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )

  const columns: DataTableColumn<Tour>[] = [
    {
      id: "title",
      header: t("title"),
      sortAccessor: (tour) => tour.title.toLowerCase(),
      cell: (tour) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {tour.bannerImageUrl ? (
              <Image src={tour.bannerImageUrl} alt={tour.title} fill className="object-cover" />
            ) : (
              <Map className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className={TABLE_TEXT_CELL}>
            <div className="flex items-center gap-1.5">
              <span className="truncate font-medium text-foreground">{tour.title}</span>
              {tour.isFeatured && <Star className="size-3.5 shrink-0 text-amber-500" />}
              {tour.isBestSeller && <Award className="size-3.5 shrink-0 text-amber-600" />}
            </div>
            <p className="text-xs capitalize text-muted-foreground">
              {tour.category} · {tour.destination}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: t("status"),
      cell: (tour) => <StatusBadge status={tour.status} />,
    },
    {
      id: "duration",
      header: "Duration",
      cell: (tour) => <span className="text-sm text-muted-foreground">{tour.duration}</span>,
    },
    {
      id: "rating",
      header: "Rating",
      align: "right",
      sortAccessor: (tour) => tour.rating ?? 0,
      cell: (tour) =>
        tour.rating !== undefined && tour.rating > 0 ? (
          <span className="inline-flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium tabular-nums">{tour.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({tour.reviewCount})</span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      id: "price",
      header: "Price",
      align: "right",
      sortAccessor: (tour) => tour.basePrice,
      cell: (tour) => (
        <span className="font-medium tabular-nums">
          {priceSymbol(tour.currency)}
          {tour.basePrice.toFixed(2)}
        </span>
      ),
    },
  ]

  const filters: DataTableFilter<Tour>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "published", label: t("published") },
        { value: "draft", label: t("draft") },
        { value: "archived", label: t("archived") },
      ],
      predicate: (tour, val) => tour.status === val,
    },
    {
      id: "category",
      label: t("allCategories"),
      width: "w-[150px]",
      options: [
        { value: "tours", label: t("tours") },
        { value: "experiences", label: t("experiences") },
        { value: "private", label: t("privateTours") },
      ],
      predicate: (tour, val) => tour.category === val,
    },
    {
      id: "destination",
      label: t("allDestinations"),
      width: "w-[150px]",
      options: (destinations ?? [])
        .filter((dest): dest is string => Boolean(dest?.trim()))
        .map((dest) => ({ value: dest, label: dest })),
      predicate: (tour, val) => tour.destination === val,
    },
  ]

  const renderCard = (tour: Tour) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[16/9] border-b border-border bg-muted/40">
        {tour.bannerImageUrl ? (
          <Image src={tour.bannerImageUrl} alt={tour.title} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Map className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <StatusBadge status={tour.status} />
          {tour.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-foreground">
              <Star className="size-3 text-amber-500" />
              {t("featured")}
            </span>
          )}
          {tour.isBestSeller && (
            <span className="inline-flex items-center gap-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-foreground">
              <Award className="size-3 text-amber-600" />
              {t("bestSeller")}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className={TABLE_TEXT_CELL}>
            <p className="text-xs capitalize text-muted-foreground">
              {tour.category} · {tour.destination}
            </p>
            <h3 className="line-clamp-2 font-medium text-foreground">{tour.title}</h3>
          </div>
          {rowActions(tour)}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">{tour.duration}</span>
          <span className="font-medium tabular-nums text-foreground">
            {priceSymbol(tour.currency)}
            {tour.basePrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <DataTable<Tour>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["title", "destination"]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        toolbarActions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 size-4" />
            {t("addTour")}
          </Button>
        }
        emptyTitle={t("noToursFound")}
        emptyDescription={t("tryFilters")}
        emptyIcon={Map}
      />

      {translatingTour && (
        <TourTranslationForm
          isOpen={!!translatingTour}
          onClose={() => setTranslatingTour(null)}
          tourId={translatingTour._id}
          tourTitle={translatingTour.title}
          originalLanguage={translatingTour.originalLanguage}
          availableLanguages={translatingTour.availableLanguages}
        />
      )}

      <AlertDialog open={!!deletingTourId} onOpenChange={() => setDeletingTourId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTourTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteTourDescription")}
            </AlertDialogDescription>
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
    </>
  )
}
