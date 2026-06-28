"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ImageUpload } from "./image-upload"
import { UltraItineraryEditor, type EditorDay as ItineraryEditorDay } from "./ultra-itinerary-editor"
import { MultiMediaUpload, type MediaItem } from "./multi-media-upload"
import { BlogEditor } from "./blog-editor"
import { TourStopsBuilder } from "./tour-stops-builder"
import { TourAddonsBuilder } from "./tour-addons-builder"
import { TourScheduleBuilder } from "./tour-schedule-builder"
import { GoogleMapsInput } from "./google-maps-input"
import { toast } from "sonner"
import {
  Loader2,
  Info,
  FileText,
  Settings,
  Search,
  Image,
  MapPin,
  DollarSign,
  Calendar,
  List,
  Gem,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { LANGUAGES, PORTUGAL_LOCATIONS, TOUR_LANGUAGES, TOUR_TYPES, TOUR_CATEGORIES } from "./constants"
import { useTranslations } from "next-intl"

interface TourFormProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export function TourForm({ isOpen, onClose, initialData }: TourFormProps) {
  const t = useTranslations("adminTours")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("basic")

  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [description, setDescription] = React.useState<any>(null)
  const [tourType, setTourType] = React.useState("Group Tour")
  const [originalLanguage, setOriginalLanguage] = React.useState("en")
  const [category, setCategory] = React.useState<"tours" | "experiences" | "private" | "events">("tours")
  const [destination, setDestination] = React.useState("Lisboa")
  const [duration, setDuration] = React.useState("")
  const [groupSize, setGroupSize] = React.useState("")
  const [tourLanguages, setTourLanguages] = React.useState<string[]>(["English"])

  const [bannerImageId, setBannerImageId] = React.useState<string | undefined>()
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [additionalBanners, setAdditionalBanners] = React.useState<MediaItem[]>([])


  const [included, setIncluded] = React.useState("")
  const [excluded, setExcluded] = React.useState("")

  const [stops, setStops] = React.useState<any[]>([])
  const [itineraryDays, setItineraryDays] = React.useState<ItineraryEditorDay[]>([])

  const [pickup, setPickup] = React.useState<any>(null)
  const [dropoff, setDropoff] = React.useState<any>(null)

  const [basePrice, setBasePrice] = React.useState("")
  const [originalPrice, setOriginalPrice] = React.useState("")
  const [currency, setCurrency] = React.useState("EUR")
  const [minPassengers, setMinPassengers] = React.useState("")
  const [maxPassengers, setMaxPassengers] = React.useState("")

  const [schedule, setSchedule] = React.useState<{
    _id?: string
    activeDays: number[]
    timeSlots: { startTime: string; endTime?: string }[]
    validFrom?: string
    validUntil?: string
    isActive: boolean
  }>({
    activeDays: [],
    timeSlots: [],
    validFrom: undefined,
    validUntil: undefined,
    isActive: true,
  })

  const [bookingDeadlineHours, setBookingDeadlineHours] = React.useState("")

  const [status, setStatus] = React.useState<"draft" | "published" | "archived">("draft")
  const [isFeatured, setIsFeatured] = React.useState(false)
  const [isBestSeller, setIsBestSeller] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [isUltraLuxury, setIsUltraLuxury] = React.useState(false)
  const [tourTypeTag, setTourTypeTag] = React.useState<string>("")
  const [durationDays, setDurationDays] = React.useState("")
  const [cancellationPolicy, setCancellationPolicy] = React.useState("")
  const [tags, setTags] = React.useState("")

  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")

  const createTour = useMutation(api.tours.create)
  const updateTour = useMutation(api.tours.update)
  const createStop = useMutation(api.tourStops.create)
  const updateStop = useMutation(api.tourStops.update)
  const removeStop = useMutation(api.tourStops.remove)
  const createSchedule = useMutation(api.tourSchedules.create)
  const updateSchedule = useMutation(api.tourSchedules.update)
  const removeSchedule = useMutation(api.tourSchedules.remove)
  const existingSchedules = useQuery(
    api.tourSchedules.listByTour,
    initialData?._id ? { tourId: initialData._id } : "skip"
  )
  const featuredCount = useQuery(api.tours.countFeatured) ?? 0
  const isAtFeaturedLimit = featuredCount >= 6 && !initialData?.isFeatured

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setSubtitle(initialData.subtitle || "")
      setDescription(initialData.description || null)
      setTourType(initialData.tourType || "Group Tour")
      setOriginalLanguage(initialData.originalLanguage || "en")
      setCategory(initialData.category || "tours")
      setDestination(initialData.destination || "Lisboa")
      setDuration(initialData.duration || "")
      setGroupSize(initialData.groupSize || "")
      setTourLanguages(initialData.languages || ["English"])
      setBannerImageId(initialData.bannerImageId)
      setPreviewUrl(initialData.bannerImageUrl || null)
      if (initialData.additionalBannerIds && initialData.additionalBanners) {
        setAdditionalBanners(
          initialData.additionalBannerIds.map((id: string, i: number) => ({
            id,
            url: initialData.additionalBannerUrls?.[i] || initialData.additionalBanners[i]?.url || "",
            type: (initialData.additionalBanners[i]?.type ?? "image") as "image" | "video",
          }))
        )
      } else if (initialData.additionalBannerIds && initialData.additionalBannerUrls) {
        setAdditionalBanners(
          initialData.additionalBannerIds.map((id: string, i: number) => ({
            id,
            url: initialData.additionalBannerUrls[i] || "",
            type: "image" as const,
          }))
        )
      } else {
        setAdditionalBanners([])
      }

      setIncluded(initialData.included?.join("\n") || "")
      setExcluded(initialData.excluded?.join("\n") || "")
      setStops(initialData.stops || [])
      setItineraryDays(
        (initialData.itineraryDays || []).map((day: any) => ({
          title: day.title || "",
          titleAccent: day.titleAccent || "",
          hoursActive: day.hoursActive || "",
          nights: day.nights != null ? String(day.nights) : "",
          hotel: day.hotel || "",
          stops: (day.stops || []).map((s: any) => ({
            time: s.time || "",
            label: s.label || "",
            title: s.title || "",
            description: s.description || "",
            imageId: s.imageId,
            imageUrl: s.imageUrl ?? undefined,
            lat: s.lat != null ? String(s.lat) : "",
            lng: s.lng != null ? String(s.lng) : "",
          })),
        })),
      )
      setPickup(initialData.pickup || null)
      setDropoff(initialData.dropoff || null)
      setBasePrice(initialData.basePrice?.toString() || "")
      setOriginalPrice(initialData.originalPrice?.toString() || "")
      setCurrency(initialData.currency || "EUR")
      setMinPassengers(initialData.minPassengers?.toString() || "")
      setMaxPassengers(initialData.maxPassengers?.toString() || "")
      setStatus(initialData.status || "draft")
      setIsFeatured(initialData.isFeatured || false)
      setIsBestSeller(initialData.isBestSeller || false)
      setIsActive(initialData.isActive ?? true)
      setIsUltraLuxury(initialData.isUltraLuxury || false)
      setTourTypeTag(initialData.tourTypeTag || "")
      setDurationDays(initialData.durationDays?.toString() || "")
      setBookingDeadlineHours(initialData.bookingDeadlineHours?.toString() || "")
      setCancellationPolicy(initialData.cancellationPolicy || "")
      setTags(initialData.tags?.join(", ") || "")
      setSeoTitle(initialData.seoTitle || "")
      setSeoDescription(initialData.seoDescription || "")
      setActiveTab("basic")
    } else {
      resetForm()
    }
  }, [initialData, isOpen])

  React.useEffect(() => {
    if (existingSchedules && existingSchedules.length > 0) {
      const firstSchedule = existingSchedules[0]
      setSchedule({
        _id: firstSchedule?._id,
        activeDays: firstSchedule?.activeDays || [],
        timeSlots: firstSchedule?.timeSlots || [],
        validFrom: firstSchedule?.validFrom ? new Date(firstSchedule.validFrom).toISOString().split("T")[0] : undefined,
        validUntil: firstSchedule?.validUntil ? new Date(firstSchedule?.validUntil).toISOString().split("T")[0] : undefined,
        isActive: firstSchedule?.isActive || false,
      })
    }
  }, [existingSchedules])

  const resetForm = () => {
    setTitle("")
    setSubtitle("")
    setDescription(null)
    setTourType("Group Tour")
    setOriginalLanguage("en")
    setCategory("tours")
    setDestination("Lisboa")
    setDuration("")
    setGroupSize("")
    setTourLanguages(["English"])
    setBannerImageId(undefined)
    setPreviewUrl(null)
    setAdditionalBanners([])

    setIncluded("")
    setExcluded("")
    setStops([])
    setItineraryDays([])
    setPickup(null)
    setDropoff(null)
    setBasePrice("")
    setOriginalPrice("")
    setCurrency("EUR")
    setSchedule({
      _id: undefined,
      activeDays: [],
      timeSlots: [],
      validFrom: undefined,
      validUntil: undefined,
      isActive: true,
    })
    setStatus("draft")
    setIsFeatured(false)
    setIsBestSeller(false)
    setIsActive(true)
    setIsUltraLuxury(false)
    setTourTypeTag("")
    setDurationDays("")
    setBookingDeadlineHours("")
    setCancellationPolicy("")
    setTags("")
    setSeoTitle("")
    setSeoDescription("")
    setActiveTab("basic")
  }

  const parseListField = (value: string): string[] => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error(t("form.titleRequired"))
      setActiveTab("basic")
      return
    }

    if (!duration.trim()) {
      toast.error(t("form.durationRequired"))
      setActiveTab("basic")
      return
    }

    if (!basePrice || parseFloat(basePrice) <= 0) {
      toast.error(t("form.basePriceRequired"))
      setActiveTab("pricing")
      return
    }

    try {
      setIsSubmitting(true)

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const data = {
        title,
        subtitle: subtitle || undefined,
        description,
        tourType,
        originalLanguage,
        category,
        destination,
        isFeatured,
        isBestSeller,
        isActive,
        isUltraLuxury,
        tourTypeTag: isUltraLuxury && tourTypeTag ? (tourTypeTag as any) : undefined,
        durationDays: isUltraLuxury && durationDays ? parseInt(durationDays) : undefined,
        itineraryDays:
          isUltraLuxury && itineraryDays.length > 0
            ? itineraryDays
                .map((day) => ({
                  title: day.title,
                  titleAccent: day.titleAccent || undefined,
                  hoursActive: day.hoursActive || undefined,
                  nights: day.nights ? parseInt(day.nights) : undefined,
                  hotel: day.hotel || undefined,
                  stops: day.stops
                    .filter((s) => s.title.trim())
                    .map((s) => ({
                      time: s.time || undefined,
                      label: s.label || undefined,
                      title: s.title,
                      description: s.description || undefined,
                      imageId: (s.imageId as any) || undefined,
                      lat: s.lat ? parseFloat(s.lat) : undefined,
                      lng: s.lng ? parseFloat(s.lng) : undefined,
                    })),
                }))
                .filter((day) => day.title.trim() || day.stops.length > 0)
            : undefined,
        status,
        duration,
        groupSize,
        languages: tourLanguages,
        basePrice: parseFloat(basePrice),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        currency,
        bannerImageId: bannerImageId as any,
        additionalBannerIds: additionalBanners.length > 0 ? additionalBanners.map((b) => b.id) as any : undefined,
        additionalBannerTypes: additionalBanners.length > 0 ? additionalBanners.map((b) => b.type) : undefined,

        included: parseListField(included).length > 0 ? parseListField(included) : undefined,
        excluded: parseListField(excluded).length > 0 ? parseListField(excluded) : undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        pickup: pickup || undefined,
        dropoff: dropoff || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        bookingDeadlineHours: bookingDeadlineHours ? parseFloat(bookingDeadlineHours) : undefined,
        cancellationPolicy: cancellationPolicy || undefined,
        minPassengers: minPassengers ? parseInt(minPassengers) : undefined,
        maxPassengers: maxPassengers ? parseInt(maxPassengers) : undefined,
      }

      let tourId: string

      if (initialData) {
        await updateTour({ id: initialData._id, ...data })
        tourId = initialData._id

        const existingStops = initialData.stops || []
        const existingStopIds = new Set(existingStops.map((s: any) => s._id))
        const newStopIds = new Set(stops.filter((s) => s._id).map((s) => s._id))

        for (const existingStop of existingStops) {
          if (!newStopIds.has(existingStop._id)) {
            await removeStop({ id: existingStop._id })
          }
        }

        for (const stop of stops) {
          if (stop._id && existingStopIds.has(stop._id)) {
            await updateStop({
              id: stop._id,
              time: stop.time || "",
              title: stop.title || "",
              description: stop.description || undefined,
              imageId: stop.imageId as any,
              showImage: stop.showImage,
              address: stop.address || undefined,
              placeId: stop.placeId || undefined,
              lat: stop.lat,
              lng: stop.lng,
            })
          } else {
            await createStop({
              tourId: tourId as any,
              time: stop.time || "",
              title: stop.title || "",
              description: stop.description || undefined,
              imageId: stop.imageId as any,
              showImage: stop.showImage,
              address: stop.address || undefined,
              placeId: stop.placeId || undefined,
              lat: stop.lat,
              lng: stop.lng,
            })
          }
        }

        const filteredTimeSlots = schedule.timeSlots.filter(ts => ts.startTime)
        if (schedule.activeDays.length > 0 || filteredTimeSlots.length > 0) {
          const scheduleUpdateData = {
            activeDays: schedule.activeDays,
            timeSlots: filteredTimeSlots,
            validFrom: schedule.validFrom ? new Date(schedule.validFrom).getTime() : undefined,
            validUntil: schedule.validUntil ? new Date(schedule.validUntil).getTime() : undefined,
            isActive: schedule.isActive,
          }

          if (schedule._id) {
            await updateSchedule({ id: schedule._id as any, ...scheduleUpdateData })
          } else if (existingSchedules && existingSchedules.length > 0) {
            await updateSchedule({ id: existingSchedules[0]?._id as any || "", ...scheduleUpdateData })
          } else {
            await createSchedule({ tourId: tourId as any, ...scheduleUpdateData })
          }
        }

        toast.success(t("form.successUpdated"))
      } else {
        tourId = await createTour(data)

        for (const stop of stops) {
          await createStop({
            tourId: tourId as any,
            time: stop.time || "",
            title: stop.title || "",
            description: stop.description || undefined,
            imageId: stop.imageId as any,
            showImage: stop.showImage,
            address: stop.address || undefined,
            placeId: stop.placeId || undefined,
            lat: stop.lat,
            lng: stop.lng,
          })
        }

        const newTourTimeSlots = schedule.timeSlots.filter(ts => ts.startTime)
        if (schedule.activeDays.length > 0 || newTourTimeSlots.length > 0) {
          await createSchedule({
            tourId: tourId as any,
            activeDays: schedule.activeDays,
            timeSlots: newTourTimeSlots,
            validFrom: schedule.validFrom ? new Date(schedule.validFrom).getTime() : undefined,
            validUntil: schedule.validUntil ? new Date(schedule.validUntil).getTime() : undefined,
            isActive: schedule.isActive,
          })
        }

        toast.success(t("form.successCreated"))
      }

      onClose()
    } catch (error) {
      console.error(error)
      toast.error(t("form.errorGeneric"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTourLanguage = (lang: string) => {
    setTourLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>{initialData ? t("form.editTour") : t("form.addNewTour")}</DialogTitle>
          <DialogDescription>
            {initialData
              ? t("form.editDescription")
              : t("form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="shrink-0 border-b border-border">
              <TabsList className="h-auto w-full bg-transparent p-0 flex flex-wrap">
                {[
                  { value: "basic", label: t("form.tabs.basic"), icon: Info },
                  { value: "content", label: t("form.tabs.content"), icon: FileText },
                  { value: "media", label: t("form.tabs.media"), icon: Image },
                  { value: "itinerary", label: t("form.tabs.itinerary"), icon: List },
                  { value: "meeting", label: t("form.tabs.meetingPoints"), icon: MapPin },
                  { value: "pricing", label: t("form.tabs.pricing"), icon: DollarSign },
                  { value: "schedule", label: t("form.tabs.schedule"), icon: Calendar },
                  { value: "addons", label: t("form.tabs.addons"), icon: Gem },
                  { value: "settings", label: t("form.tabs.settings"), icon: Settings },
                  { value: "seo", label: t("form.tabs.seo"), icon: Search },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="shrink-0 px-3 py-2.5 rounded-none border-b-2 border-transparent text-xs font-medium transition-all whitespace-nowrap data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent"
                  >
                    <tab.icon className="h-3.5 w-3.5 mr-1.5" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 min-h-0 bg-card">
              <TabsContent value="basic" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title">{t("form.titleLabel")} *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t("form.titlePlaceholder")}
                        required
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subtitle">{t("form.subtitleLabel")}</Label>
                      <Input
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder={t("form.subtitlePlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{t("form.categoryLabel")} *</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v as typeof category)} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TOUR_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>{t("form.destinationLabel")} *</Label>
                      <Select value={destination} onValueChange={setDestination} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PORTUGAL_LOCATIONS.map((dest) => (
                            <SelectItem key={dest} value={dest}>
                              {dest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{t("form.tourTypeLabel")} *</Label>
                      <Select value={tourType} onValueChange={setTourType} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TOUR_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>{t("form.originalLanguageLabel")} *</Label>
                      <Select value={originalLanguage} onValueChange={setOriginalLanguage} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="duration">{t("form.durationLabel")} *</Label>
                      <Input
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder={t("form.durationPlaceholder")}
                        required
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="groupSize">{t("form.groupSizeLabel")}</Label>
                      <Input
                        id="groupSize"
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                        placeholder={t("form.groupSizePlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{t("form.tourLanguagesLabel")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {TOUR_LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleTourLanguage(lang)}
                          disabled={isSubmitting}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            tourLanguages.includes(lang)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("form.descriptionLabel")}</Label>
                  <BlogEditor
                    content={description}
                    onChange={setDescription}
                    disabled={isSubmitting}
                    placeholder={t("form.descriptionPlaceholder")}
                    minHeight="200px"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-green-700">{t("form.includedLabel")}</Label>
                    <Textarea
                      value={included}
                      onChange={(e) => setIncluded(e.target.value)}
                      placeholder={t("form.itemPerLine")}
                      disabled={isSubmitting}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-red-700">{t("form.excludedLabel")}</Label>
                    <Textarea
                      value={excluded}
                      onChange={(e) => setExcluded(e.target.value)}
                      placeholder={t("form.itemPerLine")}
                      disabled={isSubmitting}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" /> {t("form.bannerImageLabel")}
                  </Label>
                  <ImageUpload
                    value={previewUrl}
                    onChange={(id) => {
                      setBannerImageId(id)
                      if (!id) setPreviewUrl(null)
                    }}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" /> {t("form.additionalBannersLabel")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("form.additionalBannersMediaHelp", { defaultValue: "Adicione até 15 imagens ou vídeos (MP4/WebM) para o carrossel do banner." })}
                  </p>
                  <MultiMediaUpload
                    value={additionalBanners}
                    onChange={setAdditionalBanners}
                    disabled={isSubmitting}
                    maxItems={15}
                  />
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-800">{t("form.itinerarySeparationWarning")}</p>
                </div>
                {isUltraLuxury ? (
                  <UltraItineraryEditor days={itineraryDays} onChange={setItineraryDays} disabled={isSubmitting} />
                ) : (
                  <TourStopsBuilder
                    tourId={initialData?._id}
                    stops={stops}
                    onChange={setStops}
                    disabled={isSubmitting}
                  />
                )}
              </TabsContent>

              <TabsContent value="meeting" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <GoogleMapsInput
                  value={pickup}
                  onChange={setPickup}
                  label={t("form.pickupLabel")}
                  disabled={isSubmitting}
                />

                <GoogleMapsInput
                  value={dropoff}
                  onChange={setDropoff}
                  label={t("form.dropoffLabel")}
                  disabled={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="pricing" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> {t("form.pricingLabel")}
                  </Label>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="basePrice">{t("form.basePriceLabel")} *</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="0.00"
                        required
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="originalPrice">{t("form.originalPriceLabel")}</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="0.00"
                        disabled={isSubmitting}
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground">{t("form.originalPriceHelp")}</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label>{t("form.currencyLabel")}</Label>
                      <Select value={currency} onValueChange={setCurrency} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="minPassengers">{t("form.minPassengersLabel")}</Label>
                      <Input
                        id="minPassengers"
                        type="number"
                        min="1"
                        value={minPassengers}
                        onChange={(e) => setMinPassengers(e.target.value)}
                        placeholder={t("form.minPassengersPlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="maxPassengers">{t("form.maxPassengersLabel")}</Label>
                      <Input
                        id="maxPassengers"
                        type="number"
                        min="1"
                        value={maxPassengers}
                        onChange={(e) => setMaxPassengers(e.target.value)}
                        placeholder={t("form.maxPassengersPlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
                  </div>

                  {originalPrice && parseFloat(originalPrice) > parseFloat(basePrice || "0") && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        {t("form.savingsText")}: {currency === "EUR" ? "€" : currency === "USD" ? "$" : "£"}
                        {(parseFloat(originalPrice) - parseFloat(basePrice || "0")).toFixed(2)}
                        {" "}
                        ({Math.round(((parseFloat(originalPrice) - parseFloat(basePrice || "0")) / parseFloat(originalPrice)) * 100)}% {t("form.offText")})
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <TourScheduleBuilder
                  schedule={schedule}
                  onChange={setSchedule}
                  disabled={isSubmitting}
                />

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("form.bookingDeadlineLabel")}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={bookingDeadlineHours}
                    onChange={(e) => setBookingDeadlineHours(e.target.value)}
                    placeholder={t("form.bookingDeadlinePlaceholder")}
                    disabled={isSubmitting}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("form.bookingDeadlineHelp")}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="addons" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <TourAddonsBuilder
                  entityId={initialData?._id}
                  entityType="tour"
                  originalLanguage={originalLanguage}
                />
              </TabsContent>

              <TabsContent value="settings" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" /> {t("form.publishingLabel")}
                  </Label>

                  <div className="space-y-1.5">
                    <Label htmlFor="status">{t("form.statusLabel")}</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as any)} disabled={isSubmitting}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("draft")}</SelectItem>
                        <SelectItem value="published">{t("published")}</SelectItem>
                        <SelectItem value="archived">{t("archived")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAtFeaturedLimit ? "border-border bg-muted cursor-not-allowed" : "border-border hover:bg-accent cursor-pointer"}`}>
                      <Checkbox
                        checked={isFeatured}
                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                        disabled={isSubmitting || isAtFeaturedLimit}
                        className="size-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isAtFeaturedLimit ? "text-muted-foreground" : "text-foreground"}`}>{t("form.featuredTour")}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${featuredCount >= 6 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                            {featuredCount}/6
                          </span>
                        </div>
                        <p className={`text-xs ${isAtFeaturedLimit ? "text-muted-foreground" : "text-muted-foreground"}`}>
                          {isAtFeaturedLimit ? t("form.featuredLimit") : t("form.featuredHelp")}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                      <Checkbox
                        checked={isBestSeller}
                        onCheckedChange={(checked) => setIsBestSeller(checked as boolean)}
                        disabled={isSubmitting}
                        className="size-5"
                      />
                      <div>
                        <span className="font-semibold text-sm text-foreground">{t("form.bestSellerLabel")}</span>
                        <p className="text-xs text-muted-foreground">{t("form.bestSellerHelp")}</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                      <Checkbox
                        checked={isActive}
                        onCheckedChange={(checked) => setIsActive(checked as boolean)}
                        disabled={isSubmitting}
                        className="size-5"
                      />
                      <div>
                        <span className="font-semibold text-sm text-foreground">{t("form.activeLabel")}</span>
                        <p className="text-xs text-muted-foreground">{t("form.activeHelp")}</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                      <Checkbox
                        checked={isUltraLuxury}
                        onCheckedChange={(checked) => setIsUltraLuxury(checked as boolean)}
                        disabled={isSubmitting}
                        className="size-5"
                      />
                      <div>
                        <span className="font-semibold text-sm text-foreground">{t("form.ultraLuxuryLabel")}</span>
                        <p className="text-xs text-muted-foreground">{t("form.ultraLuxuryHelp")}</p>
                      </div>
                    </label>

                    {isUltraLuxury && (
                      <div className="grid grid-cols-2 gap-4 rounded-lg border border-amber-200 bg-amber-50/40 p-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="tourTypeTag">{t("form.tourTypeTagLabel")}</Label>
                          <Select value={tourTypeTag} onValueChange={setTourTypeTag} disabled={isSubmitting}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder={t("form.tourTypeTagPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="half-day">{t("form.tourTypes.halfDay")}</SelectItem>
                              <SelectItem value="full-day">{t("form.tourTypes.fullDay")}</SelectItem>
                              <SelectItem value="multi-day">{t("form.tourTypes.multiDay")}</SelectItem>
                              <SelectItem value="river-cruise">{t("form.tourTypes.riverCruise")}</SelectItem>
                              <SelectItem value="private-yacht">{t("form.tourTypes.privateYacht")}</SelectItem>
                              <SelectItem value="helicopter">{t("form.tourTypes.helicopter")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="durationDays">{t("form.durationDaysLabel")}</Label>
                          <Input
                            id="durationDays"
                            type="number"
                            min={1}
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            disabled={isSubmitting}
                            className="h-9"
                            placeholder={t("form.durationDaysPlaceholder")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">{t("form.tagsLabel")}</Label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder={t("form.tagsPlaceholder")}
                      disabled={isSubmitting}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">{t("form.cancellationPolicyLabel")}</Label>
                    <Textarea
                      value={cancellationPolicy}
                      onChange={(e) => setCancellationPolicy(e.target.value)}
                      placeholder={t("form.cancellationPolicyPlaceholder")}
                      disabled={isSubmitting}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="h-full overflow-y-auto p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" /> {t("form.seoLabel")}
                  </Label>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoTitle">{t("form.seoTitleLabel")}</Label>
                    <Input
                      id="seoTitle"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || t("form.seoTitlePlaceholder")}
                      disabled={isSubmitting}
                      className="h-9"
                    />
                    <p className="text-xs text-muted-foreground">{seoTitle.length}/60 {t("form.characters")}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoDescription">{t("form.seoDescriptionLabel")}</Label>
                    <Textarea
                      id="seoDescription"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={subtitle || t("form.seoDescriptionPlaceholder")}
                      disabled={isSubmitting}
                      className="min-h-[80px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{seoDescription.length}/160 {t("form.characters")}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("form.previewLabel")}</Label>
                  <div className="p-4 rounded-lg border border-border bg-muted">
                    <p className="text-foreground text-lg font-medium hover:underline cursor-pointer truncate">
                      {seoTitle || title || t("form.titleLabel")}
                    </p>
                    <p className="text-primary text-sm truncate">
                      easytransferericeira.com/tours/{initialData?.slug || "your-tour-slug"}
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {seoDescription || subtitle || t("form.descriptionPlaceholder")}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="p-6 border-t bg-muted flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-6"
            >
              {t("form.cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 font-bold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? t("form.saveChanges") : t("form.createTourButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
