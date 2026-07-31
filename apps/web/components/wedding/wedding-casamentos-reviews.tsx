"use client"

import { useEffect, useRef } from "react"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const WIDGET_SRC =
  "https://cdn1.casamentos.pt/js/wp-widget.js?symfnw-PT69-1-20260730-003-0_www_m_"
const STOREFRONT_ID = 178639

/**
 * Widget de opiniões do Casamentos.pt. O script é externo e escreve dentro de
 * #wp-widget-reviews; o conteúdo do div é o que fica visível se o script não
 * carregar (bloqueadores, rede), por isso é um link de recurso e não um vazio.
 */
export function WeddingCasamentosReviews() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const render = () => {
      const show = (window as unknown as {
        wpShowReviews?: (id: number, theme: string) => void
      }).wpShowReviews
      if (typeof show === "function") show(STOREFRONT_ID, "white")
    }

    // O script pode já ter sido carregado por outra navegação (SPA).
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SRC}"]`,
    )
    if (existing) {
      render()
      return
    }

    const script = document.createElement("script")
    script.src = WIDGET_SRC
    script.async = true
    script.onload = render
    document.body.appendChild(script)
  }, [])

  return (
    <section className="w-full bg-[#f7f4ef] px-4 pb-14 md:px-20 md:pb-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4">
        {/* O widget traz o seu próprio HTML; estas regras obrigam-no a ficar em
            linha. Cobrem as duas formas habituais (lista ou divs) porque o
            script é de terceiros e o markup pode mudar sem aviso. */}
        <style>{`
          #wp-widget-reviews { width: 100%; }
          #wp-widget-reviews :is(ul, ol) {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 16px;
            overflow-x: auto;
            list-style: none;
            margin: 0;
            padding: 0 0 8px;
            scrollbar-width: thin;
          }
          #wp-widget-reviews :is(ul, ol) > li {
            flex: 0 0 auto;
            width: min(320px, 80vw);
          }
          #wp-widget-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
            font-size: 14px;
            color: #7a746e;
          }
          #wp-widget-preview a { color: #a08248; text-decoration: underline; }
        `}</style>

        <div id="wp-widget-reviews" style={SANS_FONT}>
          <div id="wp-widget-preview">
            Leia{" "}
            <a
              href="https://www.casamentos.pt/carros-casamento/luxmotion--e178639/opinioes"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              as nossas opiniões
            </a>{" "}
            em
            <a
              href="https://www.casamentos.pt"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {/* Logótipo servido pelo próprio Casamentos.pt. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn1.casamentos.pt/assets/img/logos/gen_logoHeader.svg"
                height={20}
                alt="Casamentos.pt"
                style={{ height: 20 }}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
