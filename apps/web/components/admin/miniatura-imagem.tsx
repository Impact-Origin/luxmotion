"use client"

import * as React from "react"
import { ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Miniatura de uma imagem do storage, com estado visível.
 *
 * Duas coisas que estavam a dar cartões brancos e que esta componente resolve:
 *
 * - a imagem pode ficar pronta ANTES de o React ligar o `onLoad` — em cache é o
 *   que acontece sempre. Aí o evento nunca dispara e a imagem, que entra a
 *   `opacity-0`, nunca chegava a aparecer. `complete` na montagem apanha esse
 *   caso, e `naturalWidth` a zero distingue o carregado do falhado;
 * - `loading="lazy"` numa grelha adiava o pedido até o browser decidir que a
 *   imagem era precisa, e havia contextos em que essa decisão nunca chegava.
 */
export function MiniaturaImagem({
  url,
  alt,
  className,
}: {
  url: string
  alt: string
  /** Classes do contentor; por omissão um 16/9. */
  className?: string
}) {
  const ref = React.useRef<HTMLImageElement>(null)
  const [estado, setEstado] = React.useState<"a-carregar" | "pronta" | "falhou">(
    "a-carregar",
  )

  React.useEffect(() => {
    const img = ref.current
    if (!img) return
    setEstado("a-carregar")
    if (img.complete) setEstado(img.naturalWidth > 0 ? "pronta" : "falhou")
  }, [url])

  return (
    <div
      className={cn("relative aspect-video bg-muted/30", className)}
      data-estado={estado}
    >
      {estado === "a-carregar" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {estado === "falhou" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            Não foi possível mostrar esta imagem
          </span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={url}
        alt={alt}
        decoding="async"
        onLoad={() => setEstado("pronta")}
        onError={() => setEstado("falhou")}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          estado === "pronta" ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  )
}
