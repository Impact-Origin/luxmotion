"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

/**
 * As mesmas imagens do hero da página principal, e o mesmo comportamento:
 * troca de quatro em quatro segundos, com um esbatimento de um segundo.
 *
 * São recortes com canal alfa, e é por isso que estas servem e as de
 * `/partner-guide/hero` não serviam — essas vinham com o fundo branco achatado
 * e apareceriam como um rectângulo claro sobre o #0D0D0D deste hero.
 */
const IMAGENS = [
  { src: "/hero-carousel/transfers.webp", alt: "Transfer service" },
  { src: "/hero-carousel/wedding.webp", alt: "Wedding service" },
  { src: "/hero-carousel/corporative.webp", alt: "Corporate service" },
  { src: "/hero-carousel/school.webp", alt: "School service" },
]

const INTERVALO_MS = 4000

export function HeroSlider({
  className,
  objectPosition = "object-center",
}: {
  /** Altura e posicionamento do contentor, que difere entre os dois guias. */
  className?: string
  objectPosition?: string
}) {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndice((i) => (i + 1) % IMAGENS.length),
      INTERVALO_MS,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className={className}>
      {IMAGENS.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === indice ? 1 : 0, zIndex: i === indice ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className={`object-contain ${objectPosition}`}
            sizes="(min-width:1024px) 46vw, 100vw"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}
