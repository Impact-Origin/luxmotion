export const CORPORATE_LANGUAGES = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "pt", label: "Portuguese", flag: "🇵🇹" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "nl", label: "Dutch", flag: "🇳🇱" },
] as const

export type CorporateExperienceText = {
  titlePrefix: string
  titleAccent: string
  shortDescription: string
  groupSize: string
  durationLabel: string
  location: string
  description: string
  experienceBody: string
  experienceItems: { strong: string; body: string }[]
  routeHighlights: string[]
  whatsIncluded: string[]
}

export type CorporateExperienceTranslation = Partial<CorporateExperienceText> & { locale: string }

// Existing Corporate records contain Portuguese source text.
export const corporateOriginalLanguage = (experience: { originalLanguage?: string }) =>
  experience.originalLanguage ?? "pt"

export function localizeCorporateExperience<T extends CorporateExperienceText & { originalLanguage?: string }>(
  experience: T,
  translation: CorporateExperienceTranslation | null | undefined,
  locale: string,
): T {
  if (locale === corporateOriginalLanguage(experience) || translation?.locale !== locale) return experience

  const localized = { ...experience }
  const textFields = [
    "titlePrefix", "titleAccent", "shortDescription", "groupSize", "durationLabel",
    "location", "description", "experienceBody",
  ] as const
  for (const field of textFields) {
    const value = translation[field]?.trim()
    if (value) localized[field] = value
  }
  for (const field of ["experienceItems", "routeHighlights", "whatsIncluded"] as const) {
    const value = translation[field]
    if (value !== undefined) Object.assign(localized, { [field]: value })
  }
  return localized
}
