"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

/**
 * Escolha de hora sem o selector nativo do browser.
 *
 * O `<input type="time">` desenha o widget do sistema — no Chrome uma coluna
 * azul com o tema do sistema operativo, que não tem nada a ver com o resto do
 * admin e muda de forma conforme a máquina. Aqui são duas listas normais, as
 * mesmas que o formulário já usa em todo o lado.
 *
 * O valor entra e sai como `"HH:MM"`, igual ao do input nativo, para os sítios
 * que já o guardavam assim não terem de mudar.
 */
const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTOS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))

export function TimeSelect({
  value,
  onChange,
  disabled,
  id,
}: {
  /** `"HH:MM"`, ou vazio quando ainda não há hora. */
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
}) {
  const [hora, minuto] = value ? value.split(":") : ["", ""]

  /* Escolher só uma das metades não dá uma hora válida; a outra assume o zero,
     que é o que se espera de "17" → 17:00. */
  const definir = (h: string, m: string) => {
    if (!h && !m) return onChange("")
    onChange(`${h || "00"}:${m || "00"}`)
  }

  return (
    <div className="flex items-center gap-2" id={id}>
      <Select
        /* String vazia e não `undefined`: com `undefined` o Radix trata o
           campo como não-controlado e o gatilho ficava a mostrar a hora antiga
           depois de limpar. */
        value={hora ?? ""}
        onValueChange={(h) => definir(h, minuto ?? "")}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-[84px]">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="max-h-[260px]">
          {HORAS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground">:</span>

      <Select
        value={minuto ?? ""}
        onValueChange={(m) => definir(hora ?? "", m)}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-[84px]">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="max-h-[260px]">
          {MINUTOS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value && !disabled && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
