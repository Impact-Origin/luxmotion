"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

/**
 * As mesmas imagens e os mesmos tempos do hero da página principal
 * (`components/new-landing-page/hero.tsx`): 5,5s por imagem e 1,2s a esbater.
 *
 * São recortes com canal alfa, e é por isso que assentam sobre o #0D0D0D deste
 * hero — ao contrário das de `/partner-guide/hero`, que vinham com o branco
 * achatado.
 */
const SLIDES = [
  "/hero/1-luxmotion.webp",
  "/hero/2-corporate.webp",
  "/hero/3-wedding.webp",
  "/hero/4-tour.webp",
  "/hero/5-school.webp",
] as const

const INTERVALO_MS = 5500

/**
 * Timeout e não interval, como na home: o efeito depende do índice, por isso
 * qualquer mudança reinicia a contagem em vez de saltar logo a seguir.
 */
function useSlideshow() {
  const [indice, setIndice] = React.useState(0)

  React.useEffect(() => {
    // Quem pediu menos animação ao sistema fica com a primeira imagem fixa.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const id = window.setTimeout(
      () => setIndice((i) => (i + 1) % SLIDES.length),
      INTERVALO_MS,
    )
    return () => window.clearTimeout(id)
  }, [indice])

  return indice
}

export function HeroSlider({
  className,
  objectPosition = "object-center",
}: {
  /** Altura e posicionamento do contentor, que difere entre os dois guias. */
  className?: string
  objectPosition?: string
}) {
  const indice = useSlideshow()

  return (
    <div className={className}>
      {SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width:1024px) 46vw, 100vw"
          // Só a primeira conta para o LCP; as outras entram depois.
          priority={i === 0}
          className={cn(
            "object-contain transition-opacity duration-[1200ms] ease-in-out",
            objectPosition,
            i === indice ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  )
}
