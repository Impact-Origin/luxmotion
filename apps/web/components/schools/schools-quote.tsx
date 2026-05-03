"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, ShieldCheck, type LucideIcon } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  GooglePlacesInput,
  type GooglePlaceValue,
} from "@/components/ui/google-places-input"
import { DateTimePicker } from "@/components/checkout/date-time-picker"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const INPUT_BASE =
  "w-full h-[44px] bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] px-[13px] py-[14px] text-[14px] text-[#0d0d0d] placeholder:text-[#999] focus:outline-none focus:border-[#a08248] transition-colors leading-none"

const EMPTY_PLACE: GooglePlaceValue = {
  location: "",
  placeId: null,
  lat: null,
  lng: null,
}

type VehicleKey = "standard" | "business" | "van" | "bus"

const VEHICLES: { key: VehicleKey; src: string }[] = [
  { key: "standard", src: "/schools/quote/standard.png" },
  { key: "business", src: "/schools/quote/business.png" },
  { key: "van", src: "/schools/quote/van.png" },
  { key: "bus", src: "/schools/quote/bus.png" },
]

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label
      className="text-[10px] font-semibold uppercase tracking-[1.35px] text-[#7a746e] leading-none"
      style={SANS_FONT}
    >
      {children}
      {required ? <span className="text-[#e32828]">*</span> : null}
    </label>
  )
}

function TextField({
  label,
  required,
  placeholder,
  type = "text",
  trailingIcon: Icon,
  name,
}: {
  label: string
  required?: boolean
  placeholder: string
  type?: string
  trailingIcon?: LucideIcon
  name?: string
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative w-full">
        <input
          name={name}
          required={required}
          type={type}
          placeholder={placeholder}
          className={INPUT_BASE + (Icon ? " pr-10" : "")}
          style={SANS_FONT}
        />
        {Icon ? (
          <Icon
            className="size-4 text-[#a08248] absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2}
          />
        ) : null}
      </div>
    </div>
  )
}

function FieldWrapper({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </div>
  )
}

function TextArea({
  label,
  placeholder,
  name,
}: {
  label: string
  placeholder: string
  name?: string
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        placeholder={placeholder}
        className="w-full h-[102px] bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] px-[13px] py-[14px] text-[14px] text-[#0d0d0d] placeholder:text-[#999] focus:outline-none focus:border-[#a08248] transition-colors resize-none leading-[1.3]"
        style={SANS_FONT}
      />
    </div>
  )
}

function VehicleCard({
  imgSrc,
  name,
  capacity,
  selected,
  onClick,
}: {
  imgSrc: string
  name: string
  capacity: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex flex-col gap-2 items-center justify-center px-[12.8px] py-[16.8px] h-full min-w-0 flex-1 transition-all " +
        (selected
          ? "bg-[rgba(168,131,58,0.16)] border-2 border-[#a08248]"
          : "bg-[rgba(168,131,58,0.08)] border border-[rgba(168,131,58,0.4)] hover:border-[#a08248]")
      }
    >
      <div className="relative h-20 w-full max-w-[132.47px]">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="132px"
          className="object-contain pointer-events-none"
        />
      </div>
      <div className="flex flex-col gap-2 items-center text-center w-full">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.72px] text-[#a8833a] leading-none whitespace-nowrap"
          style={SANS_FONT}
        >
          {name}
        </span>
        <span
          className="text-[12px] text-[#696969] leading-[1.2] whitespace-nowrap"
          style={SANS_FONT}
        >
          {capacity}
        </span>
      </div>
    </button>
  )
}

