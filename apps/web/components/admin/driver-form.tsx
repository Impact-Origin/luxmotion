"use client"

import * as React from "react"
import { useMutation } from "convex/react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface DriverFormProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export function DriverForm({ isOpen, onClose, initialData }: DriverFormProps) {
  const t = useTranslations("adminDrivers")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [quote, setQuote] = React.useState("")
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
      setImageId(initialData.imageId)
      setPreviewUrl(initialData.imageUrl || null)
      setStatus(initialData.status || "draft")
      setOrder(initialData.order?.toString() || "0")
    } else {
      resetForm()
    }
  }, [initialData, isOpen])

  const resetForm = () => {
    setName("")
    setLocation("")
    setQuote("")
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
      toast.error(t("form.errorGeneric"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>{initialData ? t("form.editDriver") : t("form.addNewDriver")}</DialogTitle>
          <DialogDescription>
            {initialData ? t("form.editDescription") : t("form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
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
                  className="h-11"
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
                  className="h-11"
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
                className="min-h-[100px]"
              />
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
                  <SelectTrigger className="h-11">
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
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-[#faf6ee] flex justify-end gap-3 shrink-0">
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
              className="bg-[#221c15] text-white hover:bg-[#3a3026] h-11 px-8 font-bold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? t("form.saveChanges") : t("form.createButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
