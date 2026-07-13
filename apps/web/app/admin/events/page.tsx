"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { EventTranslationForm } from "@/components/admin/event-translation-form"
import {
  Plus,
  Star,
  Globe,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  MapPin,
  XCircle,
} from "lucide-react"
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
import { DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table"

export default function AdminEventsPage() {
  const t = useTranslations("adminEvents")
  const router = useRouter()
  const [translatingEvent, setTranslatingEvent] = React.useState<any>(null)
  const [deletingEventId, setDeletingEventId] = React.useState<string | null>(null)

  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} })
  const res = useQuery(api.events.listPaged, tableQuery)
  const locations = useQuery(api.events.getLocations)
  const removeEvent = useMutation(api.events.remove)
  const toggleFeatured = useMutation(api.events.toggleFeatured)
  const cancelEvent = useMutation(api.events.cancel)

  type EventRow = NonNullable<typeof res>["rows"][number]

  const handleEdit = (event: any) => {
    router.push(`/admin/events/${event._id}/edit`)
  }

  const handleCreate = () => {
    router.push("/admin/events/new")
  }

  const handleDelete = async () => {
    if (!deletingEventId) return

    try {
      await removeEvent({ id: deletingEventId as any })
      toast.success("Event deleted successfully")
    } catch (error) {
      toast.error("Failed to delete event")
    } finally {
      setDeletingEventId(null)
    }
  }

  const handleToggleFeatured = async (eventId: string) => {
    try {
      await toggleFeatured({ id: eventId as any })
      toast.success("Event updated")
    } catch (error) {
      toast.error("Failed to update event")
    }
  }

  const handleCancel = async (eventId: string) => {
    try {
      await cancelEvent({ id: eventId as any })
      toast.success("Event cancelled")
    } catch (error) {
      toast.error("Failed to cancel event")
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (event: EventRow) => {
    const symbol = event.currency === "EUR" ? "€" : event.currency === "USD" ? "$" : "£"
    return `${symbol}${event.basePrice.toFixed(2)}`
  }

  const rowActions = (event: EventRow) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(event)}>
          <Pencil className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTranslatingEvent(event)}>
          <Globe className="mr-2 size-4" />
          {t("translations")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`/events/${event.slug}`, "_blank")}>
          <Eye className="mr-2 size-4" />
          {t("preview")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleFeatured(event._id)}>
          <Star className="mr-2 size-4" />
          {event.isFeatured ? t("removeFeatured") : t("markFeatured")}
        </DropdownMenuItem>
        {event.status === "published" && (
          <DropdownMenuItem onClick={() => handleCancel(event._id)}>
            <XCircle className="mr-2 size-4" />
            {t("cancelEvent")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingEventId(event._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const columns: DataTableColumn<EventRow>[] = [
    {
      id: "title",
      header: t("title"),
      sortAccessor: (e) => e.title.toLowerCase(),
      cell: (e) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {e.bannerImageUrl ? (
              <Image src={e.bannerImageUrl} alt={e.title} fill className="object-cover" />
            ) : (
              <Calendar className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground line-clamp-1">{e.title}</span>
              {e.isFeatured && <Star className="size-3.5 shrink-0 text-primary" />}
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {e.location}
              {e.venue ? ` · ${e.venue}` : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "date",
      header: t("form.eventDateTime"),
      sortAccessor: (e) => e.eventDate,
      cell: (e) => (
        <div className="text-sm">
          <span className="font-medium text-foreground">{formatDate(e.eventDate)}</span>
          <span className="ml-2 text-muted-foreground">{formatTime(e.eventDate)}</span>
        </div>
      ),
    },
    {
      id: "capacity",
      header: t("form.maxCapacityLabel"),
      cell: (e) => (
        <span className="text-sm text-muted-foreground">
          {e.maxCapacity ? t("maxCapacity", { count: e.maxCapacity }) : t("unlimited")}
        </span>
      ),
    },
    {
      id: "status",
      header: t("status"),
      cell: (e) => <StatusBadge status={e.status} label={t(e.status)} />,
    },
    {
      id: "price",
      header: t("form.basePriceLabel"),
      align: "right",
      sortAccessor: (e) => e.basePrice,
      cell: (e) => <span className="font-medium tabular-nums">{formatPrice(e)}</span>,
    },
  ]

  const filters: DataTableFilter<EventRow>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "published", label: t("published") },
        { value: "draft", label: t("draft") },
        { value: "cancelled", label: t("cancelled") },
        { value: "completed", label: t("completed") },
      ],
      predicate: (e, val) => e.status === val,
    },
    {
      id: "location",
      label: t("allLocations"),
      width: "w-[160px]",
      options: (locations ?? []).map((loc) => ({ value: loc, label: loc })),
      predicate: (e, val) => e.location === val,
    },
  ]

  const renderCard = (event: EventRow) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[16/9] border-b border-border bg-muted/40">
        {event.bannerImageUrl ? (
          <Image src={event.bannerImageUrl} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Calendar className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <StatusBadge status={event.status} label={t(event.status)} />
          {event.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium text-primary backdrop-blur-sm">
              <Star className="size-3" />
              {t("featured")}
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2">{rowActions(event)}</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          <span>{event.location}</span>
          {event.venue && (
            <>
              <span>·</span>
              <span>{event.venue}</span>
            </>
          )}
        </div>
        <h3 className="line-clamp-2 font-medium text-foreground">{event.title}</h3>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">
            {event.maxCapacity ? t("maxCapacity", { count: event.maxCapacity }) : t("unlimited")}
          </span>
          <span className="font-medium tabular-nums text-foreground">{formatPrice(event)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <DataTable<EventRow>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["title", "location", (e) => e.venue]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        initialSort={{ columnId: "date", dir: "desc" }}
        toolbarActions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 size-4" />
            {t("addEvent")}
          </Button>
        }
        emptyTitle={t("noEventsFound")}
        emptyDescription={res && res.total === 0 ? t("getStarted") : t("tryFilters")}
        emptyIcon={Calendar}
      />

      {translatingEvent && (
        <EventTranslationForm
          isOpen={!!translatingEvent}
          onClose={() => setTranslatingEvent(null)}
          eventId={translatingEvent._id}
          eventTitle={translatingEvent.title}
          originalLanguage={translatingEvent.originalLanguage}
          availableLanguages={translatingEvent.availableLanguages}
        />
      )}

      <AlertDialog open={!!deletingEventId} onOpenChange={() => setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteEventTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteEventDescription")}</AlertDialogDescription>
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
