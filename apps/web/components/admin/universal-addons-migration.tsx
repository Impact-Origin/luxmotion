"use client"

import * as React from "react"
import { useMemo } from "react"
import { useMutation, useQueries } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Grupo = {
  titulo: string
  copias: number
  precos: number[]
  tiposDePreco: string[]
  scopes: ("tours" | "events" | "ultraLuxury")[]
  semEsteExtra: number
  conflito: boolean
}

const ROTULO: Record<string, string> = {
  tours: "Tours",
  events: "Eventos",
  ultraLuxury: "Ultra-luxo",
}

/**
 * Converte os extras repetidos em universais.
 *
 * Só aparece enquanto houver repetidos, e nunca converte às cegas: mostra
 * primeiro quantas cópias existem, que âmbito se infere e quantos tours ficariam
 * com um extra que hoje não têm — esses recebem a excepção, para nada mudar no
 * site por causa da conversão.
 */
export function ConversorDeRepetidos() {
  const queries = useMemo(
    () => ({ grupos: { query: api.universalAddons.previewMigration, args: {} } }),
    [],
  )
  const bruto = useQueries(queries).grupos
  const grupos: Grupo[] = Array.isArray(bruto) ? (bruto as Grupo[]) : []

  const converter = useMutation(api.universalAddons.migrateGroups)

  const [aberto, setAberto] = React.useState(false)
  const [escolhidos, setEscolhidos] = React.useState<string[]>([])
  const [aConverter, setAConverter] = React.useState(false)

  const convertiveis = grupos.filter((g) => !g.conflito)
  const totalCopias = grupos.reduce((n, g) => n + g.copias, 0)

  React.useEffect(() => {
    if (aberto) setEscolhidos(convertiveis.map((g) => g.titulo))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  if (grupos.length === 0) return null

  const alternar = (titulo: string) =>
    setEscolhidos((a) =>
      a.includes(titulo) ? a.filter((t) => t !== titulo) : [...a, titulo],
    )

  const confirmar = async () => {
    if (escolhidos.length === 0) return
    setAConverter(true)
    try {
      const r = await converter({ titles: escolhidos })
      toast.success(
        `${r.criados} ${r.criados === 1 ? "extra universal criado" : "extras universais criados"}, ` +
          `${r.apagados} cópias apagadas, ${r.excepcoes} excepções escritas.`,
      )
      if (r.ignorados.length > 0) {
        toast.warning(`Ficaram de fora: ${r.ignorados.join(", ")}`)
      }
      setAberto(false)
    } catch (erro) {
      console.error(erro)
      toast.error("A conversão falhou.")
    } finally {
      setAConverter(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-2.5">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="min-w-0 flex-1 truncate text-sm">
          <span className="font-medium">
            {grupos.length} {grupos.length === 1 ? "extra repetido" : "extras repetidos"}
          </span>
          <span className="text-muted-foreground">
            {" "}
            · {totalCopias} cópias espalhadas por tours e eventos
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 text-xs"
          onClick={() => setAberto(true)}
        >
          Converter
        </Button>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Converter repetidos em universais</DialogTitle>
            <DialogDescription>
              Cada grupo vira um extra só. As cópias são apagadas, e os tours que
              hoje não o têm ficam com ele desligado — no site nada muda.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 divide-y divide-border overflow-y-auto">
            {grupos.map((g) => (
              <label
                key={g.titulo}
                className={`flex items-start gap-3 py-3 ${
                  g.conflito ? "opacity-60" : "cursor-pointer"
                }`}
              >
                <Checkbox
                  className="mt-0.5"
                  checked={escolhidos.includes(g.titulo)}
                  disabled={g.conflito}
                  onCheckedChange={() => alternar(g.titulo)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{g.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.copias} cópias · {g.scopes.map((s) => ROTULO[s]).join(", ")} ·{" "}
                    {g.precos.map((p) => `${p.toFixed(2)} €`).join(" / ")}
                  </p>
                  {g.conflito ? (
                    <p className="mt-0.5 text-xs text-amber-600">
                      Preços ou tipos de preço diferentes entre as cópias. Acerta-os
                      primeiro, ou converte à mão.
                    </p>
                  ) : g.semEsteExtra > 0 ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {g.semEsteExtra}{" "}
                      {g.semEsteExtra === 1 ? "não o tem" : "não o têm"} hoje e ficam com
                      ele desligado
                    </p>
                  ) : null}
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              {escolhidos.length} de {convertiveis.length} seleccionados
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAberto(false)} disabled={aConverter}>
                Cancelar
              </Button>
              <Button onClick={confirmar} disabled={aConverter || escolhidos.length === 0}>
                {aConverter && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Converter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
