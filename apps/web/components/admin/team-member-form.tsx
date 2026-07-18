"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
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

interface TeamMemberFormProps {
  onClose: () => void
  initialData?: any
}

export function TeamMemberForm({ onClose, initialData }: TeamMemberFormProps) {
  const t = useTranslations("adminTeam")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [imageId, setImageId] = React.useState<string | undefined>()
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"draft" | "published">("draft")
  const [order, setOrder] = React.useState("0")

  const createMember = useMutation(api.teamMembers.create)
  const updateMember = useMutation(api.teamMembers.update)

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setRole(initialData.role || "")
      setBio(initialData.bio || "")
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
    setRole("")
    setBio("")
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

    try {
      setIsSubmitting(true)

      const data = {
        name,
        role,
        bio: bio.trim() || undefined,
        imageId: imageId as any,
        status,
        order: parseInt(order) || 0,
      }

      if (initialData) {
        await updateMember({ id: initialData._id, ...data })
        toast.success(t("form.successUpdated"))
      } else {
        await createMember(data)
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
            {initialData ? t("form.editMember") : t("form.addNewMember")}
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
                <Label htmlFor="role">{t("form.roleLabel")}</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={t("form.rolePlaceholder")}
                  disabled={isSubmitting}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("form.bioLabel")}</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("form.bioPlaceholder")}
                disabled={isSubmitting}
                rows={3}
                className="resize-none"
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

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-background px-4 py-3 lg:-mx-8 lg:px-8">
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
