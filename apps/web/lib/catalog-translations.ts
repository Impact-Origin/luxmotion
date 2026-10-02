export interface CatalogTranslation {
  locale: string;
  name?: string;
  title?: string;
  description?: string;
  duration?: string;
  examples?: string;
}

export function translatedField(
  translations: readonly CatalogTranslation[] | undefined,
  locale: string,
  field: Exclude<keyof CatalogTranslation, "locale">,
  fallback: string,
): string {
  return (
    translations?.find((entry) => entry.locale === locale)?.[field]?.trim() ||
    fallback
  );
}

// Existing vehicle classes predate per-vehicle translations. Keep model and
// brand names intact; only exact, known class names use these defaults.
const vehicleClasses: Record<string, Record<string, string>> = {
  standard: {
    pt: "Standard",
    en: "Standard",
    de: "Standard",
    nl: "Standaard",
    fr: "Standard",
    es: "Estándar",
  },
  executive: {
    pt: "Executivo",
    en: "Executive",
    de: "Businessklasse",
    nl: "Executive",
    fr: "Exécutif",
    es: "Ejecutivo",
  },
  business: {
    pt: "Classe Executiva",
    en: "Business Class",
    de: "Businessklasse",
    nl: "Businessclass",
    fr: "Classe affaires",
    es: "Clase ejecutiva",
  },
  businessVan: {
    pt: "Van Classe Executiva",
    en: "Business Class Van",
    de: "Businessklasse-Van",
    nl: "Businessclass-van",
    fr: "Van classe affaires",
    es: "Van de clase ejecutiva",
  },
  first: {
    pt: "Primeira Classe",
    en: "First Class",
    de: "Erste Klasse",
    nl: "Eerste klas",
    fr: "Première classe",
    es: "Primera clase",
  },
  van: { pt: "Van", en: "Van", de: "Van", nl: "Van", fr: "Van", es: "Van" },
  minibus: {
    pt: "Minibus",
    en: "Minibus",
    de: "Kleinbus",
    nl: "Minibus",
    fr: "Minibus",
    es: "Minibús",
  },
  coach: {
    pt: "Autocarro",
    en: "Coach",
    de: "Reisebus",
    nl: "Touringcar",
    fr: "Autocar",
    es: "Autocar",
  },
};
const classAliases: Record<string, string> = {
  standard: "standard",
  padrão: "standard",
  xl: "xl",
  executivo: "executive",
  executive: "executive",
  "business class": "business",
  "classe executiva": "business",
  "business class van": "businessVan",
  "van classe executiva": "businessVan",
  "first class": "first",
  "primeira classe": "first",
  van: "van",
  minibus: "minibus",
  minibús: "minibus",
  autocarro: "coach",
  coach: "coach",
  bus: "coach",
};

export function localizeVehicle<
  T extends {
    name: string;
    originalName?: string;
    examples?: string;
    originalExamples?: string;
    translations?: CatalogTranslation[];
  },
>(
  vehicle: T,
  locale: string,
): T & { originalName: string; originalExamples: string | undefined } {
  const originalName = vehicle.originalName ?? vehicle.name;
  const originalExamples = vehicle.originalExamples ?? vehicle.examples;
  const key = classAliases[originalName.trim().toLowerCase()];
  const fallback = (key && vehicleClasses[key]?.[locale]) || originalName;
  return {
    ...vehicle,
    originalName,
    originalExamples,
    name: translatedField(vehicle.translations, locale, "name", fallback),
    examples: translatedField(
      vehicle.translations,
      locale,
      "examples",
      originalExamples ?? "",
    ),
  };
}

export function localizeSelection<
  T extends {
    title: string;
    originalTitle?: string;
    translations?: CatalogTranslation[];
  },
>(item: T, locale: string): T {
  const originalTitle = item.originalTitle ?? item.title;
  return {
    ...item,
    originalTitle,
    title: translatedField(item.translations, locale, "title", originalTitle),
  };
}
