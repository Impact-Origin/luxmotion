"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { GooglePlacesInput, type GooglePlaceValue } from "@/components/ui/google-places-input"

interface ToursSearchBarProps {
  value: GooglePlaceValue
  onChange: (value: GooglePlaceValue) => void
  onSearch: (value?: GooglePlaceValue) => void
  placeholder?: string
  className?: string
}

export function ToursSearchBar({ value, onChange, onSearch, placeholder, className }: ToursSearchBarProps) {
  const t = useTranslations("toursHero")
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const handleChange = (next: GooglePlaceValue) => {
    onChange(next)
    if (next.lat !== null && next.lng !== null) {
      onSearch(next)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-[552px]",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Esta barra só existe dentro das heros de /tours/results e /tours/[destino],
          que assentam numa fotografia com um gradiente escuro fixo nos dois temas.
          Por isso fica escura de propósito: o input por dentro é a variante
          "tours-hero-dark" (texto branco) e clarear a caixa deixava-o invisível. */}
      <div className="w-full min-w-0 h-[56px] bg-[#1e1d1b] border border-[rgba(255,255,255,0.12)] flex items-center">
        <GooglePlacesInput
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          variant="tours-hero-dark"
          showDefaultSuggestions={false}
          className="flex-1 h-full"
        />
      </div>
      {/* Duas ações a meias: pesquisar o que está escrito, ou saltar
          directamente para a lista completa sem escrever nada. */}
      <div className="flex w-full items-stretch">
        <button
          onClick={() => onSearch()}
          className="flex flex-1 h-[56px] items-center justify-center border border-[#c9a96e] bg-[#c9a96e] transition-colors hover:bg-[#b8954f]"
        >
          <span className="text-[14px] font-medium text-[#0d0d0d] tracking-[1.1px] uppercase whitespace-nowrap">
            {t("redesign.searchButton")}
          </span>
        </button>
        <button
          onClick={() => router.push("/tours/results")}
          className="flex flex-1 h-[56px] items-center justify-center border border-l-0 border-[#c9a96e] bg-transparent transition-colors hover:bg-[rgba(201,169,110,0.12)]"
        >
          <span className="text-[14px] font-medium text-[#c9a96e] tracking-[1.1px] uppercase whitespace-nowrap">
            {t("redesign.viewAllButton")}
          </span>
        </button>
      </div>
    </div>
  )
}
