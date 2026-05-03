"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { PhoneInput } from "@/components/ui/phone-input"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const VEHICLE_OPTIONS = [
  { id: "standard", src: "/wedding/quote-standard.png", labelKey: "vehicles.standard" },
  { id: "executive", src: "/wedding/quote-executive.png", labelKey: "vehicles.executive" },
  { id: "firstclass", src: "/wedding/quote-firstclass.png", labelKey: "vehicles.firstClass" },
  { id: "van", src: "/wedding/quote-van.png", labelKey: "vehicles.van" },
  { id: "coach", src: "/wedding/quote-coach.png", labelKey: "vehicles.coach" },
] as const

function FieldLabel({
  text,
  required,
}: {
  text: string
  required?: boolean
}) {
  return (
    <label
      className="text-[10px] font-semibold uppercase tracking-[1.35px] text-[#7a746e] leading-none"
      style={SANS_FONT}
    >
      {text}
      {required && <span className="text-[#e32828]">*</span>}
    </label>
  )
}

function TextInput({
  placeholder,
  type = "text",
  rightIcon,
  name,
  required,
}: {
  placeholder: string
  type?: string
  rightIcon?: React.ReactNode
  name?: string
  required?: boolean
}) {
  return (
    <div className="bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] h-11 px-[13px] flex items-center w-full focus-within:border-[#a08248] transition-colors">
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-2 bg-transparent outline-none text-[14px] text-[#1a1612] placeholder:text-[#999]"
        style={SANS_FONT}
      />
      {rightIcon}
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <FieldLabel text={label} required={required} />
      {children}
    </div>
  )
}

function VehiclePicker({
  selectedId,
  onSelect,
  options,
  scrollHintNext,
  scrollHintPrev,
}: {
  selectedId: string
  onSelect: (id: string) => void
  options: { id: string; src: string; label: string }[]
  scrollHintNext: string
  scrollHintPrev: string
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateButtons()
    const el = scrollRef.current
    if (!el) return
    const handler = () => updateButtons()
    el.addEventListener("scroll", handler, { passive: true })
    window.addEventListener("resize", handler)
    return () => {
      el.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [options.length])

  function scrollBy(delta: number) {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-[3px] overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {options.map((o) => {
          const selected = o.id === selectedId
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className={`shrink-0 w-[158px] flex flex-col gap-2 px-[12.8px] pt-[16.8px] pb-[16.8px] border transition-colors ${
                selected
                  ? "bg-[rgba(168,131,58,0.08)] border-[#a8833a]"
                  : "bg-[rgba(168,131,58,0.04)] border-[rgba(168,131,58,0.4)] hover:border-[#a8833a]"
              }`}
            >
              <div className="relative h-[100px] w-full">
                <Image
                  src={o.src}
                  alt={o.label}
                  fill
                  sizes="158px"
                  className="object-contain"
                />
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.72px] text-[#a8833a] text-center w-full"
                style={SANS_FONT}
              >
                {o.label}
              </span>
            </button>
          )
        })}
      </div>

      {canScrollLeft && (
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[64px] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #ffffff 30%, rgba(255,255,255,0) 100%)",
          }}
        />
      )}
      {canScrollRight && (
        <span
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-[64px] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(-90deg, #ffffff 30%, rgba(255,255,255,0) 100%)",
          }}
        />
      )}

      {canScrollLeft && (
        <button
          type="button"
          aria-label={scrollHintPrev}
          onClick={() => scrollBy(-161)}
          className="absolute left-3 top-[58px] -translate-y-1/2 size-8 bg-white border-[1.143px] border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.04)] z-10"
        >
          <ArrowLeft className="size-[18px] text-[#a08248]" strokeWidth={1.5} />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label={scrollHintNext}
          onClick={() => scrollBy(161)}
          className="absolute right-3 top-[58px] -translate-y-1/2 size-8 bg-white border-[1.143px] border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.04)] z-10"
        >
          <ArrowRight className="size-[18px] text-[#a08248]" strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

function SectionHeading({ eyebrow, headingStart, headingAccent }: {
  eyebrow: string
  headingStart: string
  headingAccent: string
}) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 items-center justify-center">
        <span className="h-px w-8 bg-[#a08248]" />
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-[#a08248]" />
      </div>
      <h2
        className="text-[36px] md:text-[48px] leading-tight font-normal text-[#1a1612] text-center"
        style={SERIF_FONT}
      >
        <span>{headingStart} </span>
        <span className="italic text-[#a8833a]">{headingAccent}</span>
      </h2>
    </div>
  )
}

export function WeddingQuoteSection() {
  const t = useTranslations("wedding.quote")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("standard")
  const [phone, setPhone] = useState("")
  const [numVehicles, setNumVehicles] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const submitMutation = useMutation(api.weddingQuoteSubmissions.submit)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    const guestsRaw = fd.get("guests")?.toString() ?? ""
    const guests = guestsRaw ? Number(guestsRaw) : undefined
    const numVehiclesNum = numVehicles && numVehicles !== "6+" ? Number(numVehicles) : undefined
    try {
      await submitMutation({
        fullName: (fd.get("fullName") || "").toString(),
        email: (fd.get("email") || "").toString(),
        phone,
        weddingDate: (fd.get("weddingDate") || "").toString() || undefined,
        guests,
        venue: (fd.get("venue") || "").toString() || undefined,
        pickup: (fd.get("pickup") || "").toString() || undefined,
        numVehicles: numVehiclesNum,
        vehicle: selectedVehicle,
        message: (fd.get("notes") || "").toString() || undefined,
      })
      toast.success(t("successToast"))
      formEl.reset()
      setPhone("")
      setNumVehicles("")
      setSelectedVehicle("standard")
    } catch {
      toast.error(t("errorToast"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-[#f7f4ef] px-4 md:px-12 py-14 md:py-24">
      <div className="max-w-[900px] mx-auto flex flex-col gap-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          headingStart={t("headingStart")}
          headingAccent={t("headingAccent")}
        />

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[rgba(168,131,58,0.15)] shadow-[0_4px_40px_rgba(0,0,0,0.07)] flex flex-col gap-4 px-6 md:px-[48.8px] pt-[60px] md:pt-[90.8px] pb-[48.8px] relative overflow-clip"
        >
          <span
            aria-hidden
            className="absolute top-[41.8px] left-[-0.2px] right-[-0.2px] h-[2px] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #a8833a 0%, rgba(201,169,110,0.2) 100%)",
            }}
          />

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <Field label={t("fields.fullName")} required>
              <TextInput name="fullName" required placeholder={t("placeholders.fullName")} />
            </Field>
            <Field label={t("fields.email")} required>
              <TextInput name="email" required placeholder={t("placeholders.email")} type="email" />
            </Field>
            <Field label={t("fields.phone")} required>
              <PhoneInput
                wedding
                value={phone}
                onChange={setPhone}
                placeholder={t("placeholders.phone")}
                defaultCountry="pt"
              />
            </Field>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <Field label={t("fields.weddingDate")} required>
              <TextInput
                name="weddingDate"
                required
                placeholder={t("placeholders.weddingDate")}
                rightIcon={<Calendar className="size-4 text-[#7a746e]" strokeWidth={1.5} />}
              />
            </Field>
            <Field label={t("fields.guests")} required>
              <TextInput name="guests" required placeholder={t("placeholders.guests")} type="number" />
            </Field>
            <Field label={t("fields.venue")}>
              <TextInput name="venue" placeholder={t("placeholders.venue")} />
            </Field>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <Field label={t("fields.pickup")}>
              <TextInput name="pickup" placeholder={t("placeholders.pickup")} />
            </Field>
            <Field label={t("fields.numVehicles")}>
              <Select value={numVehicles} onValueChange={setNumVehicles}>
                <SelectTrigger
                  className="w-full h-11 rounded-none bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] hover:bg-[#f3eee5] data-[state=open]:border-[#a08248] focus-visible:ring-0 focus-visible:border-[#a08248] shadow-none px-[13px] text-[14px] text-[#1a1612] data-[placeholder]:text-[#999] [&_svg]:text-[#7a746e]"
                  style={SANS_FONT}
                >
                  <SelectValue placeholder={t("placeholders.numVehicles")} />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-[rgba(154,117,53,0.22)] rounded-none shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
                >
                  {["1", "2", "3", "4", "5", "6+"].map((n) => (
                    <SelectItem
                      key={n}
                      value={n}
                      className="text-[14px] text-[#1a1612] rounded-none focus:bg-[rgba(168,131,58,0.08)] focus:text-[#1a1612] data-[state=checked]:text-[#a08248]"
                      style={SANS_FONT}
                    >
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <FieldLabel text={t("fields.vehicleType")} />
            <VehiclePicker
              selectedId={selectedVehicle}
              onSelect={setSelectedVehicle}
              scrollHintNext={t("vehiclesScrollNext")}
              scrollHintPrev={t("vehiclesScrollPrev")}
              options={VEHICLE_OPTIONS.map((o) => ({
                id: o.id,
                src: o.src,
                label: t(o.labelKey),
              }))}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <FieldLabel text={t("fields.notes")} />
            <div className="bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] h-[102px] px-[13px] py-[14px] flex items-start w-full focus-within:border-[#a08248] transition-colors">
              <textarea
                name="notes"
                placeholder={t("placeholders.notes")}
                className="w-full h-full px-2 bg-transparent outline-none text-[14px] text-[#1a1612] placeholder:text-[#999] resize-none"
                style={SANS_FONT}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-center h-12 px-[22px] bg-[#a08248] hover:bg-[#8a6f3c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 mt-2"
          >
            <span
              className="text-[14px] font-medium uppercase tracking-[1.1px] text-white"
              style={SANS_FONT}
            >
              {submitting ? "..." : t("submit")}
            </span>
            <ArrowRight className="size-4 text-white" strokeWidth={2} />
          </button>
        </form>
      </div>
    </section>
  )
}
