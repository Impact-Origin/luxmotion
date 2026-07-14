"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight, Calendar, Check } from "lucide-react"
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
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"
import { readReferralCookie } from "@/lib/referral"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const VEHICLE_OPTIONS = [
  { id: "standard", src: "/wedding/quote-standard.png", labelKey: "vehicles.standard" },
  { id: "executive", src: "/wedding/quote-executive.png", labelKey: "vehicles.executive" },
  { id: "firstclass", src: "/wedding/quote-firstclass.png", labelKey: "vehicles.firstClass" },
  { id: "van", src: "/wedding/quote-van.png", labelKey: "vehicles.van" },
  { id: "coach", src: "/wedding/quote-coach.png", labelKey: "vehicles.coach" },
] as const

type ExtraPriceShape = "flat" | "perGuest"

interface ExtraDef {
  id: string
  image: string
  price: number
  unitKey: string
  priceShape: ExtraPriceShape
  mostRequested?: boolean
}

const EXTRAS: ExtraDef[] = [
  { id: "matricula", image: "/wedding-whitelabel/extras/matricula.png", price: 85, unitKey: "unitMain", priceShape: "flat" },
  { id: "floral", image: "/wedding-whitelabel/extras/decoracao-floral.png", price: 85, unitKey: "unitPerCar", priceShape: "flat", mostRequested: true },
  { id: "champanhe", image: "/wedding-whitelabel/extras/champanhe.png", price: 85, unitKey: "unitPerCar", priceShape: "flat" },
  { id: "justMarried", image: "/wedding-whitelabel/extras/just-married.png", price: 85, unitKey: "unitPerCar", priceShape: "flat" },
  { id: "redCarpet", image: "/wedding-whitelabel/extras/tapete-vermelho.png", price: 85, unitKey: "unitPerArrival", priceShape: "flat" },
  { id: "petalas", image: "/wedding-whitelabel/extras/petalas.png", price: 85, unitKey: "unitPerMoment", priceShape: "flat" },
  { id: "welcomeKit", image: "/wedding-whitelabel/extras/kit-boas-vindas.png", price: 85, unitKey: "unitPerGuest", priceShape: "perGuest" },
  { id: "classicCar", image: "/wedding-whitelabel/extras/veiculo-classico.png", price: 85, unitKey: "unitOnLocation", priceShape: "flat", mostRequested: true },
]

const BUDGET_MIN = 150
const BUDGET_MAX = 50000
const BUDGET_STEP = 50

function formatBudget(value: number, locale: string) {
  return value.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
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
              className={`shrink-0 w-[200px] flex flex-col gap-2 px-[12.8px] pt-[16.8px] pb-[16.8px] border transition-colors ${
                selected
                  ? "bg-[rgba(168,131,58,0.08)] border-[#a8833a]"
                  : "bg-[rgba(168,131,58,0.04)] border-[rgba(168,131,58,0.4)] hover:border-[#a8833a]"
              }`}
            >
              <div className="relative h-[100px] w-full">
                <Image src={o.src} alt={o.label} fill sizes="200px" className="object-contain" />
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

function ExtraCard({
  def,
  title,
  desc,
  unitLabel,
  mostRequestedLabel,
  pricePerGuestSuffix,
  selected,
  onToggle,
}: {
  def: ExtraDef
  title: string
  desc: string
  unitLabel: string
  mostRequestedLabel: string
  pricePerGuestSuffix: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "group text-left flex flex-col bg-white border transition-colors w-full overflow-hidden focus:outline-none",
        selected
          ? "border-[#a8833a]"
          : "border-[rgba(168,131,58,0.18)] hover:border-[rgba(168,131,58,0.55)]",
      )}
    >
      <div className="relative w-full aspect-[164/126] bg-[#faf7f2] overflow-hidden">
        <Image
          src={def.image}
          alt={title}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
        {def.mostRequested && (
          <span
            className="absolute top-2 left-2 inline-flex items-center bg-[#a08248] text-white text-[9px] font-semibold uppercase tracking-[1px] px-2 py-1"
            style={SANS_FONT}
          >
            {mostRequestedLabel}
          </span>
        )}
        <span
          className={cn(
            "absolute top-2 right-2 inline-flex items-center justify-center size-5 border transition-colors",
            selected
              ? "bg-[#a08248] border-[#a08248] text-white"
              : "bg-white/90 border-[rgba(168,131,58,0.35)] text-transparent group-hover:border-[#a08248]",
          )}
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>
      <div className="flex flex-col gap-2 px-3 pt-3 pb-2 flex-1">
        <h3
          className="text-[16px] leading-tight font-normal text-[#1a1612]"
          style={SERIF_FONT}
        >
          {title}
        </h3>
        <p
          className="text-[12px] leading-[1.35] text-[#7a746e] line-clamp-4"
          style={SANS_FONT}
        >
          {desc}
        </p>
      </div>
      <div className="mt-auto bg-[#faf7f2] border-t border-[rgba(168,131,58,0.12)] px-3 py-2 flex items-baseline justify-between gap-2">
        <span
          className="text-[18px] font-light text-[#a08248] leading-none"
          style={SERIF_FONT}
        >
          €{def.price}
          {def.priceShape === "perGuest" && (
            <span className="text-[11px] font-normal" style={SANS_FONT}>
              {pricePerGuestSuffix}
            </span>
          )}
        </span>
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.9px] text-[#7a746e] text-right leading-tight"
          style={SANS_FONT}
        >
          {unitLabel}
        </span>
      </div>
    </button>
  )
}

