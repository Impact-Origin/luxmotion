"use client"

import { useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2, Upload, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
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
import { toast } from "sonner"

type Pillar = "standard" | "experiences" | "logistics"
type Duration = "halfDay" | "fullDay" | "multiDay"

const SUBCATEGORIES: Record<Pillar, { value: string; label: string }[]> = {
  standard: [
    { value: "incentive", label: "Incentive Travel" },
    { value: "gala", label: "Corporate & Gala Dinners" },
    { value: "conventions", label: "Conventions" },
    { value: "congresses", label: "Congresses" },
    { value: "meetings", label: "Meetings & Seminars" },
    { value: "cultural", label: "Cultural Events" },
  ],
  experiences: [
    { value: "teambuilding", label: "Teambuilding Games" },
    { value: "activities", label: "Activities & Tours" },
    { value: "sightseeing", label: "Sightseeing Excursions" },
    { value: "foodwine", label: "Food & Wine" },
    { value: "sport", label: "Sport & Nature" },
    { value: "entertainment", label: "Entertainment" },
  ],
  logistics: [
    { value: "premium", label: "Transfers" },
    { value: "airport", label: "Airport Meet & Greet" },
    { value: "hotels", label: "Hotels & Accommodation" },
    { value: "guides", label: "Guides & Local Assistance" },
  ],
}

function parseExperienceItems(text: string): { strong: string; body: string }[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("|")
      if (idx === -1) return { strong: "", body: line }
      return {
        strong: line.slice(0, idx).trim(),
        body: line.slice(idx + 1).trim(),
      }
    })
}

function serializeExperienceItems(items: { strong: string; body: string }[]): string {
  return items.map((i) => `${i.strong} | ${i.body}`).join("\n")
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
}

