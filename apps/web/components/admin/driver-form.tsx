"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import { useTranslations } from "next-intl"

interface DriverFormProps {
  onClose: () => void
  initialData?: any
}

export function DriverForm({ onClose, initialData }: DriverFormProps) {
  const t = useTranslations("adminDrivers")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [quote, setQuote] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [languages, setLanguages] = React.useState("")
  const [vehicle, setVehicle] = React.useState("")
  const [rating, setRating] = React.useState("")
  const [rides, setRides] = React.useState("")
  const [imageId, setImageId] = React.useState<string | undefined>()
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"draft" | "published">("draft")
  const [order, setOrder] = React.useState("0")

  const createDriver = useMutation(api.drivers.create)
  const updateDriver = useMutation(api.drivers.update)

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setLocation(initialData.location || "")
      setQuote(initialData.quote || "")
      setDescription(initialData.description || "")
      setLanguages(initialData.languages || "")
      setVehicle(initialData.vehicle || "")
      setRating(initialData.rating || "")
      setRides(initialData.rides?.toString() || "")
      setImageId(initialData.imageId)
      setPreviewUrl(initialData.imageUrl || null)
      setStatus(initialData.status || "draft")
      setOrder(initialData.order?.toString() || "0")
    } else {
      resetForm()
    }
  }, [initialData])

  const resetForm = () => {
    setName("")
    setLocation("")
    setQuote("")
    setDescription("")
    setLanguages("")
    setVehicle("")
    setRating("")
    setRides("")
    setImageId(undefined)
    setPreviewUrl(null)
    setStatus("draft")
    setOrder("0")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error(t("form.nameRequired"))
      return
    }

    if (!quote.trim()) {
      toast.error(t("form.quoteRequired"))
      return
    }

    try {
      setIsSubmitting(true)

      const data = {
        name,
        location,
        quote,
        // Sent as-is (empty string included) so clearing a field in the admin
        // actually clears it; the public hook falls back to the translated copy.
        description,
        languages,
        vehicle,
        rating,
        rides: rides.trim() === "" ? undefined : Number(rides) || 0,
        imageId: imageId as any,
        status,
        order: parseInt(order) || 0,
      }

      if (initialData) {
        await updateDriver({ id: initialData._id, ...data })
        toast.success(t("form.successUpdated"))
      } else {
        await createDriver(data)
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">
            {initialData ? t("form.editDriver") : t("form.addNewDriver")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {initialData ? t("form.editDescription") : t("form.createDescription")}
          </p>
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

      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("form.nameLabel")} *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.namePlaceholder")}
                  required
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t("form.locationLabel")}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("form.locationPlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">{t("form.quoteLabel")} *</Label>
              <Textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder={t("form.quotePlaceholder")}
                required
                disabled={isSubmitting}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("form.descriptionLabel")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="languages">{t("form.languagesLabel")}</Label>
                <Input
                  id="languages"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder={t("form.languagesPlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">{t("form.vehicleLabel")}</Label>
                <Input
                  id="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder={t("form.vehiclePlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">{t("form.ratingLabel")}</Label>
                <Input
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder={t("form.ratingPlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rides">{t("form.ridesLabel")}</Label>
                <Input
                  id="rides"
                  type="number"
                  min="0"
                  value={rides}
                  onChange={(e) => setRides(e.target.value)}
                  placeholder={t("form.ridesPlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("form.photoLabel")}</Label>
              <ImageUpload
                value={previewUrl}
                onChange={(id) => {
                  setImageId(id)
                  if (!id) setPreviewUrl(null)
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("form.statusLabel")} *</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)} disabled={isSubmitting}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("draft")}</SelectItem>
                    <SelectItem value="published">{t("published")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">{t("form.orderLabel")}</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>
            </div>
        </div>
      </div>

      <div className="-mx-4 flex items-center justify-end gap-3 border-t border-border bg-background px-4 py-4 lg:-mx-8 lg:px-8">
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
          {initialData ? t("form.saveChanges") : t("form.createButton")}
        </Button>
      </div>
    </form>
  )
}
