"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"
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
import { MultiImageUpload } from "./multi-image-upload"
import { BlogEditor } from "./blog-editor"
import { TourAddonsBuilder } from "./tour-addons-builder"
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
  Gem,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react"
import { Tabs, TabsContent } from "@workspace/ui/components/tabs"
import { LANGUAGES, PORTUGAL_LOCATIONS } from "./constants"
import { useTranslations } from "next-intl"

const STEP_ORDER = [
  "basic",
  "content",
  "media",
  "meeting",
  "pricing",
  "addons",
  "settings",
  "seo",
]

interface EventFormProps {
  onClose: () => void
  initialData?: any
}

export function EventForm({ onClose, initialData }: EventFormProps) {
  const t = useTranslations("adminEvents")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("basic")

  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [description, setDescription] = React.useState<any>(null)
  const [originalLanguage, setOriginalLanguage] = React.useState(initialData?.originalLanguage || "pt")
  const [location, setLocation] = React.useState("Lisbon")
  const [venue, setVenue] = React.useState("")
  const [eventDate, setEventDate] = React.useState("")
  const [eventTime, setEventTime] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [endTime, setEndTime] = React.useState("")

  const [bannerImageId, setBannerImageId] = React.useState<string | undefined>()
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [additionalBanners, setAdditionalBanners] = React.useState<{ id: string; url: string; isLocal?: boolean }[]>([])

  const [included, setIncluded] = React.useState("")
  const [excluded, setExcluded] = React.useState("")

  const [meetingPoint, setMeetingPoint] = React.useState<any>(null)

  const [basePrice, setBasePrice] = React.useState("")
  /* Vazio = só se vende em privado; é o vazio que esconde a escolha no site. */
  const [sharedPrice, setSharedPrice] = React.useState("")
  const [originalPrice, setOriginalPrice] = React.useState("")
  const [currency, setCurrency] = React.useState(initialData?.currency || "EUR")
  const [maxCapacity, setMaxCapacity] = React.useState("")
  const [minPassengers, setMinPassengers] = React.useState("")
  const [maxPassengers, setMaxPassengers] = React.useState("")

  const [status, setStatus] = React.useState<"draft" | "published" | "cancelled" | "completed">(
    initialData?.status || "draft",
  )
  const [isFeatured, setIsFeatured] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [tags, setTags] = React.useState("")

  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")

  const createEvent = useMutation(api.events.create)
  const updateEvent = useMutation(api.events.update)
  const featuredCount = useQuery(api.events.countFeatured) ?? 0
  const isAtFeaturedLimit = featuredCount >= 6 && !initialData?.isFeatured

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setSubtitle(initialData.subtitle || "")
      setDescription(initialData.description || null)
      setOriginalLanguage(initialData.originalLanguage || "pt")
      setLocation(initialData.location || "Lisbon")
      setVenue(initialData.venue || "")

      if (initialData.eventDate) {
        const date = new Date(initialData.eventDate)
        setEventDate(date.toISOString().split("T")[0] ?? "")
        setEventTime(date.toTimeString().slice(0, 5))
      }

      if (initialData.endDate) {
        const date = new Date(initialData.endDate)
        setEndDate(date.toISOString().split("T")[0] ?? "")
        setEndTime(date.toTimeString().slice(0, 5))
      }

      setBannerImageId(initialData.bannerImageId)
      setPreviewUrl(initialData.bannerImageUrl || null)
      if (initialData.additionalBannerIds && initialData.additionalBannerUrls) {
        setAdditionalBanners(
          initialData.additionalBannerIds.map((id: string, i: number) => ({
            id,
            url: initialData.additionalBannerUrls[i] || "",
          }))
        )
      } else {
        setAdditionalBanners([])
      }
      setIncluded(initialData.included?.join("\n") || "")
      setExcluded(initialData.excluded?.join("\n") || "")
      setMeetingPoint(initialData.meetingPoint || null)
      setBasePrice(initialData.basePrice?.toString() || "")
      setSharedPrice(initialData.sharedPrice?.toString() || "")
      setOriginalPrice(initialData.originalPrice?.toString() || "")
      setCurrency(initialData.currency || "EUR")
      setMaxCapacity(initialData.maxCapacity?.toString() || "")
      setMinPassengers(initialData.minPassengers?.toString() || "")
      setMaxPassengers(initialData.maxPassengers?.toString() || "")
      setStatus(initialData.status || "draft")
      setIsFeatured(initialData.isFeatured || false)
      setIsActive(initialData.isActive ?? true)
      setTags(initialData.tags?.join(", ") || "")
      setSeoTitle(initialData.seoTitle || "")
      setSeoDescription(initialData.seoDescription || "")
      setActiveTab("basic")
    } else {
      resetForm()
    }
  }, [initialData])

  const resetForm = () => {
    setTitle("")
    setSubtitle("")
    setDescription(null)
    setOriginalLanguage("pt")
    setLocation("Lisbon")
    setVenue("")
    setEventDate("")
    setEventTime("")
    setEndDate("")
    setEndTime("")
    setBannerImageId(undefined)
    setPreviewUrl(null)
    setAdditionalBanners([])
    setIncluded("")
    setExcluded("")
    setMeetingPoint(null)
    setBasePrice("")
    setOriginalPrice("")
    setCurrency("EUR")
    setMaxCapacity("")
    setStatus("draft")
    setIsFeatured(false)
    setIsActive(true)
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

  const combineDateTime = (date: string, time: string): number | undefined => {
    if (!date) return undefined
    const dateStr = time ? `${date}T${time}` : `${date}T00:00`
    return new Date(dateStr).getTime()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Wizard: pressing Enter / submitting before the last step just advances.
    if (activeTab !== "seo") {
      const idx = STEP_ORDER.indexOf(activeTab)
      setActiveTab(STEP_ORDER[Math.min(STEP_ORDER.length - 1, idx + 1)]!)
      return
    }

    if (!title.trim()) {
      toast.error(t("form.titleRequired"))
      setActiveTab("basic")
      return
    }

    if (!eventDate) {
      toast.error(t("form.eventDateRequired"))
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

      const eventDateTimestamp = combineDateTime(eventDate, eventTime)
      const endDateTimestamp = combineDateTime(endDate, endTime)

      const data = {
        title,
        subtitle: subtitle || undefined,
        description,
        originalLanguage,
        location,
        venue: venue || undefined,
        eventDate: eventDateTimestamp!,
        endDate: endDateTimestamp,
        isFeatured,
        isActive,
        status,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        minPassengers: minPassengers ? parseInt(minPassengers) : undefined,
        maxPassengers: maxPassengers ? parseInt(maxPassengers) : undefined,
        basePrice: parseFloat(basePrice),
        sharedPrice: sharedPrice ? parseFloat(sharedPrice) : undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        currency,
        bannerImageId: bannerImageId as any,
        additionalBannerIds: additionalBanners.length > 0 ? additionalBanners.map((b) => b.id) as any : undefined,
        included: parseListField(included).length > 0 ? parseListField(included) : undefined,
        excluded: parseListField(excluded).length > 0 ? parseListField(excluded) : undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        meetingPoint: meetingPoint || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      }

      if (initialData) {
        await updateEvent({ id: initialData._id, ...data })
        toast.success(t("form.successUpdated"))
      } else {
        await createEvent(data)
        toast.success(t("form.successCreated"))
      }

      onClose()
    } catch (error) {
      console.error(error)
      const msg = error instanceof Error ? error.message : String(error)
      toast.error(msg && msg !== "[object Object]" ? msg : t("form.errorGeneric"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const headerTitle = initialData ? t("form.editEvent") : t("form.addNewEvent")
  const headerDescription = initialData
    ? t("form.editDescription")
    : t("form.createDescription")

  const STEPS = [
    { value: "basic", label: t("form.tabs.basic"), icon: Info },
    { value: "content", label: t("form.tabs.content"), icon: FileText },
    { value: "media", label: t("form.tabs.media"), icon: Image },
    { value: "meeting", label: t("form.tabs.meetingPoint"), icon: MapPin },
    { value: "pricing", label: t("form.tabs.pricing"), icon: DollarSign },
    { value: "addons", label: t("form.tabs.addons"), icon: Gem },
    { value: "settings", label: t("form.tabs.settings"), icon: Settings },
    { value: "seo", label: t("form.tabs.seo"), icon: Search },
  ]
  const currentStepIndex = Math.max(0, STEP_ORDER.indexOf(activeTab))

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">{headerTitle}</h2>
          <p className="text-sm text-muted-foreground">{headerDescription}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="shrink-0 rounded-full h-9 w-9 flex items-center justify-center bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="sticky top-0 z-10 -mx-4 -mt-5 border-b border-border bg-background px-4 pb-3 pt-8 lg:-mx-8 lg:-mt-6 lg:px-8 lg:pt-9">
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
          <span className="truncate">{STEPS[currentStepIndex]?.label}</span>
          <span className="shrink-0 pl-3 tabular-nums">
            {currentStepIndex + 1} / {STEPS.length}
          </span>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded bg-muted">
          <div
            className="absolute left-0 top-0 h-1 rounded bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step, i) => {
            const isActive = step.value === activeTab
            const isDone = i < currentStepIndex
            return (
              <button
                key={step.value}
                type="button"
                onClick={() => setActiveTab(step.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isDone
                      ? "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/15"
                      : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                    isActive
                      ? "bg-primary-foreground/20"
                      : isDone
                        ? "bg-primary/20"
                        : "bg-muted",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="rounded-lg border border-border bg-card">
              <TabsContent value="basic" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
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
                      <Label>{t("form.locationLabel")} *</Label>
                      <Select value={location} onValueChange={setLocation} disabled={isSubmitting}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PORTUGAL_LOCATIONS.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="venue">{t("form.venueLabel")}</Label>
                      <Input
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder={t("form.venuePlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
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

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("form.eventDateTime")}
                    </Label>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("form.startDate")} *</Label>
                        <Input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("form.startTime")}</Label>
                        <Input
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          disabled={isSubmitting}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("form.endDate")}</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          disabled={isSubmitting}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("form.endTime")}</Label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          disabled={isSubmitting}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
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

              <TabsContent value="media" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
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
                  <p className="text-sm text-muted-foreground">{t("form.additionalBannersHelp")}</p>
                  <MultiImageUpload
                    value={additionalBanners}
                    onChange={setAdditionalBanners}
                    disabled={isSubmitting}
                    maxImages={15}
                  />
                </div>
              </TabsContent>

              <TabsContent value="meeting" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <GoogleMapsInput
                  value={meetingPoint}
                  onChange={setMeetingPoint}
                  label={t("form.meetingPointLabel")}
                  disabled={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="pricing" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> {t("form.pricingLabel")}
                  </Label>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                      <Label htmlFor="sharedPrice">{t("form.sharedPriceLabel")}</Label>
                      <Input
                        id="sharedPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={sharedPrice}
                        onChange={(e) => setSharedPrice(e.target.value)}
                        placeholder="0.00"
                        disabled={isSubmitting}
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("form.sharedPriceHint")}
                      </p>
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="maxCapacity">{t("form.maxCapacityLabel")}</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        min="1"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        placeholder={t("form.maxCapacityPlaceholder")}
                        disabled={isSubmitting}
                        className="h-9"
                      />
                    </div>
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
                </div>
              </TabsContent>

              <TabsContent value="addons" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <TourAddonsBuilder
                  entityId={initialData?._id}
                  entityType="event"
                  originalLanguage={originalLanguage}
                />
              </TabsContent>

              <TabsContent value="settings" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
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
                        <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                        <SelectItem value="completed">{t("completed")}</SelectItem>
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
                          <span className={`font-semibold text-sm ${isAtFeaturedLimit ? "text-muted-foreground" : "text-foreground"}`}>{t("form.featuredEvent")}</span>
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
                  </div>
                </div>

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
              </TabsContent>

              <TabsContent value="seo" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
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
                  </div>
                </div>
              </TabsContent>
        </div>
      </Tabs>

      <div className="-mx-4 flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-4 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 px-5"
          >
            {t("form.cancelButton")}
          </Button>
          {currentStepIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab(STEP_ORDER[currentStepIndex - 1]!)}
              disabled={isSubmitting}
              className="h-11 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          )}
        </div>
        {currentStepIndex < STEP_ORDER.length - 1 ? (
          <Button
            type="button"
            onClick={() => setActiveTab(STEP_ORDER[currentStepIndex + 1]!)}
            className="h-11 px-8 font-bold"
          >
            Seguinte
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 font-bold">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? t("form.saveChanges") : t("form.createEventButton")}
          </Button>
        )}
      </div>
    </form>
  )
}