export function CorporateExperienceForm({
  open,
  onClose,
  initialData,
}: {
  open: boolean
  onClose: () => void
  initialData: any
}) {
  const create = useMutation(api.corporateExperiences.create)
  const update = useMutation(api.corporateExperiences.update)
  const generateUploadUrl = useMutation(api.corporateExperiences.generateUploadUrl)

  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [titlePrefix, setTitlePrefix] = useState("")
  const [titleAccent, setTitleAccent] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [duration, setDuration] = useState<Duration>("halfDay")
  const [pillar, setPillar] = useState<Pillar>("experiences")
  const [subcategory, setSubcategory] = useState<string>("teambuilding")
  const [groupSize, setGroupSize] = useState("")
  const [durationLabel, setDurationLabel] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [experienceBody, setExperienceBody] = useState("")
  const [experienceItemsText, setExperienceItemsText] = useState("")
  const [routeHighlightsText, setRouteHighlightsText] = useState("")
  const [whatsIncludedText, setWhatsIncludedText] = useState("")
  const [coverImageId, setCoverImageId] = useState<Id<"_storage"> | undefined>()
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryImageIds, setGalleryImageIds] = useState<Id<"_storage">[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    if (!open) return
    if (initialData) {
      setTitlePrefix(initialData.titlePrefix || "")
      setTitleAccent(initialData.titleAccent || "")
      setShortDescription(initialData.shortDescription || "")
      setDuration(initialData.duration || "halfDay")
      setPillar(initialData.pillar || "experiences")
      setSubcategory(initialData.subcategory || "teambuilding")
      setGroupSize(initialData.groupSize || "")
      setDurationLabel(initialData.durationLabel || "")
      setLocation(initialData.location || "")
      setDescription(initialData.description || "")
      setExperienceBody(initialData.experienceBody || "")
      setExperienceItemsText(serializeExperienceItems(initialData.experienceItems ?? []))
      setRouteHighlightsText((initialData.routeHighlights ?? []).join("\n"))
      setWhatsIncludedText((initialData.whatsIncluded ?? []).join("\n"))
      setCoverImageId(initialData.coverImageId)
      setCoverPreview(initialData.coverImageUrl ?? null)
      setGalleryImageIds(initialData.galleryImageIds ?? [])
      setGalleryPreviews(
        (initialData.galleryImageUrls ?? []).filter((u: any): u is string => Boolean(u)),
      )
      setStatus(initialData.status || "draft")
      setSortOrder(initialData.sortOrder ?? 0)
    } else {
      setTitlePrefix("")
      setTitleAccent("")
      setShortDescription("")
      setDuration("halfDay")
      setPillar("experiences")
      setSubcategory("teambuilding")
      setGroupSize("")
      setDurationLabel("")
      setLocation("")
      setDescription("")
      setExperienceBody("")
      setExperienceItemsText("")
      setRouteHighlightsText("")
      setWhatsIncludedText("")
      setCoverImageId(undefined)
      setCoverPreview(null)
      setGalleryImageIds([])
      setGalleryPreviews([])
      setStatus("draft")
      setSortOrder(0)
    }
  }, [open, initialData])

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const url = await generateUploadUrl()
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    if (!res.ok) throw new Error("Upload failed")
    const { storageId } = await res.json()
    return storageId
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const id = await uploadFile(file)
      setCoverImageId(id)
      setCoverPreview(URL.createObjectURL(file))
    } catch (err) {
      toast.error("Cover upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const ids = await Promise.all(files.map(uploadFile))
      setGalleryImageIds((prev) => [...prev, ...ids].slice(0, 8))
      setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8))
    } catch (err) {
      toast.error("Gallery upload failed")
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryItem = (i: number) => {
    setGalleryImageIds((prev) => prev.filter((_, idx) => idx !== i))
    setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    if (!titlePrefix.trim() || !titleAccent.trim() || !shortDescription.trim()) {
      toast.error("Title and short description are required")
      return
    }

    setSubmitting(true)
    const payload = {
      titlePrefix: titlePrefix.trim(),
      titleAccent: titleAccent.trim(),
      shortDescription: shortDescription.trim(),
      duration,
      pillar,
      subcategory,
      groupSize: groupSize.trim(),
      durationLabel: durationLabel.trim(),
      location: location.trim(),
      description: description.trim(),
      experienceBody: experienceBody.trim(),
      experienceItems: parseExperienceItems(experienceItemsText),
      routeHighlights: parseLines(routeHighlightsText),
      whatsIncluded: parseLines(whatsIncludedText),
      coverImageId,
      galleryImageIds,
      status,
      sortOrder,
    }

    try {
      if (initialData) {
        await update({ id: initialData._id, ...payload })
        toast.success("Experience updated")
      } else {
        await create(payload)
        toast.success("Experience created")
      }
      onClose()
    } catch (err) {
      console.error(err)
      toast.error("Save failed")
    } finally {
      setSubmitting(false)
    }
  }

  const subOptions = SUBCATEGORIES[pillar]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit experience" : "New experience"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Title prefix *</Label>
              <Input
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
                placeholder="Lisbon Vintage:"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Title accent (italic gold) *</Label>
              <Input
                value={titleAccent}
                onChange={(e) => setTitleAccent(e.target.value)}
                placeholder="Polaroid Challenge"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Short description (card preview) *</Label>
            <Textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={2}
              placeholder="Explore Lisbon through a vintage Polaroid lens..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Pillar</Label>
              <Select
                value={pillar}
                onValueChange={(v) => {
                  setPillar(v as Pillar)
                  setSubcategory(SUBCATEGORIES[v as Pillar][0]!.value)
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Events & MICE</SelectItem>
                  <SelectItem value="experiences">Experiences & Teambuilding</SelectItem>
                  <SelectItem value="logistics">Logistics & Concierge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Subcategory</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {subOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={(v) => setDuration(v as Duration)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="halfDay">Half day</SelectItem>
                  <SelectItem value="fullDay">Full day</SelectItem>
                  <SelectItem value="multiDay">Multi-day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Group size</Label>
              <Input value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="10–80 people" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Duration label</Label>
              <Input value={durationLabel} onChange={(e) => setDurationLabel(e.target.value)} placeholder="3-4 hours" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lisbon · Chiado & Baixa" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Description (drawer overview)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Step back in time and capture the soul of Lisbon..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Experience body (long text)</Label>
            <Textarea
              value={experienceBody}
              onChange={(e) => setExperienceBody(e.target.value)}
              rows={6}
              placeholder="Operating in the historic heart of the city..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Experience items (one per line, format: <code>Strong | body</code>)</Label>
            <Textarea
              value={experienceItemsText}
              onChange={(e) => setExperienceItemsText(e.target.value)}
              rows={4}
              placeholder={'The "One-Shot" Quest: | Identify specific architectural details...\nLocal Portraits: | Interact with the "Lisboetas"...'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Route highlights (one per line)</Label>
            <Textarea
              value={routeHighlightsText}
              onChange={(e) => setRouteHighlightsText(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>What&apos;s included (one per line)</Label>
            <Textarea
              value={whatsIncludedText}
              onChange={(e) => setWhatsIncludedText(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cover image (card thumbnail)</Label>
            <div className="flex items-start gap-3">
              {coverPreview ? (
                <div className="relative h-24 w-32 border border-[#e7ddca] rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="" className="size-full object-cover" />
                </div>
              ) : (
                <div className="h-24 w-32 border border-dashed border-[#ddd0b8] rounded bg-[#faf6ee]" />
              )}
              <label className="inline-flex items-center gap-2 h-9 px-3 text-sm border border-[#e7ddca] rounded-md cursor-pointer hover:bg-[#A08248]/[0.06]">
                <Upload className="size-4" />
                Choose file
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Gallery images (drawer thumbnails, max 8)</Label>
            <div className="flex flex-wrap gap-2">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="relative h-20 w-20 border border-[#e7ddca] rounded overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(i)}
                    className="absolute top-1 right-1 size-5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {galleryImageIds.length < 8 && (
                <label className="h-20 w-20 border border-dashed border-[#ddd0b8] rounded bg-[#faf6ee] cursor-pointer flex items-center justify-center hover:bg-[#A08248]/[0.09]">
                  <Upload className="size-4 text-[#a99e8c]" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Sort order (lower = first)</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#efe7d8]">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
              {initialData ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
