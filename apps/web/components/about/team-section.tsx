"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"

type Member = {
  id: string
  image: string
  name: string
  role: string
  bio?: string
}

const FALLBACK_MEMBERS: { id: string; image: string; nameKey: string; roleKey: string }[] = [
  { id: "m1", image: "/about/team-1.png", nameKey: "members.m1.name", roleKey: "members.m1.role" },
  { id: "m2", image: "/about/team-2.png", nameKey: "members.m2.name", roleKey: "members.m2.role" },
  { id: "m3", image: "/about/team-3.png", nameKey: "members.m3.name", roleKey: "members.m3.role" },
  { id: "m4", image: "/about/team-4.png", nameKey: "members.m4.name", roleKey: "members.m4.role" },
  { id: "m5", image: "/about/team-5.png", nameKey: "members.m5.name", roleKey: "members.m5.role" },
  { id: "m6", image: "/about/team-6.png", nameKey: "members.m6.name", roleKey: "members.m6.role" },
  { id: "m7", image: "/about/team-7.png", nameKey: "members.m7.name", roleKey: "members.m7.role" },
  { id: "m8", image: "/about/team-8.png", nameKey: "members.m8.name", roleKey: "members.m8.role" },
]

const PER_PAGE_DESKTOP = 8
const PER_PAGE_MOBILE = 8

function MemberCard({ member, onClick }: { member: Member; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${member.name} — ${member.role}`}
      className="group relative aspect-[3/4] block w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full -translate-x-1/2 origin-center scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 z-20"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(201,169,110,0) 8%, #C9A96E 50%, rgba(201,169,110,0) 92%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-2px] h-[5px] w-[5px] rounded-full bg-[#C9A96E] -translate-x-1/2 opacity-0 scale-0 transition-all duration-500 ease-out delay-100 group-hover:opacity-100 group-hover:scale-100 z-20"
        style={{ boxShadow: "0 0 8px rgba(201,169,110,0.6)" }}
      />
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 320px"
        />
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500 ease-out group-hover:bg-black/55"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        />
        <div className="absolute inset-x-0 bottom-0 px-6 py-8 flex flex-col gap-2">
          <p
            className="text-[#C9A96E] text-[12px] font-semibold uppercase tracking-[2px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {member.role}
          </p>
          <p
            className="text-white text-[24px] font-normal leading-none"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {member.name}
          </p>
        </div>
      </div>
    </button>
  )
}

function MemberModal({
  member,
  bioFallback,
  closeLabel,
  prevLabel,
  nextLabel,
  onClose,
  onPrev,
  onNext,
}: {
  member: Member
  bioFallback: string
  closeLabel: string
  prevLabel: string
  nextLabel: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.name}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[rgba(201,169,110,0.22)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 z-10 size-9 flex items-center justify-center border border-[rgba(201,169,110,0.4)] text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
        >
          <X className="size-[18px]" strokeWidth={1.5} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[480px] bg-[#0D0D0D]">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>

          <div className="flex flex-col gap-6 p-8 md:p-12">
            <div className="flex flex-col gap-2">
              <p
                className="text-[#C9A96E] text-[12px] font-semibold uppercase tracking-[2px]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {member.role}
              </p>
              <h3
                className="text-white text-[36px] md:text-[44px] font-normal leading-[1.1]"
                style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
              >
                {member.name}
              </h3>
            </div>

            <div className="h-px w-12 bg-[#C9A96E]" />

            <p
              className="text-[#999] text-[14px] leading-[1.6] whitespace-pre-line"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {member.bio?.trim() ? member.bio : bioFallback}
            </p>

            <div className="mt-auto flex items-center gap-2 pt-6">
              <button
                type="button"
                onClick={onPrev}
                aria-label={prevLabel}
                className="size-11 border border-[rgba(154,117,53,0.4)] flex items-center justify-center text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
              >
                <ArrowLeft className="size-[18px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label={nextLabel}
                className="size-11 border border-[rgba(154,117,53,0.4)] flex items-center justify-center text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
              >
                <ArrowRight className="size-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export function TeamSection() {
  const t = useTranslations("aboutPage.team")
  const [page, setPage] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const dbMembers = useQuery(api.teamMembers.listPublished)

  const members: Member[] = useMemo(() => {
    if (dbMembers && dbMembers.length > 0) {
      return dbMembers.map((m) => ({
        id: m._id,
        image: m.imageUrl ?? "/about/team-1.png",
        name: m.name,
        role: m.role,
        bio: m.bio,
      }))
    }
    return FALLBACK_MEMBERS.map((m) => ({
      id: m.id,
      image: m.image,
      name: t(m.nameKey),
      role: t(m.roleKey),
    }))
  }, [dbMembers, t])

  const totalPages = Math.max(1, Math.ceil(members.length / PER_PAGE_DESKTOP))
  const safePage = Math.min(page, totalPages - 1)
  const slice = members.slice(safePage * PER_PAGE_DESKTOP, (safePage + 1) * PER_PAGE_DESKTOP)

  const activeIndex = activeId ? members.findIndex((m) => m.id === activeId) : -1
  const activeMember = activeIndex >= 0 ? members[activeIndex] : null
  const goPrev = useCallback(() => {
    if (members.length === 0) return
    setActiveId((id) => {
      const i = members.findIndex((m) => m.id === id)
      const next = (i - 1 + members.length) % members.length
      return members[next]?.id ?? null
    })
  }, [members])
  const goNext = useCallback(() => {
    if (members.length === 0) return
    setActiveId((id) => {
      const i = members.findIndex((m) => m.id === id)
      const next = (i + 1) % members.length
      return members[next]?.id ?? null
    })
  }, [members])

  return (
    <section id="team" className="scroll-mt-[56px] bg-[#1a1a1a] flex flex-col items-center px-4 md:px-[82px] py-16 md:py-20">
      <div className="flex flex-col gap-6 items-center w-full max-w-[1280px]">
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
            {t("heading")}
          </h2>
          <p
            className="text-[14px] text-center text-[#999] max-w-[540px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 py-4">
          {slice.map((m) => (
            <MemberCard key={m.id} member={m} onClick={() => setActiveId(m.id)} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <CarouselArrow
              direction="left"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={safePage === 0}
            />
            <div className="flex gap-2 items-center px-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all",
                    i === safePage ? "size-[6px] bg-[#C9A96E]" : "size-[5px] bg-[rgba(201,169,110,0.4)]",
                  )}
                />
              ))}
            </div>
            <CarouselArrow
              direction="right"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={safePage >= totalPages - 1}
            />
          </div>
        )}
      </div>

      {activeMember && (
        <MemberModal
          member={activeMember}
          bioFallback={t("bioFallback")}
          closeLabel={t("modalClose")}
          prevLabel={t("modalPrev")}
          nextLabel={t("modalNext")}
          onClose={() => setActiveId(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  )
}
