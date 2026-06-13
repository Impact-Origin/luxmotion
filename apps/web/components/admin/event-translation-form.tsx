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
import { BlogEditor } from "./blog-editor"
import { toast } from "sonner"
import { Loader2, Globe, Check, Trash2 } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"

interface EventTranslationFormProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  originalLanguage: string
  availableLanguages: string[]
}

const LANGUAGES = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt", label: "Portuguese", flag: "🇵🇹" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "nl", label: "Dutch", flag: "🇳🇱" },
]

export function EventTranslationForm({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  originalLanguage,
  availableLanguages,
}: EventTranslationFormProps) {
  const [selectedLocale, setSelectedLocale] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [description, setDescription] = React.useState<any>(null)
  const [included, setIncluded] = React.useState("")
  const [excluded, setExcluded] = React.useState("")
  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")

  const translation = useQuery(
    api.events.getTranslation,
    selectedLocale && selectedLocale !== originalLanguage
      ? { eventId: eventId as any, locale: selectedLocale }
      : "skip"
  )

  const upsertTranslation = useMutation(api.events.upsertTranslation)
  const removeTranslation = useMutation(api.events.removeTranslation)

  React.useEffect(() => {
    if (translation) {
      setTitle(translation.title || "")
      setSubtitle(translation.subtitle || "")
      setDescription(translation.description || null)
      setIncluded(translation.included?.join("\n") || "")
      setExcluded(translation.excluded?.join("\n") || "")
      setSeoTitle(translation.seoTitle || "")
      setSeoDescription(translation.seoDescription || "")
    } else if (selectedLocale && selectedLocale !== originalLanguage) {
      setTitle("")
      setSubtitle("")
      setDescription(null)
      setIncluded("")
      setExcluded("")
      setSeoTitle("")
      setSeoDescription("")
    }
  }, [translation, selectedLocale, originalLanguage])

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedLocale(null)
    }
  }, [isOpen])

  const parseListField = (value: string): string[] => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedLocale || selectedLocale === originalLanguage) {
      toast.error("Please select a language to translate to")
      return
    }

    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      setIsSubmitting(true)

      await upsertTranslation({
        eventId: eventId as any,
        locale: selectedLocale,
        title,
        subtitle: subtitle || undefined,
        description,
        included: parseListField(included).length > 0 ? parseListField(included) : undefined,
        excluded: parseListField(excluded).length > 0 ? parseListField(excluded) : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      })

      toast.success("Translation saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save translation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedLocale || selectedLocale === originalLanguage) return

    try {
      setIsDeleting(true)
      await removeTranslation({
        eventId: eventId as any,
        locale: selectedLocale,
      })
      toast.success("Translation deleted")
      setSelectedLocale(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete translation")
    } finally {
      setIsDeleting(false)
    }
  }

  const translatableLanguages = LANGUAGES.filter(
    (lang) => lang.value !== originalLanguage
  )

  const hasTranslation = (locale: string) => availableLanguages.includes(locale)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Manage Translations
          </DialogTitle>
          <DialogDescription>
            Translate "{eventTitle}" into different languages
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-[240px] border-r bg-[#faf6ee] p-4 overflow-y-auto shrink-0">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-[#8a8074] uppercase tracking-wider">
                Original
              </div>
              <div className="px-3 py-2 rounded-lg bg-[#e7ddca] text-[#211c16] font-medium flex items-center gap-2">
                <span>{LANGUAGES.find((l) => l.value === originalLanguage)?.flag}</span>
                <span>{LANGUAGES.find((l) => l.value === originalLanguage)?.label}</span>
              </div>

              <div className="px-3 py-2 text-xs font-semibold text-[#8a8074] uppercase tracking-wider mt-4">
                Translations
              </div>

              {translatableLanguages.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setSelectedLocale(lang.value)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-left font-medium flex items-center gap-2 transition-colors",
                    selectedLocale === lang.value
                      ? "bg-[#221c15] text-white"
                      : "hover:bg-[#A08248]/[0.09] text-[#4a443c]"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span className="flex-1">{lang.label}</span>
                  {hasTranslation(lang.value) && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedLocale ? (
              <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        {LANGUAGES.find((l) => l.value === selectedLocale)?.flag}{" "}
                        {LANGUAGES.find((l) => l.value === selectedLocale)?.label} Translation
                      </h3>
                      <p className="text-sm text-[#8a8074]">
                        {hasTranslation(selectedLocale) ? "Edit existing translation" : "Create new translation"}
                      </p>
                    </div>
                    {hasTranslation(selectedLocale) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Translated title..."
                        required
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Translated subtitle..."
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-bold">Description</Label>
                    <BlogEditor
                      content={description}
                      onChange={setDescription}
                      disabled={isSubmitting}
                      placeholder="Translated description..."
                      minHeight="150px"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-green-700">What's Included</Label>
                      <Textarea
                        value={included}
                        onChange={(e) => setIncluded(e.target.value)}
                        placeholder="One item per line..."
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-bold text-red-700">What's Excluded</Label>
                      <Textarea
                        value={excluded}
                        onChange={(e) => setExcluded(e.target.value)}
                        placeholder="One item per line..."
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-bold">SEO</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-[#8a8074]">SEO Title</Label>
                        <Input
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder="Translated SEO title..."
                          disabled={isSubmitting}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#8a8074]">SEO Description</Label>
                        <Textarea
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          placeholder="Translated meta description..."
                          disabled={isSubmitting}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t bg-[#faf6ee] flex justify-end gap-3 shrink-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#221c15] text-white hover:bg-[#3a3026]"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {hasTranslation(selectedLocale) ? "Update Translation" : "Create Translation"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#8a8074]">
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-[#c9bfae]" />
                  <p className="font-medium">Select a language</p>
                  <p className="text-sm">Choose a language from the left to add or edit translations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
