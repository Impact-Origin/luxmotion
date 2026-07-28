"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin, Users, X } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@workspace/ui/components/sheet"
import { useTranslations } from "next-intl"

export type ExperienceDetail = {
  _id: string
  titlePrefix: string
  titleAccent: string
  shortDescription: string
  duration: "halfDay" | "fullDay" | "multiDay"
  pillar: "standard" | "experiences" | "logistics"
  subcategory: string
  groupSize: string
  durationLabel: string
  location: string
  description: string
  experienceBody: string
  experienceItems: { strong: string; body: string }[]
  routeHighlights: string[]
  whatsIncluded: string[]
  coverImageUrl?: string | null
  galleryImageUrls: string[]
}

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const FALLBACK_THUMBNAILS = [
  "/corporate/experiences/detail-1.webp",
  "/corporate/experiences/detail-2.png",
  "/corporate/experiences/detail-3.png",
  "/corporate/experiences/detail-4.png",
]

function Divider() {
  return <div className="h-px w-full bg-[rgba(28,27,24,0.08)]" />
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[24px] font-medium leading-tight text-[#0D0D0D]" style={serif}>
      {children}
    </h3>
  )
}

function BulletList({ items }: { items: { strong?: string; body: string }[] }) {
  return (
    <ul className="flex list-disc flex-col gap-3 pl-5 text-[14px] leading-[1.4] text-[#696969]" style={sans}>
      {items.map((item, i) => (
        <li key={i}>
          {item.strong && (
            <span className="font-semibold text-[#1c1b18]">{item.strong} </span>
          )}
          {item.body}
        </li>
      ))}
    </ul>
  )
}

function MobileCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="relative h-[360px] w-full overflow-hidden md:hidden">
      <Image
        src={images[active]!}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="flex size-8 items-center justify-center bg-[rgba(247,244,239,0.9)] text-[#1c1b18] backdrop-blur-sm transition-colors hover:bg-[#F7F4EF]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === active ? "size-[6px] bg-[#1c1b18]" : "size-[5px] bg-[rgba(28,27,24,0.35)]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="flex size-8 items-center justify-center bg-[rgba(247,244,239,0.9)] text-[#1c1b18] backdrop-blur-sm transition-colors hover:bg-[#F7F4EF]"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}

export function ExperienceDetailDrawer({
  open,
  onOpenChange,
  experience,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  experience: ExperienceDetail | null
}) {
  const td = useTranslations("corporatePage.experiences.detail")

  const titlePrefix = experience?.titlePrefix ?? ""
  const titleAccent = experience?.titleAccent ?? ""
  const metaPeople = experience?.groupSize || td("metaPeople")
  const metaDuration = experience?.durationLabel || td("metaDuration")
  const metaLocation = experience?.location || td("metaLocation")
  const description = experience?.description || td("description")
  const experienceBody = experience?.experienceBody || `${td("experienceBody1")}\n\n${td("experienceBody2")}`
  const bodyParagraphs = experienceBody.split(/\n{2,}/).filter(Boolean)

  const experienceItems = experience?.experienceItems?.length
    ? experience.experienceItems
    : (td.raw("experienceItems") as { strong: string; body: string }[])
  const routeItems = experience?.routeHighlights?.length
    ? experience.routeHighlights
    : (td.raw("routeItems") as string[])
  const includedItems = experience?.whatsIncluded?.length
    ? experience.whatsIncluded
    : (td.raw("includedItems") as string[])
  const galleryImages = experience?.galleryImageUrls?.length
    ? experience.galleryImageUrls
    : FALLBACK_THUMBNAILS

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="lm-drawer !w-full !max-w-none overflow-y-auto bg-[#F7F4EF] p-0 [&>button.ring-offset-background]:hidden sm:!max-w-none md:!w-[1080px]"
        style={sans}
      >
        <SheetTitle className="sr-only">
          {titlePrefix} {titleAccent}
        </SheetTitle>
        <SheetClose
          className="absolute right-5 top-5 z-20 flex size-10 items-center justify-center text-[#1c1b18] transition-opacity hover:opacity-70 focus:outline-none"
          aria-label="Close"
        >
          <X className="size-6" strokeWidth={1.5} />
        </SheetClose>
        <div className="flex flex-col md:flex-row md:items-stretch">
          <MobileCarousel images={galleryImages} />
          <div className="flex w-full flex-col gap-6 p-6 md:max-w-[540px] md:p-10">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-[#A08248]" />
              <span
                className="text-[12px] font-semibold uppercase tracking-[2px] text-[#A08248]"
                style={sans}
              >
                {td("eyebrow")}
              </span>
            </div>

            <h2 className="text-[36px] leading-none md:text-[48px]" style={serif}>
              <span className="text-[#0D0D0D]">{titlePrefix} </span>
              <span className="italic text-[#A08248]">{titleAccent}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-[#A08248]" strokeWidth={1.8} />
                <span className="text-[12px] leading-none text-[#696969]" style={sans}>
                  {metaPeople}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-[#A08248]" strokeWidth={1.8} />
                <span className="text-[12px] leading-none text-[#696969]" style={sans}>
                  {metaDuration}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4 text-[#A08248]" strokeWidth={1.8} />
                <span className="text-[12px] leading-none text-[#696969]" style={sans}>
                  {metaLocation}
                </span>
              </div>
            </div>

            <Divider />

            <SheetClose asChild>
              <Link
                href="/corporate#request-proposal"
                className="inline-flex h-12 w-fit items-center bg-[#A08248] px-6 py-[9px] text-white transition-colors hover:bg-[#b89558]"
                style={sans}
              >
                <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">
                  {td("cta")}
                </span>
                <ArrowRight className="size-[14px]" strokeWidth={2} />
              </Link>
            </SheetClose>

            <p className="text-[14px] leading-[1.4] text-[#696969]" style={sans}>
              {description}
            </p>

            <SectionHeading>{td("experienceHeading")}</SectionHeading>

            {bodyParagraphs.map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.4] text-[#696969]" style={sans}>
                {p}
              </p>
            ))}

            <BulletList items={experienceItems} />

            <Divider />

            <SectionHeading>{td("routeHeading")}</SectionHeading>
            <BulletList items={routeItems.map((body) => ({ body }))} />

            <Divider />

            <SectionHeading>{td("includedHeading")}</SectionHeading>
            <BulletList items={includedItems.map((body) => ({ body }))} />
          </div>

          <div className="hidden w-full flex-col gap-[2px] md:flex md:flex-1 md:self-stretch">
            {galleryImages.length === 0 ? null : galleryImages.slice(0, 4).map((src, i) => (
              <div key={i} className="relative h-0 w-full flex-1">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="530px"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
