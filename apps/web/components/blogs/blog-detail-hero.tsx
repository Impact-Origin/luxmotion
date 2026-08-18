"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Eye } from "lucide-react"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
}

export interface BlogHeroBreadcrumb {
  label: string
  href?: string
}

interface BlogDetailHeroProps {
  imageUrl?: string | null
  imageAlt?: string | null
  breadcrumbs: BlogHeroBreadcrumb[]
  category?: string
  title: string
  author?: string
  publishedDate?: string
  readTime?: string
  views?: string
}

function splitTitle(title: string): { head: string; accent?: string } {
  const idx = title.indexOf(":")
  if (idx === -1) return { head: title }
  return {
    head: title.slice(0, idx + 1),
    accent: title.slice(idx + 1).trim() || undefined,
  }
}

function getInitial(name?: string): string {
  if (!name) return "•"
  const cleaned = name.replace(/^By\s+/i, "").trim()
  return cleaned.charAt(0).toUpperCase() || "•"
}

export function BlogDetailHero({
  imageUrl,
  imageAlt,
  breadcrumbs,
  category,
  title,
  author,
  publishedDate,
  readTime,
  views,
}: BlogDetailHeroProps) {
  const bg = imageUrl || "/blogs/blogs-details-hero.webp"
  const { head, accent } = splitTitle(title)
  const cleanAuthor = author?.replace(/^By\s+/i, "").trim()

  return (
    <section className="relative w-full overflow-hidden bg-[#0D0D0D] min-h-[520px] lg:min-h-[600px]">
      <Image
        src={bg}
        /* A capa é a imagem do artigo, não decoração: quando a automação
           escreveu um alt, ele vai para o leitor de ecrã. */
        alt={imageAlt ?? ""}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[rgba(13,13,13,0.65)] to-[rgba(13,13,13,0.25)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[rgba(13,13,13,0.35)] to-transparent" />

      <div className="relative z-10 flex flex-col justify-end min-h-[520px] lg:min-h-[600px] pb-[52px] px-4 md:px-[82px] lg:px-[136px] 2xl:px-[200px]">
        <div className="flex flex-col gap-[13.1px] items-start w-full max-w-[1280px]">
          {breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap items-center gap-2 pb-2">
              {breadcrumbs.map((item, i) => {
                const last = i === breadcrumbs.length - 1
                return (
                  <span key={`${item.label}-${i}`} className="flex items-center gap-2">
                    {item.href && !last ? (
                      <Link
                        href={item.href}
                        className="text-[12px] text-[#999] hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={`text-[12px] ${last ? "text-white" : "text-[#999]"}`}>
                        {item.label}
                      </span>
                    )}
                    {!last && <span className="text-[12px] font-medium text-[#999]">›</span>}
                  </span>
                )
              })}
            </nav>
          )}

          {category && (
            <div className="bg-[#C9A96E] inline-flex items-center px-3 py-1">
              <span className="text-[12px] font-semibold uppercase tracking-[1px] text-[#0D0D0D]">
                {category}
              </span>
            </div>
          )}

          <h1
            className="text-white text-[36px] sm:text-[42px] lg:text-[48px] font-medium leading-[1.14] max-w-[640px] lg:max-w-[900px]"
            style={SERIF_FONT}
          >
            <span>{head}</span>
            {accent && (
              <>
                <br className="lg:hidden" />
                <span className="lg:ml-2 italic text-[#C9A96E]" style={SERIF_FONT}>
                  {accent}
                </span>
              </>
            )}
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2 mt-1">
            {cleanAuthor && (
              <div className="flex items-center gap-2">
                <div className="bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] flex items-center justify-center rounded-full size-6 shrink-0">
                  <span className="text-[#C9A96E] text-[10px] font-semibold leading-none">
                    {getInitial(cleanAuthor)}
                  </span>
                </div>
                <span className="text-[12px] text-[#999]">{cleanAuthor}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {cleanAuthor && (
                <span className="hidden lg:inline-block w-[7px] h-px bg-[rgba(153,153,153,0.6)]" />
              )}
              {publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#999]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#999]">{publishedDate}</span>
                </div>
              )}
              {readTime && (
                <>
                  <span className="hidden sm:inline-block w-[7px] h-px bg-[rgba(153,153,153,0.6)]" />
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-[#999]" strokeWidth={1.5} />
                    <span className="text-[12px] text-[#999]">{readTime}</span>
                  </div>
                </>
              )}
              {views && (
                <>
                  <span className="hidden sm:inline-block w-[7px] h-px bg-[rgba(153,153,153,0.6)]" />
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-[#999]" strokeWidth={1.5} />
                    <span className="text-[12px] text-[#999]">{views}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
