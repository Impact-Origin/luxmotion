"use client"

import { useState, type FormEvent } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Doc, Id } from "@workspace/convex/dataModel"
import { CORPORATE_LANGUAGES, type CorporateExperienceText } from "@workspace/convex/convex/lib/corporateExperienceTranslations"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Globe, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

const FIELDS = [
  { name: "titlePrefix", label: "Title prefix", rows: 0, required: true },
  { name: "titleAccent", label: "Title accent (italic gold)", rows: 0 },
  { name: "shortDescription", label: "Short description (card preview)", rows: 2 },
  { name: "groupSize", label: "Group size", rows: 0 },
  { name: "durationLabel", label: "Duration label", rows: 0 },
  { name: "location", label: "Location", rows: 0 },
  { name: "description", label: "Description (drawer overview)", rows: 3 },
  { name: "experienceBody", label: "Experience body (long text)", rows: 6 },
  { name: "experienceItems", label: "Experience items (one per line: Strong | body)", rows: 4 },
  { name: "routeHighlights", label: "Route highlights (one per line)", rows: 4 },
  { name: "whatsIncluded", label: "What's included (one per line)", rows: 4 },
] as const

type Field = (typeof FIELDS)[number]["name"]
type TextValues = Record<Field, string>
type Translation = Doc<"corporateExperienceTranslations">

function formValues(data: Partial<CorporateExperienceText>): TextValues {
  return {
    titlePrefix: data.titlePrefix ?? "",
    titleAccent: data.titleAccent ?? "",
    shortDescription: data.shortDescription ?? "",
    groupSize: data.groupSize ?? "",
    durationLabel: data.durationLabel ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    experienceBody: data.experienceBody ?? "",
    experienceItems: (data.experienceItems ?? []).map((item) => `${item.strong} | ${item.body}`).join("\n"),
    routeHighlights: (data.routeHighlights ?? []).join("\n"),
    whatsIncluded: (data.whatsIncluded ?? []).join("\n"),
  }
}

const lines = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean)
const optionalText = (text: string) => text.trim() || undefined

function TranslationFields({
  experience, locale, translation,
}: {
  experience: Doc<"corporateExperiences">
  locale: string
  translation: Translation | null
}) {
  const [values, setValues] = useState(() => formValues(translation ?? {}))
  const [busy, setBusy] = useState(false)
  const upsert = useMutation(api.corporateExperiences.upsertTranslation)
  const remove = useMutation(api.corporateExperiences.removeTranslation)
  const source = formValues(experience)

  async function save(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      await upsert({
        experienceId: experience._id,
        locale,
        titlePrefix: values.titlePrefix.trim(),
        titleAccent: optionalText(values.titleAccent),
        shortDescription: optionalText(values.shortDescription),
        groupSize: optionalText(values.groupSize),
        durationLabel: optionalText(values.durationLabel),
        location: optionalText(values.location),
        description: optionalText(values.description),
        experienceBody: optionalText(values.experienceBody),
        experienceItems: optionalText(values.experienceItems) ? lines(values.experienceItems).map((line) => {
          const separator = line.indexOf("|")
          return separator < 0 ? { strong: "", body: line } : {
            strong: line.slice(0, separator).trim(), body: line.slice(separator + 1).trim(),
          }
        }) : undefined,
        routeHighlights: optionalText(values.routeHighlights) ? lines(values.routeHighlights) : undefined,
        whatsIncluded: optionalText(values.whatsIncluded) ? lines(values.whatsIncluded) : undefined,
      })
      toast.success("Translation saved successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save translation")
    } finally {
      setBusy(false)
    }
  }

  async function deleteTranslation() {
    setBusy(true)
    try {
      await remove({ experienceId: experience._id, locale })
      toast.success("Translation deleted")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete translation")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{CORPORATE_LANGUAGES.find((language) => language.value === locale)?.label}</h3>
          {translation && (
            <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={deleteTranslation} className="text-destructive">
              <Trash2 className="mr-2 size-4" /> Delete translation
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Empty optional fields use the original text. Placeholders show the original content.</p>
        {FIELDS.map((field) => {
          const id = `corporate-translation-${field.name}`
          const props = {
            id,
            value: values[field.name],
            placeholder: source[field.name],
            disabled: busy,
            required: "required" in field && field.required,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setValues((previous) => ({ ...previous, [field.name]: event.target.value })),
          }
          return (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={id}>{field.label}{"required" in field && field.required ? " *" : ""}</Label>
              {field.rows ? <Textarea {...props} rows={field.rows} /> : <Input {...props} className="h-9" />}
            </div>
          )
        })}
      </div>
      <div className="flex shrink-0 justify-end border-t bg-muted p-4">
        <Button type="submit" disabled={busy || !values.titlePrefix.trim()}>
          {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
          {translation ? "Update Translation" : "Create Translation"}
        </Button>
      </div>
    </form>
  )
}

export function CorporateExperienceTranslationForm({ experienceId, onClose }: {
  experienceId: Id<"corporateExperiences">
  onClose: () => void
}) {
  const [locale, setLocale] = useState<string | null>(null)
  const experience = useQuery(api.corporateExperiences.get, { id: experienceId })
  const translation = useQuery(api.corporateExperiences.getTranslation,
    locale ? { experienceId, locale } : "skip")
  const originalLanguage = experience?.originalLanguage ?? "pt"
  const original = CORPORATE_LANGUAGES.find((language) => language.value === originalLanguage)

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="flex h-[90vh] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b p-6">
          <DialogTitle className="flex items-center gap-2"><Globe className="size-5" /> Manage Translations</DialogTitle>
          <DialogDescription>Translate {experience ? `“${experience.titlePrefix} ${experience.titleAccent}”` : "this experience"} into different languages</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
          <div className="shrink-0 overflow-y-auto border-b bg-muted p-4 sm:w-[240px] sm:border-b-0 sm:border-r">
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Original</div>
            <div className="mb-4 rounded-lg bg-accent px-3 py-2 font-medium">{original?.flag} {original?.label}</div>
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Translations</div>
            <div className="flex flex-wrap gap-1 sm:flex-col">
              {CORPORATE_LANGUAGES.filter((language) => language.value !== originalLanguage).map((language) => (
                <button type="button" key={language.value} onClick={() => setLocale(language.value)}
                  className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-left font-medium transition-colors",
                    locale === language.value ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                >
                  <span>{language.flag}</span><span className="flex-1">{language.label}</span>
                  {experience?.availableLanguages.includes(language.value) && <Check className="size-4 text-green-500" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {experience && locale && translation !== undefined ? (
              <TranslationFields key={`${locale}:${translation?._id ?? "new"}:${translation?.updatedAt ?? 0}`}
                experience={experience} locale={locale} translation={translation} />
            ) : experience === null ? (
              <div className="flex flex-1 items-center justify-center p-6 text-muted-foreground">Experience not found</div>
            ) : experience === undefined || locale ? (
              <div className="flex flex-1 items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                <Globe className="mb-2 size-12 opacity-60" />
                <p className="font-medium">Select a language</p>
                <p className="text-sm">Choose a language to add or edit translations</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
