"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

type Category = "all" | "weddings" | "corporate" | "events" | "tours"

type Photo = {
  src: string
  alt: string
  cat: Exclude<Category, "all">
  /** Legenda já resolvida: vem do título no backend, ou de uma chave de tradução
   *  nas fotos de recurso. */
  label: string
  /** Destino do clique, definido por foto no admin. Sem ele a foto não é
   *  clicável — que é como as fotos de recurso se comportam. */
  href?: string
}

const CATEGORIES: { id: Category; labelKey: string }[] = [
  { id: "all", labelKey: "filters.all" },
  { id: "weddings", labelKey: "filters.weddings" },
  { id: "corporate", labelKey: "filters.corporate" },
  { id: "events", labelKey: "filters.events" },
  { id: "tours", labelKey: "filters.tours" },
]

const FALLBACK: { src: string; alt: string; cat: Exclude<Category, "all">; labelKey: string }[] = [
  { src: "/about/exp-tennis-cascais.webp", alt: "Estoril Open tennis at Cascais", cat: "events", labelKey: "photos.tennisCascais" },
  { src: "/about/exp-websummit.webp", alt: "Web Summit Lisbon", cat: "corporate", labelKey: "photos.webSummit" },
  { src: "/about/exp-golf.jpg", alt: "Golf course at sunset", cat: "tours", labelKey: "photos.golfAlgarve" },
  { src: "/about/exp-wedding.webp", alt: "Wedding ceremony procession", cat: "weddings", labelKey: "photos.weddingPenhaLonga" },
  { src: "/about/exp-vip-chauffeur-lisbon.webp", alt: "LuxMotion chauffeur with a VIP guest beside a Mercedes E-Class in Lisbon", cat: "events", labelKey: "photos.vipChauffeurLisbon" },
  { src: "/about/exp-private-aviation.webp", alt: "LuxMotion Sprinter van beside a private jet on the apron", cat: "corporate", labelKey: "photos.privateAviation" },
]

