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

interface ExperienceFormProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export function ExperienceForm({ isOpen, onClose, initialData }: ExperienceFormProps) {
  const t = useTranslations("adminExperiences")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [category, setCategory] = React.useState<string>("corporate")
  const [tags, setTags] = React.useState("")
  const [imageId, setImageId] = React.useState<string | undefined>()
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"draft" | "published">("draft")

  const createExperience = useMutation(api.pastExperiences.create)
  const updateExperience = useMutation(api.pastExperiences.update)

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setDescription(initialData.description || "")
      setLocation(initialData.location || "")
      setCategory(initialData.category || "corporate")
      setTags(initialData.tags?.join(", ") || "")
      setImageId(initialData.imageId)
      setPreviewUrl(initialData.imageUrl || null)
      setStatus(initialData.status || "draft")
    } else {
      resetForm()
    }
  }, [initialData, isOpen])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation("")
    setCategory("corporate")
    setTags("")
    setImageId(undefined)
    setPreviewUrl(null)
    setStatus("draft")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error(t("form.titleRequired"))
      return
    }

    if (!description.trim()) {
      toast.error(t("form.descriptionRequired"))
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
        description,
        location,
        category: category as "corporate" | "weddings" | "events" | "privateTours",
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        imageId: imageId as any,
        status,
      }

      if (initialData) {
        await updateExperience({ id: initialData._id, ...data })
        toast.success(t("form.successUpdated"))
      } else {
        await createExperience(data)
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
          <DialogTitle>{initialData ? t("form.editExperience") : t("form.addNewExperience")}</DialogTitle>
          <DialogDescription>
            {initialData ? t("form.editDescription") : t("form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t("form.titleLabel")} *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("form.titlePlaceholder")}
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("form.descriptionLabel")} *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
                required
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t("form.locationLabel")} *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("form.locationPlaceholder")}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("form.categoryLabel")} *</Label>
                <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">{t("categories.corporate")}</SelectItem>
                    <SelectItem value="weddings">{t("categories.weddings")}</SelectItem>
                    <SelectItem value="events">{t("categories.events")}</SelectItem>
                    <SelectItem value="privateTours">{t("categories.privateTours")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{t("form.tagsLabel")}</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t("form.tagsPlaceholder")}
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("form.imageLabel")}</Label>
              <ImageUpload
                value={previewUrl}
                onChange={(id) => {
                  setImageId(id)
                  if (!id) setPreviewUrl(null)
                }}
                disabled={isSubmitting}
              />
            </div>

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
