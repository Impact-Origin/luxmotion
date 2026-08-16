/* Página temporária, só para medir o carrossel sem depender do Convex. */
"use client"

import * as React from "react"
import { ExperienceCard } from "@/components/checkout/experience-card"

const PARAGENS = [
  { t: "Convento de Mafra", l: "Mafra", d: "Palácio barroco Património UNESCO, com a Real Basílica e uma das maiores bibliotecas da Europa." },
  { t: "Azenhas do Mar", l: "Sintra", d: "Aldeia branca debruçada sobre o oceano, uma das vistas mais fotografadas da costa." },
  { t: "Cabo da Roca", l: "Sintra", d: "O ponto mais ocidental da Europa Continental, falésias a 140 metros sobre o Atlântico." },
  { t: "Palácio da Pena", l: "Sintra", d: "Romantismo em cima da serra, com vista sobre toda a linha de Cascais." },
  { t: "Boca do Inferno", l: "Cascais", d: "Gruta aberta pelo mar na rocha, a poucos minutos do centro de Cascais." },
]

export default function ProbeCards() {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [medida, setMedida] = React.useState("")

  const medir = React.useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const pista = el.getBoundingClientRect()
    const cortados = [...el.children].filter((c) => {
      const r = c.getBoundingClientRect()
      // visível mas não inteiro: é um cartão cortado
      const visivel = r.right > pista.left + 1 && r.left < pista.right - 1
      return visivel && (r.left < pista.left - 1 || r.right > pista.right + 1)
    })
    setMedida(
      JSON.stringify({
        pista: Math.round(pista.width),
        cartao: Math.round(el.children[0]!.getBoundingClientRect().width),
        inteirosAVista: [...el.children].filter((c) => {
          const r = c.getBoundingClientRect()
          return r.left >= pista.left - 1 && r.right <= pista.right + 1
        }).length,
        cortados: cortados.length,
        sobra:
          Math.round(
            pista.width -
              (3 * el.children[0]!.getBoundingClientRect().width + 2 * 16),
          ),
      }),
    )
  }, [])

  React.useEffect(() => {
    medir()
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [medir])

  return (
    <div className="checkout-theme dark min-h-screen bg-[#0d0d0d] p-10">
      <pre id="medida" className="mb-4 text-[12px] text-[#c9a96e]">
        {medida}
      </pre>
      <div className="mx-auto max-w-[891px]">
        <div
          ref={trackRef}
          className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PARAGENS.map((p) => (
            <div
              key={p.t}
              className="w-full shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <ExperienceCard
                title={p.t}
                price={30}
                duration="30 min"
                image="/images/placeholder-experience.webp"
                locationLabel={p.l}
                description={p.d}
                durations={[
                  { minutes: 15, price: 15 },
                  { minutes: 30, price: 30 },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
