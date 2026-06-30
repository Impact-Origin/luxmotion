"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Star,
  MoreHorizontal,
  Loader2,
  MessageSquare,
  Check,
  X,
  Map,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { AdminEmptyState } from "@/components/admin/empty-state"

type TabType = "pending" | "approved"
type SortOption = "newest" | "oldest" | "highestRating" | "lowestRating"
type TypeFilter = "all" | "tours" | "events"

export default function AdminReviewsPage() {
  const t = useTranslations("adminReviews")
  const [activeTab, setActiveTab] = React.useState<TabType>("pending")
  const [sortBy, setSortBy] = React.useState<SortOption>("newest")
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")
  const [selectedTourId, setSelectedTourId] = React.useState<string>("all")
  const [page, setPage] = React.useState(0)

  const pendingReviews = useQuery(api.tourReviews.listPending)
  const approvedReviews = useQuery(api.tourReviews.listApproved)
  const tours = useQuery(api.tours.list)
  const events = useQuery(api.events.list)
  const approveReview = useMutation(api.tourReviews.approve)
  const rejectReview = useMutation(api.tourReviews.reject)
  const toggleFeatured = useMutation(api.tourReviews.toggleFeatured)

  const tourOptions = React.useMemo(() => {
    if (!tours) return []
    return tours.map((tour) => ({ id: tour._id, title: tour.title, type: "tour" as const }))
  }, [tours])

  const eventOptions = React.useMemo(() => {
    if (!events) return []
    return events.map((event) => ({ id: event._id, title: event.title, type: "event" as const }))
  }, [events])

  const filterOptions = React.useMemo(() => {
    if (typeFilter === "tours") return tourOptions
    if (typeFilter === "events") return eventOptions
    return [...tourOptions, ...eventOptions]
  }, [typeFilter, tourOptions, eventOptions])

  const applyFilters = React.useCallback((reviewList: any[]) => {
    return reviewList.filter((review) => {
      if (typeFilter === "tours" && !review.tourId) return false
      if (typeFilter === "events" && !review.eventId) return false

      if (selectedTourId !== "all") {
        const matchesTour = review.tourId === selectedTourId
        const matchesEvent = review.eventId === selectedTourId
        if (!matchesTour && !matchesEvent) return false
      }

      return true
    })
  }, [typeFilter, selectedTourId])

  const filteredPendingReviews = React.useMemo(() => {
    if (!pendingReviews) return []
    return applyFilters(pendingReviews)
  }, [pendingReviews, applyFilters])

  const sortedApprovedReviews = React.useMemo(() => {
    if (!approvedReviews) return []

    const filtered = applyFilters(approvedReviews)
    const sorted = [...filtered]
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => b.createdAt - a.createdAt)
      case "oldest":
        return sorted.sort((a, b) => a.createdAt - b.createdAt)
      case "highestRating":
        return sorted.sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt)
      case "lowestRating":
        return sorted.sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt)
      default:
        return sorted
    }
  }, [approvedReviews, sortBy, applyFilters])

  const reviews = activeTab === "pending" ? filteredPendingReviews : sortedApprovedReviews

  const pageSize = 10
  const total = reviews.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const rangeStart = total === 0 ? 0 : page * pageSize + 1
  const rangeEnd = Math.min((page + 1) * pageSize, total)
  const pageReviews = reviews.slice(page * pageSize, page * pageSize + pageSize)

  // Reset to the first page whenever the active tab changes, the filters/sort
  // change, or the visible list shrinks/grows — so we never sit on an empty page.
  React.useEffect(() => {
    setPage(0)
  }, [activeTab, typeFilter, selectedTourId, sortBy, total])

  const handleTypeFilterChange = (value: TypeFilter) => {
    setTypeFilter(value)
    setSelectedTourId("all")
  }

  const handleApprove = async (reviewId: string) => {
    try {
      await approveReview({ id: reviewId as any })
      toast.success(t("approveSuccess"))
    } catch (error) {
      toast.error(t("approveError"))
    }
  }

  const handleToggleFeatured = async (reviewId: string, currentlyFeatured: boolean) => {
    try {
      await toggleFeatured({ id: reviewId as any })
      toast.success(currentlyFeatured ? t("unfeaturedSuccess") : t("featuredSuccess"))
    } catch (error) {
      toast.error(t("featuredError"))
    }
  }

  const handleDelete = async (reviewId: string) => {
    try {
      await rejectReview({ id: reviewId as any })
      toast.success(activeTab === "pending" ? t("rejectSuccess") : t("deleteSuccess"))
    } catch (error) {
      toast.error(activeTab === "pending" ? t("rejectError") : t("deleteError"))
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/40"
            )}
          />
        ))}
      </div>
    )
  }

  if (!pendingReviews || !approvedReviews) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              onClick={() => setActiveTab("pending")}
            >
              {t("pending")}
              {pendingReviews && pendingReviews.length > 0 && (
                <span className="ml-2 bg-[#fef3c7] text-[#92400e] text-xs px-2 py-0.5 rounded-full">
                  {pendingReviews.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === "approved" ? "default" : "outline"}
              onClick={() => setActiveTab("approved")}
            >
              {t("approved")}
            </Button>
          </div>

          {activeTab === "approved" && approvedReviews && approvedReviews.length > 0 && (
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sortNewest")}</SelectItem>
                <SelectItem value="oldest">{t("sortOldest")}</SelectItem>
                <SelectItem value="highestRating">{t("sortHighestRating")}</SelectItem>
                <SelectItem value="lowestRating">{t("sortLowestRating")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <Select value={typeFilter} onValueChange={(v) => handleTypeFilterChange(v as TypeFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="tours">{t("tours")}</SelectItem>
              <SelectItem value="events">{t("events")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTourId} onValueChange={setSelectedTourId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={t("filterByTourEvent")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {typeFilter === "tours" ? t("allTours") : typeFilter === "events" ? t("allEvents") : t("allToursEvents")}
              </SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center gap-2">
                    {option.type === "tour" ? (
                      <Map className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="truncate">{option.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!reviews || reviews.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title={activeTab === "pending" ? t("noPending") : t("noApproved")}
          description={activeTab === "pending" ? t("noPendingDescription") : t("noApprovedDescription")}
        />
      ) : (
        <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageReviews.map((review: any) => (
            <div
              key={review._id}
              className={cn(
                "bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow",
                review.isFeatured ? "border-amber-300 ring-1 ring-amber-200" : "border-border"
              )}
            >
              {review.isFeatured && (
                <div className="bg-amber-50 px-5 py-1.5 flex items-center gap-1.5 border-b border-amber-200">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-700">{t("testimonial")}</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  {renderStars(review.rating)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {activeTab === "pending" && (
                        <DropdownMenuItem onSelect={() => handleApprove(review._id)}>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          {t("approve")}
                        </DropdownMenuItem>
                      )}
                      {activeTab === "approved" && (
                        <DropdownMenuItem onSelect={() => handleToggleFeatured(review._id, !!review.isFeatured)}>
                          <Award className={cn("h-4 w-4 mr-2", review.isFeatured ? "text-amber-500" : "text-muted-foreground")} />
                          {review.isFeatured ? t("removeFromTestimonials") : t("addToTestimonials")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onSelect={() => handleDelete(review._id)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {activeTab === "pending" ? t("reject") : t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-foreground text-sm line-clamp-4 mb-4">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.nationality || t("unknownNationality")}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  {review.tourTitle && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Map className="h-3.5 w-3.5" />
                      <span className="truncate">{review.tourTitle}</span>
                    </div>
                  )}
                  {review.eventTitle && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="truncate">{review.eventTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {activeTab === "pending" && (
                <div className="px-5 py-3 bg-muted border-t border-border flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(review._id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t("reject")}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(review._id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {t("approve")}
                  </Button>
                </div>
              )}
              {activeTab === "approved" && (
                <div className="px-5 py-3 bg-muted border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "w-full",
                      review.isFeatured
                        ? "text-amber-600 border-amber-300 hover:bg-amber-50"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => handleToggleFeatured(review._id, !!review.isFeatured)}
                  >
                    <Award className={cn("h-4 w-4 mr-1", review.isFeatured ? "text-amber-500" : "text-muted-foreground")} />
                    {review.isFeatured ? t("removeFromTestimonials") : t("addToTestimonials")}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
          <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
            <span className="tabular-nums">{rangeStart}–{rangeEnd} of {total}</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums">Page {page + 1} of {pageCount}</span>
              <Button variant="outline" size="icon" className="size-8" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="icon" className="size-8" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page"><ChevronRight className="size-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
