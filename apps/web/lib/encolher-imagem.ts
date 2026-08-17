/**
 * Encolhe uma imagem antes de a enviar.
 *
 * As imagens dos extras vinham da câmara em 2688×1520 e mais de 1 MB cada. Como
 * o optimizador do `next/image` está desligado no projecto (a quota do Vercel
 * esgotou — ver `next.config.mjs`), o browser descarrega o ficheiro original em
 * todo o lado onde a imagem aparece: uma grelha com quinze delas eram quinze
 * megabytes e vários segundos de quadrados vazios.
 *
 * 1600px de lado maior chega de sobra para um extra, que no site nunca passa de
 * um cartão pequeno.
 */
const LADO_MAXIMO = 1600
const QUALIDADE = 0.82

export async function encolherImagem(ficheiro: File): Promise<File> {
  // SVG e GIF não sobrevivem a uma passagem por canvas (perdem vector e
  // animação); seguem como estão.
  if (!/^image\/(jpeg|png|webp)$/.test(ficheiro.type)) return ficheiro

  try {
    const bitmap = await createImageBitmap(ficheiro)
    const maior = Math.max(bitmap.width, bitmap.height)
    if (maior <= LADO_MAXIMO) {
      bitmap.close()
      return ficheiro
    }

    const escala = LADO_MAXIMO / maior
    const largura = Math.round(bitmap.width * escala)
    const altura = Math.round(bitmap.height * escala)

    const canvas = document.createElement("canvas")
    canvas.width = largura
    canvas.height = altura
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      bitmap.close()
      return ficheiro
    }
    ctx.drawImage(bitmap, 0, 0, largura, altura)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALIDADE),
    )
    if (!blob) return ficheiro

    const nome = ficheiro.name.replace(/\.[^.]+$/, "") + ".webp"
    return new File([blob], nome, { type: "image/webp" })
  } catch {
    // Qualquer falha (formato estranho, canvas sem memória) manda o original:
    // mais vale uma imagem pesada do que nenhuma.
    return ficheiro
  }
}
