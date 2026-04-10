"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { EventForm } from "@/components/admin/event-form"
import { EventTranslationForm } from "@/components/admin/event-translation-form"
import {
  Plus,
  Search,
  Star,
  Globe,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
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
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

export default function AdminEventsPage() {
  const t = useTranslations("adminEvents")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<any>(null)
  const [translatingEvent, setTranslatingEvent] = React.useState<any>(null)
  const [deletingEventId, setDeletingEventId] = React.useState<string | null>(null)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [locationFilter, setLocationFilter] = React.useState("all")

  const events = useQuery(api.events.list)
  const locations = useQuery(api.events.getLocations)
  const removeEvent = useMutation(api.events.remove)
  const toggleFeatured = useMutation(api.events.toggleFeatured)
  const cancelEvent = useMutation(api.events.cancel)

  const filteredEvents = React.useMemo(() => {
    if (!events) return []

    return events.filter((event) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !event.title.toLowerCase().includes(searchLower) &&
          !event.location.toLowerCase().includes(searchLower) &&
          !event.venue?.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (statusFilter !== "all" && event.status !== statusFilter) {
        return false
      }

      if (locationFilter !== "all" && event.location !== locationFilter) {
        return false
      }

      return true
    })
  }, [events, search, statusFilter, locationFilter])

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingEvent(null)
    setIsFormOpen(true)
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-zinc-100 text-zinc-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  if (!events) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("title")}</h1>
          <p className="text-zinc-500 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("addEvent")}
        </Button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatus")}</SelectItem>
            <SelectItem value="published">{t("published")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
            <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
            <SelectItem value="completed">{t("completed")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("location")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allLocations")}</SelectItem>
            {locations?.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <Calendar className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noEventsFound")}</h3>
          <p className="text-zinc-500 mb-4">
            {events.length === 0
              ? t("getStarted")
              : t("tryFilters")}
          </p>
          {events.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("createEvent")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48">
                {event.bannerImageUrl ? (
                  <Image
                    src={event.bannerImageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-zinc-300" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusBadgeClass(event.status)
                    )}
                  >
                    {event.status}
                  </span>
                  {event.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {t("featured")}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(event)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTranslatingEvent(event)}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {t("translations")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/events/${event.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("preview")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleFeatured(event._id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {event.isFeatured ? t("removeFeatured") : t("markFeatured")}
                      </DropdownMenuItem>
                      {event.status === "published" && (
                        <DropdownMenuItem
                          onClick={() => handleCancel(event._id)}
                          className="text-orange-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {t("cancelEvent")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingEventId(event._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-zinc-600" />
                    <div className="text-sm">
                      <span className="font-semibold">{formatDate(event.eventDate)}</span>
                      <span className="text-zinc-500 ml-2">{formatTime(event.eventDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                  {event.venue && (
                    <>
                      <span>•</span>
                      <span>{event.venue}</span>
                    </>
                  )}
                </div>

                <h3 className="font-semibold text-zinc-900 line-clamp-2 mb-2">
                  {event.title}
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    {event.maxCapacity ? t("maxCapacity", { count: event.maxCapacity }) : t("unlimited")}
                  </span>
                  <span className="font-bold text-zinc-900">
                    {event.currency === "EUR" ? "€" : event.currency === "USD" ? "$" : "£"}
                    {event.basePrice.toFixed(2)}
                  </span>
                </div>

                {event.rating !== undefined && event.rating > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{event.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({event.reviewCount} {t("reviews")})</span>
                  </div>
                )}

                <div className="flex items-center gap-1 mt-3">
                  {event.availableLanguages.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-xs font-medium uppercase"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingEvent(null)
        }}
        initialData={editingEvent}
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
            <AlertDialogDescription>
              {t("deleteEventDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