export function SchoolsQuote() {
  const t = useTranslations("schools.quote")
  const [vehicle, setVehicle] = useState<VehicleKey>("standard")
  const [page, setPage] = useState(0)
  const [phone, setPhone] = useState("")
  const [pickup, setPickup] = useState<GooglePlaceValue>(EMPTY_PLACE)
  const [dropoff, setDropoff] = useState<GooglePlaceValue>(EMPTY_PLACE)
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const submitMutation = useMutation(api.schoolQuoteSubmissions.submit)

  const totalPages = Math.ceil(VEHICLES.length / 2)
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    const childrenRaw = fd.get("children")?.toString() ?? ""
    const children = childrenRaw ? Number(childrenRaw) : undefined
    try {
      await submitMutation({
        name: (fd.get("name") || "").toString(),
        email: (fd.get("email") || "").toString(),
        phone,
        children,
        route: (fd.get("route") || "").toString() || undefined,
        departureTime: departureDate ? departureDate.toISOString() : undefined,
        pickup: pickup.location || undefined,
        dropoff: dropoff.location || undefined,
        vehicle,
        message: (fd.get("message") || "").toString() || undefined,
      })
      toast.success(t("successToast"))
      formEl.reset()
      setPhone("")
      setPickup(EMPTY_PLACE)
      setDropoff(EMPTY_PLACE)
      setDepartureDate(undefined)
      setVehicle("standard")
    } catch {
      toast.error(t("errorToast"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-white px-4 md:px-[80px] py-[72px] md:py-[96px]">
      <div className="max-w-[900px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#a08248]" />
          </div>

          <h2
            className="text-[36px] md:text-[48px] leading-[1.1] text-[#1a1612] text-center font-normal"
            style={SERIF_FONT}
          >
            {t("title")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>
          </h2>

          <p
            className="text-[14px] leading-[1.2] text-[#696969] text-center max-w-[480px] px-2"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>

        <form
          className="bg-white border border-[rgba(168,131,58,0.15)] flex flex-col gap-4 px-[17px] py-[25px] md:px-[49px] md:py-[41px] w-full"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <TextField
              name="name"
              label={t("fields.name.label")}
              required
              placeholder={t("fields.name.placeholder")}
            />
            <TextField
              name="email"
              label={t("fields.email.label")}
              required
              type="email"
              placeholder={t("fields.email.placeholder")}
            />
            <FieldWrapper label={t("fields.phone.label")} required>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                defaultCountry="pt"
                placeholder="000 000 000"
                wedding
              />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <TextField
              name="children"
              label={t("fields.children.label")}
              required
              type="number"
              placeholder="1"
            />
            <TextField
              name="route"
              label={t("fields.route.label")}
              placeholder={t("fields.route.placeholder")}
            />
            <FieldWrapper label={t("fields.time.label")}>
              <DateTimePicker
                value={departureDate}
                onChange={setDepartureDate}
                variant="quote"
                placeholder={t("fields.time.placeholder")}
                label={t("fields.time.label")}
              />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <FieldWrapper label={t("fields.pickup.label")}>
              <GooglePlacesInput
                value={pickup}
                onChange={setPickup}
                placeholder={t("fields.pickup.placeholder")}
                variant="quote"
              />
            </FieldWrapper>
            <FieldWrapper label={t("fields.dropoff.label")}>
              <GooglePlacesInput
                value={dropoff}
                onChange={setDropoff}
                placeholder={t("fields.dropoff.placeholder")}
                variant="quote"
              />
            </FieldWrapper>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <FieldLabel>{t("fields.vehicle.label")}</FieldLabel>

            <div className="hidden md:grid grid-cols-4 gap-[3px] h-[155.6px] w-full">
              {VEHICLES.map((v) => (
                <VehicleCard
                  key={v.key}
                  imgSrc={v.src}
                  name={t(`fields.vehicle.${v.key}.name`)}
                  capacity={t(`fields.vehicle.${v.key}.capacity`)}
                  selected={vehicle === v.key}
                  onClick={() => setVehicle(v.key)}
                />
              ))}
            </div>

            <div className="md:hidden relative w-full">
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-300 ease-out gap-2"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {Array.from({ length: totalPages }).map((_, p) => (
                    <div key={p} className="grid grid-cols-2 gap-2 w-full shrink-0">
                      {VEHICLES.slice(p * 2, p * 2 + 2).map((v) => (
                        <div key={v.key} className="h-[130.6px]">
                          <VehicleCard
                            imgSrc={v.src}
                            name={t(`fields.vehicle.${v.key}.name`)}
                            capacity={t(`fields.vehicle.${v.key}.capacity`)}
                            selected={vehicle === v.key}
                            onClick={() => setVehicle(v.key)}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {page < totalPages - 1 ? (
                <button
                  type="button"
                  onClick={nextPage}
                  aria-label="next"
                  className="absolute right-[-12px] top-1/2 -translate-y-1/2 size-8 bg-white border border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <ArrowRight className="size-[18px] text-[#a08248]" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          </div>

          <TextArea
            name="message"
            label={t("fields.message.label")}
            placeholder={t("fields.message.placeholder")}
          />

          <button
            type="submit"
            disabled={submitting}
            className="h-12 px-[22px] bg-[#a08248] hover:bg-[#8a6f3c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center gap-2 self-center md:self-auto md:px-8 md:w-auto md:mx-auto"
            style={SANS_FONT}
          >
            <span>{submitting ? "..." : t("submit")}</span>
            <ArrowRight className="size-4" strokeWidth={2} />
          </button>

          <div className="flex items-center justify-center gap-[5px] w-full">
            <ShieldCheck className="size-4 text-[#a08248] shrink-0" strokeWidth={1.75} />
            <span
              className="text-[12px] text-[#696969] leading-tight text-center"
              style={SANS_FONT}
            >
              {t("securityNote")}
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}