function SectionHeading({
  eyebrow,
  headingStart,
  headingAccent,
}: {
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

export function WeddingWhitelabelQuoteSection({
  partnershipSlug,
}: {
  partnershipSlug?: string
} = {}) {
  const t = useTranslations("weddingWhitelabel.quote")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("standard")
  const [phone, setPhone] = useState("")
  const [numVehicles, setNumVehicles] = useState<string>("")
  const [budget, setBudget] = useState<number>(BUDGET_MIN)
  const [submitting, setSubmitting] = useState(false)
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set())
  const submitMutation = useMutation(api.weddingQuoteSubmissions.submit)
  const budgetPct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100
  const { ref: revealRef, reveal } = useScrollReveal<HTMLDivElement>()

  const selectedExtrasTotal = useMemo(
    () =>
      EXTRAS.filter((e) => selectedExtras.has(e.id)).reduce(
        (sum, e) => sum + e.price,
        0,
      ),
    [selectedExtras],
  )

  function toggleExtra(id: string) {
    setSelectedExtras((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    const guestsRaw = fd.get("guests")?.toString() ?? ""
    const guests = guestsRaw ? Number(guestsRaw) : undefined
    const numVehiclesNum =
      numVehicles && numVehicles !== "6+" ? Number(numVehicles) : undefined
    const notes = (fd.get("notes") || "").toString()
    const extrasTitles = EXTRAS.filter((e) => selectedExtras.has(e.id)).map(
      (e) => t(`extras.items.${e.id}.title`),
    )
    const composedMessage = [
      extrasTitles.length ? `Extras: ${extrasTitles.join(", ")}` : null,
      notes || null,
    ]
      .filter(Boolean)
      .join("\n\n")

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
        budget,
        vehicle: selectedVehicle,
        message: composedMessage || undefined,
        referralSlug: partnershipSlug || readReferralCookie() || undefined,
      })
      toast.success(t("successToast"))
      formEl.reset()
      setPhone("")
      setNumVehicles("")
      setBudget(BUDGET_MIN)
      setSelectedVehicle("standard")
      setSelectedExtras(new Set())
    } catch {
      toast.error(t("errorToast"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="wedding-quote"
      className="scroll-mt-[80px] bg-[#f7f4ef] px-4 md:px-12 py-14 md:py-24"
    >
      <div ref={revealRef} className="max-w-[900px] mx-auto flex flex-col gap-6">
        <div className={reveal()}>
          <SectionHeading
            eyebrow={t("eyebrow")}
            headingStart={t("headingStart")}
            headingAccent={t("headingAccent")}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "bg-white border border-[rgba(168,131,58,0.15)] shadow-[0_4px_40px_rgba(0,0,0,0.07)] flex flex-col gap-4 px-6 md:px-[48.8px] pt-[60px] md:pt-[90.8px] pb-[48.8px] relative overflow-clip",
            reveal(),
          )}
          style={{ transitionDelay: "180ms" }}
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
              <TextInput
                name="guests"
                required
                placeholder={t("placeholders.guests")}
                type="number"
              />
            </Field>
            <Field label={t("fields.venue")}>
              <TextInput name="venue" placeholder={t("placeholders.venue")} />
            </Field>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <Field label={t("fields.numVehicles")}>
              <Select value={numVehicles} onValueChange={setNumVehicles}>
                <SelectTrigger
                  className="w-full h-11 rounded-none bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] hover:bg-[#f3eee5] data-[state=open]:border-[#a08248] focus-visible:ring-0 focus-visible:border-[#a08248] shadow-none px-[13px] text-[14px] text-[#1a1612] data-[placeholder]:text-[#999] [&_svg]:text-[#7a746e]"
                  style={SANS_FONT}
                >
                  <SelectValue placeholder={t("placeholders.numVehicles")} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[rgba(154,117,53,0.22)] rounded-none shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
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
            <Field label={t("fields.budget")} required>
              <div className="flex flex-col gap-2 w-full h-11 justify-center">
                <div className="relative h-[6px] w-full bg-[#1a1612]">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#a08248]"
                    style={{ width: `${budgetPct}%` }}
                  />
                  <input
                    type="range"
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                    step={BUDGET_STEP}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    aria-label={t("fields.budget")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-[#a08248] border-2 border-[#faf7f2] shadow-[0_1px_3px_rgba(0,0,0,0.2)] pointer-events-none"
                    style={{ left: `${budgetPct}%` }}
                  />
                </div>
                <div
                  className="flex justify-between text-[11px] text-[#7a746e] leading-none"
                  style={SANS_FONT}
                >
                  <span>{formatBudget(BUDGET_MIN, "pt-PT")}</span>
                  <span className="text-[#1a1612] font-semibold">
                    {formatBudget(budget, "pt-PT")}
                  </span>
                  <span>+{formatBudget(BUDGET_MAX, "pt-PT")}</span>
                </div>
              </div>
            </Field>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <FieldLabel text={t("fields.pickup")} />
            <TextInput name="pickup" placeholder={t("placeholders.pickup")} />
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

          <div className="flex flex-col gap-3 w-full">
            <FieldLabel text={t("fields.extras")} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[6px]">
              {EXTRAS.map((def) => (
                <ExtraCard
                  key={def.id}
                  def={def}
                  title={t(`extras.items.${def.id}.title`)}
                  desc={t(`extras.items.${def.id}.desc`)}
                  unitLabel={t(`extras.${def.unitKey}`)}
                  mostRequestedLabel={t("extras.mostRequested")}
                  pricePerGuestSuffix={t("extras.pricePerGuest")}
                  selected={selectedExtras.has(def.id)}
                  onToggle={() => toggleExtra(def.id)}
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-[rgba(168,131,58,0.18)] bg-white px-4 md:px-5 py-3 md:py-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[1.35px] text-[#7a746e] leading-none"
                  style={SANS_FONT}
                >
                  {t("extras.selectedLabel")}
                </span>
                <span
                  className="text-[14px] text-[#1a1612] leading-none"
                  style={SANS_FONT}
                >
                  {t("extras.itemsLabel", { count: selectedExtras.size })}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[14px] text-[#7a746e] leading-none"
                  style={SANS_FONT}
                >
                  {t("extras.fromPrice")}
                </span>
                <span
                  className="text-[28px] md:text-[32px] font-light text-[#a08248] leading-none italic"
                  style={SERIF_FONT}
                >
                  €{selectedExtrasTotal}
                </span>
              </div>
            </div>
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
