"use client"

import Script from "next/script"
import { OPENAI_PIXEL_ID } from "@/lib/oaiq"

/**
 * O script base do pixel do ChatGPT Ads, uma vez por página.
 *
 * `afterInteractive` e não `beforeInteractive`: o próprio script já se carrega
 * de forma assíncrona (repara no `j.async=1`), portanto pô-lo a bloquear o
 * arranque da página não adiantava nada e custava no LCP.
 *
 * Fica fora do admin e das pré-visualizações de propósito — são páginas
 * internas, e a navegação de quem cá trabalha não é audiência.
 */
export function OpenAIPixel() {
  if (!OPENAI_PIXEL_ID) return null

  return (
    <Script id="oaiq-init" strategy="afterInteractive">
      {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:${JSON.stringify(OPENAI_PIXEL_ID)},debug:true});`}
    </Script>
  )
}
