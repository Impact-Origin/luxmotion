"use client"

import * as React from "react"
import { useQuery, useMutation, useConvex } from "convex/react"
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
import { TourForm } from "@/components/admin/tour-form"
import { TourTranslationForm } from "@/components/admin/tour-translation-form"
import {
  Plus,
  Search,
  Star,
  Award,
  Globe,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
  Map,
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

export default function AdminToursPage() {
  const t = useTranslations("adminTours")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingTour, setEditingTour] = React.useState<any>(null)
  const [translatingTour, setTranslatingTour] = React.useState<any>(null)
  const [deletingTourId, setDeletingTourId] = React.useState<string | null>(null)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [destinationFilter, setDestinationFilter] = React.useState("all")

  const convex = useConvex()
  const tours = useQuery(api.tours.list)
  const destinations = useQuery(api.tours.getDestinations)
  const removeTour = useMutation(api.tours.remove)
  const toggleFeatured = useMutation(api.tours.toggleFeatured)
  const toggleBestseller = useMutation(api.tours.toggleBestseller)
  const [isLoadingTour, setIsLoadingTour] = React.useState(false)

  const filteredTours = React.useMemo(() => {
    if (!tours) return []

    return tours.filter((tour) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !tour.title.toLowerCase().includes(searchLower) &&
          !tour.destination.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (statusFilter !== "all" && tour.status !== statusFilter) {
        return false
      }

      if (categoryFilter !== "all" && tour.category !== categoryFilter) {
        return false
      }

      if (destinationFilter !== "all" && tour.destination !== destinationFilter) {
        return false
      }

      return true
    })
  }, [tours, search, statusFilter, categoryFilter, destinationFilter])

  const handleEdit = async (tour: any) => {
    setIsLoadingTour(true)
    try {
      const fullTour = await convex.query(api.tours.getById, { id: tour._id })
      setEditingTour(fullTour)
      setIsFormOpen(true)
    } catch (error) {
      console.error("Failed to load tour:", error)
      toast.error("Failed to load tour details")
    } finally {
      setIsLoadingTour(false)
    }
  }

  const handleCreate = () => {
    setEditingTour(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingTourId) return

    try {
      await removeTour({ id: deletingTourId as any })
      toast.success("Tour deleted successfully")
    } catch (error) {
      toast.error("Failed to delete tour")
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-zinc-100 text-zinc-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  if (!tours) {
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
          {t("addTour")}
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
            <SelectItem value="archived">{t("archived")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="tours">{t("tours")}</SelectItem>
            <SelectItem value="experiences">{t("experiences")}</SelectItem>
            <SelectItem value="private">{t("privateTours")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={destinationFilter} onValueChange={setDestinationFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("destination")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDestinations")}</SelectItem>
            {destinations?.map((dest) => (
              <SelectItem key={dest} value={dest}>
                {dest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTours.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <Map className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noToursFound")}</h3>
          <p className="text-zinc-500 mb-4">
            {tours.length === 0
              ? t("getStarted")
              : t("tryFilters")}
          </p>
          {tours.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("createTour")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48">
                {tour.bannerImageUrl ? (
                  <Image
                    src={tour.bannerImageUrl}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <Map className="h-12 w-12 text-zinc-300" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusBadgeClass(tour.status)
                    )}
                  >
                    {tour.status}
                  </span>
                  {tour.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {t("featured")}
                    </span>
                  )}
                  {tour.isBestSeller && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {t("bestSeller")}
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
                      <DropdownMenuItem onClick={() => handleEdit(tour)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTranslatingTour(tour)}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {t("translations")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/tours/tour/${tour.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("preview")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleFeatured(tour._id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {tour.isFeatured ? t("removeFeatured") : t("markFeatured")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleBestseller(tour._id)}>
                        <Award className="h-4 w-4 mr-2" />
                        {tour.isBestSeller ? t("removeBestSeller") : t("markBestSeller")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingTourId(tour._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <span className="capitalize">{tour.category}</span>
                  <span>•</span>
                  <span>{tour.destination}</span>
                </div>

                <h3 className="font-semibold text-zinc-900 line-clamp-2 mb-2">
                  {tour.title}
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{tour.duration}</span>
                  <span className="font-bold text-zinc-900">
                    {tour.currency === "EUR" ? "€" : tour.currency === "USD" ? "$" : "£"}
                    {tour.basePrice.toFixed(2)}
                  </span>
                </div>

                {tour.rating !== undefined && tour.rating > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tour.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({tour.reviewCount} {t("reviews")})</span>
                  </div>
                )}

                <div className="flex items-center gap-1 mt-3">
                  {tour.availableLanguages.map((lang: string) => (
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

      <TourForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTour(null)
        }}
        initialData={editingTour}
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

      {isLoadingTour && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
            <span className="text-zinc-700 font-medium">{t("loadingTour")}</span>
          </div>
        </div>
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
