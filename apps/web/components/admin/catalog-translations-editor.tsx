"use client";

import { useId, useState } from "react";
import { locales, localeNames, type Locale } from "@/i18n/config";
import type { CatalogTranslation } from "@/lib/catalog-translations";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";

interface TranslationField {
  key: Exclude<keyof CatalogTranslation, "locale">;
  label: string;
  multiline?: boolean;
}

export function CatalogTranslationsEditor({
  value,
  onChange,
  fields,
}: {
  value: CatalogTranslation[];
  onChange: (value: CatalogTranslation[]) => void;
  fields: TranslationField[];
}) {
  const id = useId();
  const [locale, setLocale] = useState<Locale>("en");
  const selected = value.find((entry) => entry.locale === locale);

  function update(field: TranslationField["key"], text: string) {
    const next = { ...selected, locale, [field]: text };
    const others = value.filter((entry) => entry.locale !== locale);
    const hasText = Object.entries(next).some(
      ([key, text]) => key !== "locale" && text.trim(),
    );
    onChange(hasText ? [...others, next] : others);
  }

  return (
    <details className="rounded-xl border border-border bg-card p-4">
      <summary className="cursor-pointer font-semibold">Traduções</summary>
      <p className="mt-3 text-sm text-muted-foreground">
        Preenche os textos por idioma. Os campos vazios usam o texto original.
      </p>
      <div
        className="my-3 flex flex-wrap gap-2"
        role="group"
        aria-label="Idioma da tradução"
      >
        {locales.map((language) => (
          <button
            key={language}
            type="button"
            aria-pressed={locale === language}
            className={`rounded border px-3 py-1 text-sm ${locale === language ? "bg-primary text-primary-foreground" : "bg-background"}`}
            onClick={() => setLocale(language)}
          >
            {localeNames[language]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {fields.map((field) => {
          const fieldId = `${id}-${locale}-${field.key}`;
          const props = {
            id: fieldId,
            value: selected?.[field.key] ?? "",
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => update(field.key, event.target.value),
          };
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={fieldId}>
                {field.label} · {localeNames[locale]}
              </Label>
              {field.multiline ? <Textarea {...props} /> : <Input {...props} />}
            </div>
          );
        })}
      </div>
    </details>
  );
}