function PhotoTile({ photo, className }: { photo: Photo; className?: string }) {
  const label = photo.label
  // Só vira link quando há destino: um <Link> sem href não é opção, e um <a>
  // vazio ficaria focável e anunciado pelo leitor de ecrã sem levar a lado nenhum.
  const Tile = photo.href ? Link : "div"
  const tileProps = photo.href
    ? {
        href: photo.href,
        // Links para fora abrem noutro separador; os internos ficam na mesma janela.
        ...(/^https?:\/\//.test(photo.href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      }
    : {}
  return (
    <Tile
      {...(tileProps as { href: string })}
      className={cn("group relative block overflow-hidden", className)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 950px"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors duration-500 ease-out" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <span
          className="text-[#C9A96E] text-[14px] md:text-[15px] font-semibold uppercase tracking-[2px] text-center opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {label}
        </span>
      </div>
    </Tile>
  )
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-12 border border-[rgba(154,117,53,0.4)] flex items-center justify-center text-[#C9A96E] transition-colors",
        disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-[rgba(201,169,110,0.08)]",
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      <Icon className="size-[18px]" strokeWidth={1.5} />
    </button>
  )
}

export function PastExperiencesSection() {
  const t = useTranslations("aboutPage.pastExperiences")
  const [active, setActive] = useState<Category>("all")
  const [mobileIdx, setMobileIdx] = useState(0)

  // A secção era uma lista fixa no código: o que o admin publicasse em
  // /admin/experiences nunca aparecia aqui.
  const published = useQuery(api.pastExperiences.listPublished)

  const photos: Photo[] = useMemo(() => {
    const fromBackend = (published ?? [])
      .filter((e) => Boolean(e.imageUrl))
      .map((e) => ({
        src: e.imageUrl as string,
        alt: e.title,
        // No schema a categoria dos tours chama-se privateTours.
        cat: (e.category === "privateTours" ? "tours" : e.category) as Exclude<
          Category,
          "all"
        >,
        label: e.location ? `${e.title} · ${e.location}` : e.title,
        href: e.linkUrl || undefined,
      }))

    if (fromBackend.length > 0) return fromBackend

    // Nada publicado (ou ainda a carregar): mantém-se o conteúdo que já estava
    // no ar, em vez de deixar a secção vazia.
    return FALLBACK.map((f) => ({
      src: f.src,
      alt: f.alt,
      cat: f.cat,
      label: t(f.labelKey),
    }))
  }, [published, t])

  const filtered = useMemo(
    () => (active === "all" ? photos : photos.filter((p) => p.cat === active)),
    [active, photos],
  )

  // The hero layout needs exactly 4 tiles; anything beyond that falls into the
  // regular grid underneath it.
  const showAsymmetric = active === "all" && filtered.length >= 4
  const overflow = showAsymmetric ? filtered.slice(4) : []

  const handleCategory = (cat: Category) => {
    setActive(cat)
    setMobileIdx(0)
  }

  const mobileMax = Math.max(filtered.length - 1, 0)

  return (
    <section className="bg-[#0D0D0D] flex flex-col items-center px-4 md:px-[82px] py-20 md:py-24">
      <div className="flex flex-col gap-10 items-center w-full max-w-[1280px]">
        <div className="flex flex-col gap-[14px] items-center w-full">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="text-white font-normal text-center leading-[1.2]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block italic text-[#C9A96E]">{t("headingLine2")}</span>
          </h2>
          <p
            className="text-[14px] md:text-[18px] text-center text-[#999] max-w-[540px] leading-[1.3]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className="flex gap-2 items-center overflow-x-auto no-scrollbar w-full md:w-auto md:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((c) => {
            const isActive = active === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategory(c.id)}
                className={cn(
                  "h-8 px-4 text-[12px] font-semibold uppercase tracking-[0.7px] whitespace-nowrap shrink-0 transition-colors",
                  isActive
                    ? "bg-[#C9A96E] text-[#0D0D0D] border border-[rgba(201,169,110,0.18)]"
                    : "text-[#999] hover:text-white",
                )}
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {t(c.labelKey)}
              </button>
            )
          })}
        </div>

        <div className="hidden md:block w-full">
          {showAsymmetric ? (
            <div className="flex flex-col gap-[2px] w-full">
              <div className="flex gap-[2px] w-full h-[394px]">
                <PhotoTile photo={filtered[0]!} className="w-[950px] h-full shrink-0" />
                <PhotoTile photo={filtered[1]!} className="flex-1 h-full" />
              </div>
              <div className="flex gap-[2px] w-full h-[394px]">
                <PhotoTile photo={filtered[2]!} className="w-[509px] h-full shrink-0" />
                <PhotoTile photo={filtered[3]!} className="flex-1 h-full" />
              </div>
              {overflow.length > 0 && (
                <div className="grid grid-cols-2 gap-[2px] w-full">
                  {overflow.map((p) => (
                    <PhotoTile key={p.src} photo={p} className="h-[394px]" />
                  ))}
                </div>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#999] py-16">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-[2px] w-full">
              {filtered.map((p) => (
                <PhotoTile key={p.src} photo={p} className="h-[394px]" />
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden w-full flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p className="text-center text-[#999] py-16">{t("empty")}</p>
          ) : (
            <>
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${mobileIdx * 100}%)` }}
                >
                  {filtered.map((p) => (
                    <div key={p.src} className="shrink-0 w-full">
                      <PhotoTile photo={p} className="w-full h-[340px]" />
                    </div>
                  ))}
                </div>
              </div>
              {filtered.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <CarouselArrow
                    direction="left"
                    onClick={() => setMobileIdx((i) => Math.max(i - 1, 0))}
                    disabled={mobileIdx === 0}
                  />
                  <div className="flex gap-2 items-center px-4">
                    {filtered.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMobileIdx(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                          "rounded-full transition-all",
                          i === mobileIdx ? "size-[6px] bg-[#C9A96E]" : "size-[5px] bg-[rgba(201,169,110,0.4)]",
                        )}
                      />
                    ))}
                  </div>
                  <CarouselArrow
                    direction="right"
                    onClick={() => setMobileIdx((i) => Math.min(i + 1, mobileMax))}
                    disabled={mobileIdx >= mobileMax}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
